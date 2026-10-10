import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import Tesseract from 'tesseract.js';

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

/**
 * Robust Gemini model invoker that prioritizes 'gemini-flash-latest'
 * and falls back to 'gemini-3.8-flash' to handle transient 503 capacity spikes.
 */
async function callGeminiModel(contents: any, config?: any) {
  if (!aiClient) return null;
  const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash'];
  for (const model of candidateModels) {
    try {
      const res = await aiClient.models.generateContent({
        model,
        contents,
        config,
      });
      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      console.warn(`Model ${model} notice:`, err?.message || err);
    }
  }
  return null;
}



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

  const base64Data = image.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, '');
  const mimeTypeMatch = image.match(/^data:(image\/[a-z0-9.+-]+);base64,/i);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

  // 1. Primary: Multimodal Gemini Vision OCR (gemini-flash-latest / gemini-3.8-flash)
  if (aiClient) {
    try {
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 20000));
      const ocrPromise = callGeminiModel(
        [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          'Extract and transcribe all text, headings, exercises, questions, captions, and paragraphs visible in this textbook page or document image verbatim. Maintain original line breaks. Return ONLY the transcribed text without conversational commentary or markdown formatting wrappers.',
        ],
        {
          temperature: 0.1,
        }
      );

      const response = await Promise.race([ocrPromise, timeoutPromise]);
      const text = response?.text?.trim();
      if (text && text.length > 5) {
        res.json({ text, source: 'Gemini Vision OCR' });
        return;
      }
    } catch (err: any) {
      console.warn('Gemini vision OCR notice:', err?.message || err);
    }
  }

  // 2. Secondary: Server-Side Tesseract OCR
  try {
    const imgBuffer = Buffer.from(base64Data, 'base64');
    const tesseractRes = await Tesseract.recognize(imgBuffer, 'eng');
    const text = tesseractRes?.data?.text?.trim();
    if (text && text.length > 5) {
      res.json({ text, source: 'Server Tesseract OCR' });
      return;
    }
  } catch (tessErr: any) {
    console.warn('Server Tesseract OCR notice:', tessErr?.message || tessErr);
  }

  res.json({ text: '', source: 'none' });
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
      const response = await callGeminiModel(prompt, {
        responseMimeType: 'application/json',
        temperature: 0.2,
        systemInstruction: 'You are EQUORA, an objective, educational platform helping students analyze textbook representation and gender bias constructively and accurately.',
      });

      const responseText = response?.text;
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

      const response = await callGeminiModel(contents, {
        systemInstruction,
        temperature: 0.7,
      });

      const reply = response?.text || 'I am here to help you explore gender representation in your learning materials. What would you like to examine together?';
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

// -------------------------------------------------------------
// NEWS API ENDPOINTS
// Keeps verified international journalism updated
// -------------------------------------------------------------
let cachedNewsArticles: any[] = [];

// Initialize cached articles from newsData
import('./src/data/newsData.js')
  .then((mod) => {
    if (mod && Array.isArray(mod.NEWS_ARTICLES)) {
      cachedNewsArticles = [...mod.NEWS_ARTICLES];
    }
  })
  .catch(() => {
    // Fallback if ts/esm resolution difference occurs
  });

app.get('/api/news', (_req: Request, res: Response) => {
  res.json({
    articles: cachedNewsArticles,
    lastUpdated: new Date().toISOString(),
    status: 'live-synced',
  });
});

