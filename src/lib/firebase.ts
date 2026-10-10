import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import configFromFile from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || configFromFile.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || configFromFile.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || configFromFile.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || configFromFile.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || configFromFile.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || configFromFile.appId || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
  }
} else {
  console.warn(
    'Firebase Authentication is not yet configured. Please supply VITE_FIREBASE_* environment variables or ensure firebase-applet-config.json exists.'
  );
}

export { app, auth, db };

// Configure Google Auth Provider with account selection prompt
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Translates Firebase Auth error codes into friendly user messages
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account was found with this email. Please check your spelling or create an account.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please verify and try again, or use "Forgot password?".';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please verify your email and password, or use "Forgot password?".';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please use at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. The Google authentication popup was closed before completing.';
    case 'auth/cancelled-popup-request':
      return 'An authentication process is already open. Please complete or close it first.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Console. Please enable Email/Password or Google provider.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access has been temporarily restricted for your protection. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/missing-password':
      return 'Please enter a password.';
    case 'auth/missing-email':
      return 'Please enter an email address.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Executes Google sign-in via Popup, with a redirect fallback if the popup is blocked
 */
export async function signInWithGoogleFlow(): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured. Please check your Firebase settings.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      console.warn('Popup blocked; falling back to redirect flow...');
      await signInWithRedirect(auth, googleProvider);
      throw new Error('Redirecting to Google sign-in...');
    }
    throw error;
  }
}

/**
 * Registers a new user with Email and Password and sets their Display Name
 */
export async function signUpWithEmailFlow(
  name: string,
  email: string,
  pass: string
): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured. Please check your Firebase settings.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (name.trim()) {
    try {
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });
    } catch (profileErr) {
      console.warn('Failed to set user display name:', profileErr);
    }
  }
  return userCredential.user;
}

/**
 * Signs in an existing user with Email and Password
 */
export async function signInWithEmailFlow(email: string, pass: string): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured. Please check your Firebase settings.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return userCredential.user;
}

/**
 * Sends a password reset email to the specified address
 */
export async function sendPasswordResetFlow(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured. Please check your Firebase settings.');
  }

  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Signs out the currently authenticated user
 */
export async function signOutFlow(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

/**
 * Checks for any redirect result (if returning from redirect-based sign-in)
 */
export async function checkRedirectAuth(): Promise<FirebaseUser | null> {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (err) {
    console.warn('Error checking redirect auth result:', err);
    return null;
  }
}
