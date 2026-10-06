import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import googleOAuthHandler from './api/auth/oauth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const portArgIndex = process.argv.indexOf('--port');
const portFromArgs = portArgIndex !== -1 ? process.argv[portArgIndex + 1] : undefined;
const hostArgIndex = process.argv.indexOf('--host');
const hostFromArgs = hostArgIndex !== -1 ? process.argv[hostArgIndex + 1] : undefined;
const PORT = Number(process.env.PORT || portFromArgs) || 3000;
const HOST = process.env.HOST || hostFromArgs || '0.0.0.0';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// -------------------------------------------------------------
// In-memory Auth store for sessions & users
// -------------------------------------------------------------
interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'educator';
  schoolOrOrg?: string;
  gradeLevel?: string;
  avatarColor: string;
  createdAt: string;
}

const USERS: UserRecord[] = [
  {
    id: 'usr-student-1',
    name: 'Maya Lin',
    email: 'student@equora.edu',
    password: 'password123',
    role: 'student',
    gradeLevel: 'Grade 10',
    schoolOrOrg: 'Riverdale High School',
    avatarColor: 'from-amber-300 to-rose-400',
    createdAt: '2026-09-15',
  },
  {
    id: 'usr-educator-1',
    name: 'Dr. Arthur Chen',
    email: 'educator@equora.edu',
    password: 'password123',
    role: 'educator',
    schoolOrOrg: 'Oakridge District Curriculum Board',
    avatarColor: 'from-blue-400 to-indigo-600',
    createdAt: '2026-08-20',
  },
];

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const { password: _, ...userSafe } = user;
  res.json({
    token: `eq-tok-${user.id}-${Date.now()}`,
    user: userSafe,
  });
});

// POST /api/auth/signup
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { name, email, password, role, schoolOrOrg, gradeLevel } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  const existing = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
    role: role === 'educator' ? 'educator' : 'student',
    schoolOrOrg: schoolOrOrg || 'EQUORA Learning Community',
    gradeLevel: gradeLevel || (role === 'educator' ? 'Faculty' : 'High School'),
    avatarColor: role === 'educator' ? 'from-blue-400 to-indigo-600' : 'from-amber-300 to-rose-400',
    createdAt: new Date().toISOString().split('T')[0],
  };

  USERS.push(newUser);

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({
    token: `eq-tok-${newUser.id}-${Date.now()}`,
    user: userSafe,
  });
});

// POST /api/auth/demo
app.post('/api/auth/demo', (req: Request, res: Response) => {
  const { role } = req.body;
  const targetEmail = role === 'educator' ? 'educator@equora.edu' : 'student@equora.edu';
  const user = USERS.find((u) => u.email === targetEmail) || USERS[0];
  const { password: _, ...userSafe } = user;

  res.json({
    token: `eq-tok-${user.id}-${Date.now()}`,
    user: userSafe,
  });
});

// GET /api/auth/oauth starts Google sign-in and handles its callback/session handoff.
app.all('/api/auth/oauth', (req: Request, res: Response) => {
  void googleOAuthHandler(req, res);
});

// -------------------------------------------------------------
// POST /api/ocr
// High-fidelity Optical Character Recognition from textbook image
// -------------------------------------------------------------
app.post('/api/ocr', async (req: Request, res: Response) => {
  const { image } = req.body;

  if (!image || typeof image !== 'string') {
    res.status(400).json({ error: 'Image data URL is required.' });
    return;
  }

  // Attempt Gemini Vision transcription if client is configured
  if (aiClient) {
    try {
      const base64Data = image.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, '');
      const mimeTypeMatch = image.match(/^data:(image\/[a-z0-9.+-]+);base64,/i);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000));
      const ocrPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          'Extract and transcribe all text, headings, exercises, and captions visible in this textbook or document image verbatim. Maintain original line breaks. Return ONLY the transcribed text without conversational commentary or markdown formatting wrappers.',
        ],
        config: {
          temperature: 0.1,
        },
      });

      const response = await Promise.race([ocrPromise, timeoutPromise]);
      const text = response?.text?.trim();
      if (text) {
        res.json({ text, source: 'gemini-vision' });
        return;
      }
    } catch (err: any) {
      console.warn('Gemini vision OCR notice:', err?.message || err);
    }
  }

  res.json({ text: '', source: 'fallback' });
});

