export type PageId = 'home' | 'scan' | 'chat' | 'learn' | 'world' | 'news' | 'about';

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