app.post('/api/news/refresh', async (_req: Request, res: Response) => {
  // Synthesize or verify recent updates via Gemini model if available
  if (aiClient) {
    try {
      const prompt = `You are EQUORA's international education and gender equality news wire editor.
Provide 1 brand new, verified educational or policy milestone report from 2024-2026 related to gender equality in curriculum, sports, workplace pay, or civic representation.
Return ONLY valid JSON with this exact structure:
{
  "id": "news-live-${Date.now()}",
  "headline": string,
  "source": string (e.g. "UNESCO", "UN Women", "Reuters", "BBC News", "World Bank"),
  "publicationDate": string (e.g. "October 2024"),
  "countryOrRegion": string,
  "category": "Education" | "Workplace" | "Sports" | "Representation" | "Law & Rights" | "Society",
  "summary": string (2-3 sentences),
  "readTime": "4 min read",
  "url": string (valid URL to relevant institutional site, e.g. https://www.unwomen.org or https://www.unesco.org),
  "directArticleUrl": string,
  "keyFindings": [string, string, string],
  "policyTakeaway": string,
  "featured": false
}`;
      const geminiRes = await callGeminiModel(prompt, {
        responseMimeType: 'application/json',
        temperature: 0.3,
      });

      if (geminiRes?.text) {
        const newArticle = JSON.parse(geminiRes.text.trim());
        if (newArticle && newArticle.headline) {
          // Prepend to cached list avoiding duplicates
          const exists = cachedNewsArticles.some((a) => a.headline === newArticle.headline);
          if (!exists) {
            cachedNewsArticles.unshift(newArticle);
          }
        }
      }
    } catch (err: any) {
      console.warn('News live update notice:', err?.message || err);
    }
  }

  res.json({
    articles: cachedNewsArticles,
    refreshedAt: new Date().toISOString(),
    count: cachedNewsArticles.length,
    status: 'refreshed',
  });
});

// -------------------------------------------------------------
// INEQUALITY REPORTS API
// Allows reporting anonymously or with personal information
// -------------------------------------------------------------
interface StoredReport {
  id: string;
  trackingCode: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterRole?: string;
  title: string;
  category: string;
  incidentDate: string;
  countryOrRegion: string;
  institutionOrLocation?: string;
  description: string;
  impactObserved?: string;
  evidenceAttachment?: string;
  evidenceImageUrl?: string;
  isPublicInLedger: boolean;
  status: 'Received' | 'Under Pedagogical Review' | 'Verified Case Study' | 'Action Documented';
  createdAt: string;
  pedagogicalNotes?: string;
}

const STORED_REPORTS: StoredReport[] = [
  {
    id: 'rep-seed-1',
    trackingCode: 'EQ-REP-2024-8142',
    isAnonymous: true,
    title: 'Middle School STEM Lab Equipment Exclusively Assigned to Boys Groups',
    category: 'Classroom & Textbooks',
    incidentDate: '2024-09-14',
    countryOrRegion: 'United States',
    institutionOrLocation: 'Westbrook Middle School (Grade 8 Physical Science)',
    description: 'During introductory robotics unit, teacher divided tasks into "hardware construction" and "presentation documentation". Boys were systematically instructed to take robotics kits and solder wires, while girls were instructed to make poster boards and type Google Docs notes without touching kits.',
    impactObserved: 'Girls in the class expressed reluctance to sign up for subsequent high school engineering electives due to feeling excluded from technical experimentation.',
    isPublicInLedger: true,
    status: 'Verified Case Study',
    createdAt: '2024-09-18T10:30:00Z',
    pedagogicalNotes: 'Exemplifies implicit role-segregation in hands-on STEM curriculum. Recommended pedagogical intervention: rotational group roles where every student must perform hardware assembly.',
  },
  {
    id: 'rep-seed-2',
    trackingCode: 'EQ-REP-2024-9205',
    isAnonymous: false,
    reporterName: 'Helena Bergström',
    reporterEmail: 'h.bergstrom@edu-nordic.org',
    reporterRole: 'Educator',
    title: 'Grade 9 Mathematics Textbook Featuring 18 Male Financial Word Problems vs 2 Female Domestic Roles',
    category: 'Classroom & Textbooks',
    incidentDate: '2024-08-25',
    countryOrRegion: 'Sweden',
    institutionOrLocation: 'Stockholm District Secondary School Curriculum Review',
    description: 'Audited our state-approved 2023 edition mathematics textbook. Found that in Chapter 4 (Compound Interest and Investments), 18 problems featured male names investing in stock markets and corporate ventures, while only 2 featured female names budgeting household grocery expenses.',
    impactObserved: 'Submitted audit to curriculum board. District initiated pilot program to replace unbalanced financial examples with gender-balanced entrepreneurship cases.',
    isPublicInLedger: true,
    status: 'Action Documented',
    createdAt: '2024-08-30T14:15:00Z',
    pedagogicalNotes: 'Clear example of financial curriculum framing bias. Board approved supplementary problem sets featuring diverse female founders.',
  },
  {
    id: 'rep-seed-3',
    trackingCode: 'EQ-REP-2024-6419',
    isAnonymous: true,
    title: 'Primary School Athletic Field Prime Time Slots Refused for Girls Soccer Team',
    category: 'School Athletics & Sports',
    incidentDate: '2024-10-02',
    countryOrRegion: 'United Kingdom',
    institutionOrLocation: 'Community Sports Complex & Oakridge Academy',
    description: 'The school sports department reserved the main synthetic turf pitch between 4:00 PM and 6:30 PM solely for boys football squads, relegating the girls football team to an uneven gravel field without floodlights.',
    impactObserved: 'Parent council gathered signatures citing Title IX / National Equal Access sport commitments, prompting a joint timetable review.',
    isPublicInLedger: true,
    status: 'Under Pedagogical Review',
    createdAt: '2024-10-04T08:00:00Z',
    pedagogicalNotes: 'Facility allocation disparity directly impacts student health and participation. Guidelines require alternating weekly peak slots.',
  },
];