// -------------------------------------------------------------
// POST /api/analyze
// Analyzes OCR text for possible gender bias in textbooks/curriculum
// -------------------------------------------------------------
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ error: 'Text content is required for analysis.' });
    return;
  }

  const prompt = `You are EQUORA's expert curriculum analyst. Your task is to analyze textbook, curriculum, or educational passage text for POSSIBLE gender bias, representation imbalances, or stereotypes.

Guidelines:
1. Do NOT automatically label something as sexist or discriminatory simply because a particular gender appears in a particular role.
2. Carefully consider context: is it describing historical events (where restrictions historically existed), fictional examples, word problems, or instructional norms?
3. Categories to evaluate:
   - "Gendered roles"
   - "Occupational stereotypes"
   - "Unequal representation"
   - "Gendered language"
   - "Exclusion"
   - "Representation in leadership"
   - "Subject/activity stereotypes"
   - "Curriculum framing"
4. Be educational, nuanced, and constructive rather than accusatory.
5. If no obvious gender bias is present, explain that clearly.

Text to analyze:
"""
${text}
"""

Return a strictly valid JSON response adhering exactly to this structure:
{
  "detected": boolean,
  "status": "Possible gender bias detected" | "No obvious gender bias detected",
  "category": string (e.g. "Gendered roles", "Occupational stereotypes", "Representation in leadership", or "Balanced representation"),
  "evidence": string (quote the exact sentence or phrase from the text, or "N/A"),
  "whyItMatters": string (2-3 sentences providing a neutral, educational explanation of why this representation or phrasing may shape student perceptions),
  "context": string (explain whether the example is clearly biased, potentially stereotypical, or ambiguous/historically contextualized),
  "confidence": "Low" | "Medium" | "High",
  "alternativeFraming": string (how this textbook problem, sentence, or activity could be rephrased or expanded to be more balanced),
  "classroomDiscussionPrompt": string (a thoughtful question a student or teacher could ask in class about this passage)
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          systemInstruction: 'You are EQUORA, an objective, educational platform helping students analyze textbook representation and gender bias constructively and accurately.',
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        res.json({
          ...parsed,
          surroundingNote: 'AI-assisted observation — consider the surrounding context.',
        });
        return;
      }
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back to heuristic evaluation:', apiError);
    }
  }

  // Fallback intelligent heuristic analyzer for educational robustness
  const lower = text.toLowerCase();
  let detected = false;
  let category = 'Balanced representation';
  let evidence = 'No disproportionate phrasing detected in current passage.';
  let whyItMatters = 'The text uses neutral or contextualized language without reinforcing rigid gender roles.';
  let context = 'The phrasing appears neutral, informational, or historically situated.';
  let confidence: 'Low' | 'Medium' | 'High' = 'Medium';
  let alternativeFraming = 'The excerpt presents fair representation.';
  let classroomDiscussionPrompt = 'How does the representation of individuals in this passage compare with modern diverse society?';

  if (
    (lower.includes('mother') || lower.includes('mom') || lower.includes('wife')) &&
    (lower.includes('cooking') || lower.includes('cleaning') || lower.includes('kitchen') || lower.includes('dishes') || lower.includes('stay home')) &&
    (lower.includes('father') || lower.includes('dad') || lower.includes('husband')) &&
    (lower.includes('work') || lower.includes('office') || lower.includes('earning') || lower.includes('career') || lower.includes('breadwinner'))
  ) {
    detected = true;
    category = 'Gendered roles';
    evidence = text.match(/[^.?!]*(?:mother|father|wife|husband|home|office)[^.?!]*[.?!]/i)?.[0]?.trim() || text.slice(0, 100);
    whyItMatters = 'When textbooks consistently pair domestic duties exclusively with female figures and economic leadership with male figures, it subtly reinforces traditional division of labor as universal.';
    context = 'Potentially stereotypical: while many family structures exist, curriculum examples are stronger when they show varied household and career contributions.';
    confidence = 'High';
    alternativeFraming = 'Show varied examples throughout the chapter where fathers participate in domestic care and mothers lead external professional careers.';
    classroomDiscussionPrompt = 'Would this word problem or example read differently if the parental roles were reversed or shared equally?';
  } else if (
    (lower.includes('doctor') || lower.includes('scientist') || lower.includes('engineer') || lower.includes('ceo') || lower.includes('president')) &&
    (lower.includes('he ') || lower.includes('his ') || lower.includes('him ') || lower.includes('himself')) &&
    !lower.includes('she') && !lower.includes('her')
  ) {
    detected = true;
    category = 'Occupational stereotypes';
    evidence = text.match(/[^.?!]*(?:doctor|scientist|engineer|ceo|president)[^.?!]*[.?!]/i)?.[0]?.trim() || text.slice(0, 100);
    whyItMatters = 'Defaulting to male pronouns when introducing technical, scientific, or high-authority professions can inadvertently shape students’ subconscious sense of who belongs in STEM and leadership.';
    context = 'Potentially stereotypical: the use of generic masculine pronouns or singular male figures in leadership examples without female representation.';
    confidence = 'Medium';
    alternativeFraming = 'Use gender-neutral terms ("they/their") or highlight historical and contemporary female scientists, engineers, and executives.';
    classroomDiscussionPrompt = 'What message does using specific pronouns send when discussing general professions?';
  } else if (
    (lower.includes('nurse') || lower.includes('secretary') || lower.includes('assistant')) &&
    (lower.includes('she ') || lower.includes('her ') || lower.includes('herself')) &&
    !lower.includes('he ')
  ) {
    detected = true;
    category = 'Occupational stereotypes';
    evidence = text.match(/[^.?!]*(?:nurse|secretary|assistant)[^.?!]*[.?!]/i)?.[0]?.trim() || text.slice(0, 100);
    whyItMatters = 'Associating caregiving and support roles exclusively with women can narrow career expectations and perpetuate wage and status disparities in society.';
    context = 'Potentially stereotypical: while caregiving is vital, occupational representations in learning materials should reflect diversity across all genders.';
    confidence = 'Medium';
    alternativeFraming = 'Include male nurses and educators, and female technical directors or surgeons in problem sets.';
    classroomDiscussionPrompt = 'Why do certain professions historically carry gendered stigmas, and how can learning materials help overcome them?';
  } else if (
    lower.includes('mankind') || lower.includes('man-made') || lower.includes('policeman') || lower.includes('fireman') || lower.includes('businessman')
  ) {
    detected = true;
    category = 'Gendered language';
    evidence = text.match(/[^.?!]*(?:mankind|man-made|policeman|fireman|businessman)[^.?!]*[.?!]/i)?.[0]?.trim() || text.slice(0, 100);
    whyItMatters = 'Using "man" as the universal default for all human beings can lead students to mentally envision male individuals rather than humanity as a whole.';
    context = 'Clearly biased in modern linguistic standards: linguistic research shows gender-neutral terms increase cognitive inclusion.';
    confidence = 'High';
    alternativeFraming = 'Replace with "humankind/humanity", "synthetic/manufactured", "police officer", "firefighter", and "business professional".';
    classroomDiscussionPrompt = 'How does changing our everyday vocabulary change who feels included in civic and scientific endeavors?';
  } else if (lower.includes('girls') && lower.includes('boys') && (lower.includes('emotional') || lower.includes('math') || lower.includes('logic') || lower.includes('sports') || lower.includes('dolls') || lower.includes('cars'))) {
    detected = true;
    category = 'Subject/activity stereotypes';
    evidence = text.match(/[^.?!]*(?:boys|girls|emotional|math|logic|sports)[^.?!]*[.?!]/i)?.[0]?.trim() || text.slice(0, 100);
    whyItMatters = 'Dichotomizing interests (e.g. boys like sports/logic, girls like feelings/arts) discourages students from pursuing subjects that do not match traditional expectations.';
    context = 'Potentially stereotypical: generalizations about learning styles or interests based on biological sex.';
    confidence = 'Medium';
    alternativeFraming = 'Frame interests and aptitudes around individual curiosity and practice rather than gender groups.';
    classroomDiscussionPrompt = 'Have you ever felt pressured away from an activity because it was labeled as "for boys" or "for girls"?';
  }

  res.json({
    detected,
    status: detected ? 'Possible gender bias detected' : 'No obvious gender bias detected',
    category,
    evidence,
    whyItMatters,
    context,
    confidence,
    alternativeFraming,
    classroomDiscussionPrompt,
    surroundingNote: 'AI-assisted observation — consider the surrounding context.',
  });
});

// -------------------------------------------------------------
// Voiceflow Integration Configuration
// -------------------------------------------------------------
const rawVfId =
  process.env.VITE_VOICEFLOW_PROJECT_ID ||
  process.env.VOICEFLOW_PROJECT_ID ||
  '6aaad9b395e56fd0a4b0d51e';
const matchVf = rawVfId.match(/[a-f0-9]{24}/i);
const VOICEFLOW_PROJECT_ID = matchVf ? matchVf[0] : '6aaad9b395e56fd0a4b0d51e';
const rawVersionId = process.env.VITE_VOICEFLOW_VERSION_ID || process.env.VOICEFLOW_VERSION_ID;
const VOICEFLOW_VERSION_ID =
  rawVersionId && rawVersionId !== VOICEFLOW_PROJECT_ID && !rawVersionId.includes('creator')
    ? rawVersionId
    : 'production';
const VOICEFLOW_RUNTIME_URL = 'https://general-runtime.voiceflow.com';

// -------------------------------------------------------------
// POST /api/chat/init
// Initialize Voiceflow session greeting
// -------------------------------------------------------------
app.post('/api/chat/init', async (req: Request, res: Response) => {
  const session = (req.body?.sessionId as string) || `vf-user-${Date.now()}`;

  if (VOICEFLOW_PROJECT_ID) {
    try {
      const vfUrl = `${VOICEFLOW_RUNTIME_URL}/public/${VOICEFLOW_PROJECT_ID}/state/user/${encodeURIComponent(session)}/interact`;
      const vfRes = await fetch(vfUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'versionID': VOICEFLOW_VERSION_ID,
        },
        body: JSON.stringify({
          action: {
            type: 'launch',
          },
        }),
      });

      if (vfRes.ok) {
        const vfData = await vfRes.json();
        if (Array.isArray(vfData.trace)) {
          const messages: string[] = [];
          for (const t of vfData.trace) {
            if ((t.type === 'text' || t.type === 'speak') && t.payload?.message) {
              messages.push(t.payload.message);
            }
          }
          if (messages.length > 0) {
            res.json({
              reply: messages.join('\n\n'),
              source: 'voiceflow',
              sessionId: session,
            });
            return;
          }
        }
      }
    } catch (vfErr) {
      console.warn('Voiceflow init call failed:', vfErr);
    }
  }

  res.json({
    reply: "Hi! How you doing??\n\nWe can chat about gender roles in classroom activities, representation in books and lessons, or ideas for student-led equality projects.",
    source: 'default',
    sessionId: session,
  });
});

// -------------------------------------------------------------
// POST /api/chat
// Conversational EQUORA educational guide (Voiceflow primary, Gemini fallback)
// -------------------------------------------------------------
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, sessionId, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  const session = sessionId || `vf-user-${Date.now()}`;

  // 1. Voiceflow Dialog API (Primary Chatbot)
  if (VOICEFLOW_PROJECT_ID) {
    try {
      const vfUrl = `${VOICEFLOW_RUNTIME_URL}/public/${VOICEFLOW_PROJECT_ID}/state/user/${encodeURIComponent(session)}/interact`;
      const vfRes = await fetch(vfUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'versionID': VOICEFLOW_VERSION_ID,
        },
        body: JSON.stringify({
          action: {
            type: 'text',
            payload: message,
          },
        }),
      });

      if (vfRes.ok) {
        const vfData = await vfRes.json();
        if (Array.isArray(vfData.trace)) {
          const textMessages: string[] = [];
          for (const t of vfData.trace) {
            if ((t.type === 'text' || t.type === 'speak') && t.payload?.message) {
              textMessages.push(t.payload.message);
            }
          }

          if (textMessages.length > 0) {
            res.json({
              reply: textMessages.join('\n\n'),
              source: 'voiceflow',
              sessionId: session,
            });
            return;
          }
        }
      } else {
        const errorText = await vfRes.text();
        console.warn(`Voiceflow returned HTTP ${vfRes.status}:`, errorText);
      }
    } catch (vfErr) {
      console.warn('Voiceflow interact failed, falling back to Gemini:', vfErr);
    }
  }

  const systemInstruction = `You are EQUORA's educational learning guide.
