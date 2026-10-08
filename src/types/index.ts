export type PageId = 'home' | 'scan' | 'chat' | 'learn' | 'world' | 'news' | 'report' | 'about';

export type ReportCategory =
  | 'Classroom & Textbooks'
  | 'School Athletics & Sports'
  | 'Workplace & Wage Parity'
  | 'Leadership & Civic Spaces'
  | 'Online Harassment & Digital Spaces'
  | 'Media & Cultural Representation'
  | 'Public Facilities & Transit'
  | 'Other';

export interface InequalityReport {
  id: string;
  trackingCode: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterRole?: 'Student' | 'Educator' | 'Parent' | 'Employee' | 'Researcher' | 'Community Advocate' | 'Other';
  title: string;
  category: ReportCategory;
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

export interface AnalysisResult {
  detected: boolean;
  status: string;
  category: string;
  evidence: string;
  whyItMatters: string;
  context: string;
  confidence: 'Low' | 'Medium' | 'High';
  alternativeFraming?: string;
  classroomDiscussionPrompt?: string;
  surroundingNote?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'equora';
  text: string;
  timestamp: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: 'Careers' | 'Sports' | 'Household responsibilities' | 'Leadership' | 'Science & technology' | 'Arts' | 'School activities' | 'Language & descriptions';
  curriculumContext: string;
  excerpt: string;
  question: string;
  correctAnswer: 'Yes' | 'No' | 'It depends on context';
  explanation: string;
  keyTakeaway: string;
  criticalQuestion: string;
}

export interface CountryGII {
  id: string;
  name: string;
  iso: string;
  lat: number;
  lng: number;
  gii: number; // 0 (best) to 1 (worst)
  rank: number;
  maternalMortalityRatio: number; // per 100k
  adolescentBirthRate: number; // per 1000
  femaleParliamentShare: number; // percentage
  femaleSecondaryEdu: number; // percentage
  laborForceRatio: number; // female to male ratio %
  explanation: string;
  region: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  publicationDate: string;
  countryOrRegion: string;
  category: 'Education' | 'Workplace' | 'Sports' | 'Representation' | 'Law & Rights' | 'Society';
  summary: string;
  readTime: string;
  url: string;
  directArticleUrl?: string;
  keyFindings?: string[];
  policyTakeaway?: string;
  featured?: boolean;
}

export interface SampleTextbook {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  scannedText: string;
  previewUrl?: string;
  description: string;
}

export interface SavedScan {
  id: string;
  date: string;
  title: string;
  textSnippet: string;
  category: string;
  status: string;
  confidence: 'Low' | 'Medium' | 'High';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'educator';
  gradeLevel?: string;
  schoolOrOrg?: string;
  avatarColor: string;
  createdAt: string;
  savedScans: SavedScan[];
  bookmarkedArticleIds: string[];
}

export interface BrainTeaserPuzzle {
  id: string;
  title: string;
  difficulty: 'Quick Spark' | 'Moderate Riddle' | 'Deep Mind Bender';
  category: string;
  riddle: string;
  hint: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  revealExplanation: string;
  psychologicalInsight: string;
  historicalOrSocialFact: string;
}

export interface WordScramblePuzzle {
  id: string;
  concept: string; // The correct term e.g. "MATILDA EFFECT"
  scrambled: string;
  category: string;
  clue: string;
  definition: string;
  exampleContext: string;
}

export interface SpotTheBiasPuzzle {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  rawExcerpt: string;
  targetPhrase: string; // the phrase that embodies the bias
  options: string[]; // 4 phrases in the excerpt
  repairedExcerpt: string;
  explanation: string;
}