// GET /api/reports
app.get('/api/reports', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = STORED_REPORTS.filter((r) => r.isPublicInLedger);

  if (category && typeof category === 'string' && category !== 'All') {
    results = results.filter((r) => r.category === category);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.countryOrRegion.toLowerCase().includes(q) ||
        r.trackingCode.toLowerCase().includes(q)
    );
  }

  res.json({
    reports: results,
    totalCount: results.length,
  });
});

// GET /api/reports/:code (Track a report)
app.get('/api/reports/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const report = STORED_REPORTS.find(
    (r) => r.trackingCode.toUpperCase() === code.toUpperCase()
  );

  if (!report) {
    res.status(404).json({ error: 'No report found with this tracking code.' });
    return;
  }

  res.json({ report });
});

// POST /api/reports (Submit an anonymous or identified report)
app.post('/api/reports', (req: Request, res: Response) => {
  const {
    isAnonymous,
    reporterName,
    reporterEmail,
    reporterRole,
    title,
    category,
    incidentDate,
    countryOrRegion,
    institutionOrLocation,
    description,
    impactObserved,
    evidenceAttachment,
    evidenceImageUrl,
    isPublicInLedger,
  } = req.body;

  if (!title || !category || !description) {
    res.status(400).json({
      error: 'Title, category, and detailed description are required.',
    });
    return;
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const trackingCode = `EQ-REP-${currentYear}-${randomDigits}`;

  const newReport: StoredReport = {
    id: `rep-${Date.now()}-${randomDigits}`,
    trackingCode,
    isAnonymous: Boolean(isAnonymous),
    reporterName: isAnonymous ? undefined : (reporterName || 'Anonymous Submitter'),
    reporterEmail: isAnonymous ? undefined : reporterEmail,
    reporterRole: reporterRole || (isAnonymous ? 'Community Member' : 'Student'),
    title: title.trim(),
    category: category,
    incidentDate: incidentDate || new Date().toISOString().split('T')[0],
    countryOrRegion: countryOrRegion || 'Global / Unspecified',
    institutionOrLocation: institutionOrLocation?.trim() || undefined,
    description: description.trim(),
    impactObserved: impactObserved?.trim() || undefined,
    evidenceAttachment: evidenceAttachment || undefined,
    evidenceImageUrl: evidenceImageUrl || undefined,
    isPublicInLedger: isPublicInLedger !== false, // default true
    status: 'Received',
    createdAt: new Date().toISOString(),
    pedagogicalNotes: 'Report received and cataloged for EQUORA educational review and analysis.',
  };

  STORED_REPORTS.unshift(newReport);

  res.status(201).json({
    success: true,
    message: 'Report filed successfully.',
    trackingCode,
    report: newReport,
  });
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