EQUORA is a platform designed for students (middle school, high school, and early college) to understand gender representation, bias, stereotypes, and equality in textbooks, curriculum, and everyday life.

Your tone:
- Supportive, welcoming, and encouraging
- Educational and thoughtful, never preachy, dismissive, or harshly accusatory
- You invite curiosity: ask clarifying questions and encourage students to look at evidence and context
- You provide clear, concrete examples
- You explain that recognizing bias is not about "canceling" books or blaming people, but about cultivating critical awareness, fairness, and broadening opportunities for everyone.
- Format responses cleanly with brief paragraphs and bullet points where helpful.`;

  if (aiClient) {
    try {
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user' && item.text) {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'equora' && item.text) {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'I am here to help you explore gender representation in your learning materials. What would you like to examine together?';
      res.json({ reply });
      return;
    } catch (err) {
      console.warn('Gemini chat failed, fallback response used:', err);
    }
  }

  // Fallback high-quality curated responses
  const lowerMsg = message.toLowerCase();
  let reply = 'That is a great question to explore. Gender bias in education occurs when learning materials, language, or examples subtly reinforce fixed ideas about what girls, boys, or non-binary people can or should do. When we notice these patterns, we can ask questions like: "Would this example still work if the gender were switched?" or "Are all people shown with equal agency?"';

  if (lowerMsg.includes('explain gender bias') || lowerMsg.includes('what is gender bias') || lowerMsg.includes('simply')) {
    reply = `**Gender bias** happens when people, materials, or rules treat someone differently or make assumptions about them simply based on their gender.

