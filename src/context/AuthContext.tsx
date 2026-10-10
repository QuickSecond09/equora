import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  isFirebaseConfigured,
  signInWithGoogleFlow,
  signInWithEmailFlow,
  signUpWithEmailFlow,
  sendPasswordResetFlow,
  signOutFlow,
  checkRedirectAuth,
  getFriendlyAuthErrorMessage,
} from '../lib/firebase';
import { SavedScan } from '../types';

export interface AuthContextType {
  // Real Firebase User
  user: FirebaseUser | null;
  isLoading: boolean;
  isFirebaseReady: boolean;

  // Modal State
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;

  // Real Authentication Methods
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // Retain Bookmarking & Saved Scans for Existing Platform Features
  savedScans: SavedScan[];
  saveScan: (scan: Omit<SavedScan, 'id' | 'date'>) => void;
  removeScan: (id: string) => void;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  bookmarkedArticleIds: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOKMARKS_STORAGE_KEY = 'equora_bookmarked_articles';
const SCANS_STORAGE_KEY = 'equora_saved_scans';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Bookmarks and Portfolio persistence (works whether signed in or as guest)
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load bookmarks:', e);
    }
    return ['news-unesco-textbooks'];
  });

  const [savedScans, setSavedScans] = useState<SavedScan[]>(() => {
    try {
      const stored = localStorage.getItem(SCANS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved scans:', e);
    }
    return [];
  });

  // Check for redirect result on app load
  useEffect(() => {
    checkRedirectAuth().catch((err) => console.warn('Redirect auth notice:', err));
  }, []);

  // Listen for real Firebase authentication state changes
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const authenticatedUser = await signInWithGoogleFlow();
      setUser(authenticatedUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      return { success: false, error: msg };
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const authenticatedUser = await signInWithEmailFlow(email, pass);
      setUser(authenticatedUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      return { success: false, error: msg };
    }
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const newUser = await signUpWithEmailFlow(name, email, pass);
      setUser(newUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      return { success: false, error: msg };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetFlow(email);
      return { success: true };
    } catch (error: any) {
      const msg = getFriendlyAuthErrorMessage(error);
      return { success: false, error: msg };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOutFlow();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticleIds((prev) => {
      const exists = prev.includes(articleId);
      const next = exists ? prev.filter((id) => id !== articleId) : [...prev, articleId];
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save bookmark:', e);
      }
      return next;
    });
  };

  const isBookmarked = (articleId: string) => {
    return bookmarkedArticleIds.includes(articleId);
  };

  const saveScan = (scan: Omit<SavedScan, 'id' | 'date'>) => {
    const newScan: SavedScan = {
      ...scan,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString().split('T')[0],
    };

    setSavedScans((prev) => {
      const next = [newScan, ...prev];
      try {
        localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save scan:', e);
      }
      return next;
    });
  };

  const removeScan = (id: string) => {
    setSavedScans((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to remove scan:', e);
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isFirebaseReady: isFirebaseConfigured,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
        savedScans,
        saveScan,
        removeScan,
        toggleBookmark,
        isBookmarked,
        bookmarkedArticleIds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
