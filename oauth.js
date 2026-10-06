import crypto from 'node:crypto';

const STATE_COOKIE = 'equora_google_oauth_state';
const RESULT_COOKIE = 'equora_google_oauth_result';
const COOKIE_PATH = '/api/auth/oauth';

function getAppUrl(req) {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return new URL(process.env.APP_URL).origin;
  }

  const host = req.headers.host;
  if (!host) throw new Error('Unable to determine the application URL.');

  const forwardedProtocol = req.headers['x-forwarded-proto'];
  const protocol = forwardedProtocol || (host.startsWith('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}

function cookie(name, value, maxAge, secure) {
  return `${name}=${value}; Path=${COOKIE_PATH}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

function readCookie(req, name) {
  const cookieHeader = req.headers.cookie || '';
  const entry = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return entry ? entry.slice(name.length + 1) : null;
}

function clearCookies(secure) {
  return [
    cookie(STATE_COOKIE, '', 0, secure),
    cookie(RESULT_COOKIE, '', 0, secure),
  ];
}

function redirect(res, url, cookies = []) {
  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  res.statusCode = 302;
  res.setHeader('Location', url);
  res.end();
}

function sendErrorRedirect(res, appUrl, error, secure, cookies = []) {
  const target = new URL('/', appUrl);
  target.searchParams.set('oauth_error', error);
  redirect(res, target.toString(), [...clearCookies(secure), ...cookies]);
}

function signPayload(payload, secret) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifyPayload(value, secret) {
  if (!value) return null;
  const [encodedPayload, signature] = value.split('.');
  if (!encodedPayload || !signature) return null;

  const expected = crypto.createHmac('sha256', secret).update(encodedPayload).digest();
  let actual;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

async function startGoogleSignIn(req, res, appUrl) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret || clientId === 'YOUR_GOOGLE_CLIENT_ID' || clientSecret === 'YOUR_GOOGLE_CLIENT_SECRET') {
    return res.status(503).json({
      error: 'Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server.',
    });
  }

  const state = crypto.randomBytes(32).toString('hex');
  const secure = appUrl.startsWith('https://');
  const callbackUrl = `${appUrl}${COOKIE_PATH}`;
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('redirect_uri', callbackUrl);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('prompt', 'select_account');

  res.setHeader('Set-Cookie', cookie(STATE_COOKIE, state, 600, secure));
  return res.status(200).json({ authorizationUrl: authorizationUrl.toString() });
}

async function exchangeSession(req, res, secure) {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret || secret === 'YOUR_GOOGLE_CLIENT_SECRET') {
    return res.status(503).json({ error: 'Google sign-in is not configured on the server.' });
  }
  const payload = verifyPayload(readCookie(req, RESULT_COOKIE), secret);
  res.setHeader('Set-Cookie', clearCookies(secure));

  if (!payload?.user) {
    return res.status(401).json({ error: 'Google sign-in session expired. Please try again.' });
  }
  return res.status(200).json({ user: payload.user });
}

async function completeGoogleSignIn(req, res, appUrl) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const secure = appUrl.startsWith('https://');
  const params = new URL(req.url, appUrl).searchParams;
  const state = params.get('state');
  const savedState = readCookie(req, STATE_COOKIE);
  const providerError = params.get('error');

  if (providerError === 'access_denied') {
    return sendErrorRedirect(res, appUrl, 'access_denied', secure);
  }
  if (!state || !savedState || state !== savedState) {
    return sendErrorRedirect(res, appUrl, 'invalid_state', secure);
  }
  if (!params.get('code') || !clientId || !clientSecret) {
    return sendErrorRedirect(res, appUrl, 'exchange_failed', secure);
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: params.get('code'),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appUrl}${COOKIE_PATH}`,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenResponse.ok) {
      console.error('Google OAuth token exchange failed:', await tokenResponse.text());
      return sendErrorRedirect(res, appUrl, 'exchange_failed', secure);
    }

    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileResponse.ok) {
      console.error('Google OAuth user profile request failed:', await profileResponse.text());
      return sendErrorRedirect(res, appUrl, 'profile_failed', secure);
    }

    const profile = await profileResponse.json();
    if (!profile.sub || !profile.email || profile.email_verified !== true) {
      return sendErrorRedirect(res, appUrl, 'unverified_email', secure);
    }

    const user = {
      id: `google-${profile.sub}`,
      name: profile.name || profile.email.split('@')[0],
      email: profile.email,
      role: 'student',
      schoolOrOrg: 'Google Account',
      gradeLevel: 'Grade 11',
      avatarColor: 'from-rose-400 to-amber-400',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const signedResult = signPayload({ user, expiresAt: Date.now() + 120_000 }, clientSecret);
    const resultCookie = cookie(RESULT_COOKIE, signedResult, 120, secure);
    const target = new URL('/', appUrl);
    target.searchParams.set('oauth', 'success');
    return redirect(res, target.toString(), [...clearCookies(secure), resultCookie]);
  } catch (error) {
    console.error('Google OAuth callback failed:', error);
    return sendErrorRedirect(res, appUrl, 'exchange_failed', secure);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let appUrl;
  try {
    appUrl = getAppUrl(req);
  } catch (error) {
    console.error('Unable to determine application URL for Google OAuth:', error);
    return res.status(500).json({ error: 'Google sign-in could not be started because the application URL is unavailable.' });
  }

  const params = new URL(req.url, appUrl).searchParams;
  if (params.get('session') === '1') {
    return exchangeSession(req, res, appUrl.startsWith('https://'));
  }
  if (params.has('code') || params.has('error')) {
    return completeGoogleSignIn(req, res, appUrl);
  }
  return startGoogleSignIn(req, res, appUrl);
}