In school textbooks, it often shows up quietly:
• **In visibility:** Are women and men featured in equal numbers in history and science chapters?
• **In occupations:** Are doctors, leaders, and inventors almost always illustrated as male, while nurses and assistants are depicted as female?
• **In adjectives:** Are boys described as "bold and analytical" while girls are described as "gentle and emotional"?

Recognizing this isn't about being angry—it's about learning to see who is included and making sure everyone feels capable of pursuing any dream.`;
  } else if (lowerMsg.includes('stereotype') || lowerMsg.includes('is this example a stereotype')) {
    reply = `A **stereotype** is an oversimplified, generalized belief about an entire group of people that ignores individual talents and choices.

To test if something is a stereotype, ask yourself three questions:
1. **The Flip Test:** If you switched the genders in the scenario, would it feel surprising or unusual to people? If yes, a stereotype is likely at play.
2. **The Universality Check:** Does the text imply that *all* boys or *all* girls naturally behave this way?
3. **The Opportunity Check:** Does the situation limit someone's freedom or potential based on gender expectations?

If you have a specific sentence or picture from your homework or textbook, paste it here and we can examine it together!`;
  } else if (lowerMsg.includes('representation matter') || lowerMsg.includes('why does representation')) {
    reply = `**Representation matters** because people cannot easily aspire to what they cannot see.

1. **The "Mirror and Window" Principle:** Textbooks should act as *mirrors* (where students see themselves reflected as leaders, thinkers, and creators) and *windows* (where they learn about and respect lives different from their own).
2. **Confidence in STEM & Arts:** When young women see female mathematicians and engineers in curriculum examples, their self-efficacy in STEM increases significantly. Likewise, when boys see male figures celebrated in caregiving, teaching, and arts, it expands healthy emotional and career avenues.
3. **Accuracy:** Real history and science involve people of all genders. Leaving them out actually teaches incomplete facts!`;
  } else if (lowerMsg.includes('notice unfair treatment') || lowerMsg.includes('what should i do') || lowerMsg.includes('respond')) {
    reply = `Noticing unfair treatment or bias is the first big step! Here are constructive, respectful ways to address it:

• **Ask curious questions:** Instead of accusing, ask: *"I noticed that all the scientists in this chapter are men—did women contribute to this discovery as well?"* This invites learning without hostility.
• **Propose inclusive alternatives:** In group projects or class discussions, suggest sharing responsibilities equally: *"Why don't we rotate who takes notes and who presents the final pitch?"*
• **Find trusted allies:** Talk to a supportive teacher, school counselor, or club advisor who values equity.
• **Remember your boundaries:** You never have to tolerate harassment or exclusion. You have the right to an educational environment where your dignity is respected.`;
  }

  res.json({ reply });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`EQUORA server listening on http://${HOST}:${PORT}`);
  });
}

startServer();
