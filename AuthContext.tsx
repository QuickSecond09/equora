import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SavedScan } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (formData: {
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'educator';
    schoolOrOrg?: string;
    gradeLevel?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (role: 'student' | 'educator') => Promise<void>;
  oauthLogin: () => Promise<void>;
  oauthError: string | null;
  logout: () => void;
  saveScan: (scan: Omit<SavedScan, 'id' | 'date'>) => void;
  removeScan: (id: string) => void;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;

  // Modal & Drawer State
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  isProfileDrawerOpen: boolean;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'equora_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Restore the local session or finish the server-verified Google OAuth handoff.
  useEffect(() => {
    const restoreSession = async () => {
      const query = new URLSearchParams(window.location.search);
      const oauthStatus = query.get('oauth');
      const callbackError = query.get('oauth_error');

      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Failed to load user session:', error);
      }

      try {
        if (oauthStatus === 'success') {
          const response = await fetch('/api/auth/oauth?session=1');
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Google sign-in could not be completed.');
          }

          const fullUser: User = {
            ...data.user,
            savedScans: [],
            bookmarkedArticleIds: [],
          };
          saveUserSession(fullUser);
        } else if (callbackError) {
          const messages: Record<string, string> = {
            access_denied: 'Google sign-in was cancelled.',
            invalid_state: 'Google sign-in could not be verified. Please try again.',
            exchange_failed: 'Google sign-in could not be completed. Please try again.',
            profile_failed: 'Google did not return your profile. Please try again.',
            unverified_email: 'Google sign-in requires a verified email address.',
          };
          setOauthError(messages[callbackError] || 'Google sign-in failed. Please try again.');
          setIsAuthModalOpen(true);
        }
      } catch (error) {
        console.error('Failed to restore Google sign-in session:', error);
        setOauthError(error instanceof Error ? error.message : 'Google sign-in could not be completed.');
        setIsAuthModalOpen(true);
      } finally {
        if (oauthStatus || callbackError) {
          query.delete('oauth');
          query.delete('oauth_error');
          const search = query.toString();
          window.history.replaceState(
            {},
            document.title,
            `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`,
          );
        }
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const saveUserSession = (userData: User) => {
    setUser(userData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, error: data.error || 'Login failed.' };
      }

      const data = await res.json();
      const fullUser: User = {
        ...data.user,
        savedScans: data.user.savedScans || [],
        bookmarkedArticleIds: data.user.bookmarkedArticleIds || [],
      };

      saveUserSession(fullUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (_err: any) {
      // Offline / fallback session if network request fails
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'EQUORA Scholar',
        email,
        role: 'student',
        schoolOrOrg: 'Riverdale High School',
        gradeLevel: 'Grade 10',
        avatarColor: 'from-amber-400 to-rose-400',
        createdAt: new Date().toISOString().split('T')[0],
        savedScans: [],
        bookmarkedArticleIds: ['news-unesco-textbooks'],
      };
      saveUserSession(fallbackUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const signup = async (formData: {
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'educator';
    schoolOrOrg?: string;
    gradeLevel?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, error: data.error || 'Sign up failed.' };
      }

      const data = await res.json();
      const fullUser: User = {
        ...data.user,
        savedScans: [],
        bookmarkedArticleIds: [],
      };

      saveUserSession(fullUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (_err: any) {
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name: formData.name || 'EQUORA Scholar',
        email: formData.email,
        role: formData.role,
        schoolOrOrg: formData.schoolOrOrg || 'Riverdale High School',
        gradeLevel: formData.gradeLevel || (formData.role === 'student' ? 'Grade 10' : 'Faculty'),
        avatarColor: formData.role === 'student' ? 'from-amber-400 to-rose-400' : 'from-indigo-500 to-sky-400',
        createdAt: new Date().toISOString().split('T')[0],
        savedScans: [],
        bookmarkedArticleIds: [],
      };
      saveUserSession(fallbackUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const demoLogin = async (role: 'student' | 'educator') => {
    let demoUser: User;
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      demoUser = {
        ...data.user,
        savedScans: [
          {
            id: 'scan-demo-1',
            date: 'Yesterday, 3:15 PM',
            title: 'High School Business Math Problem 14.2',
            textSnippet: 'A corporate CEO manages an enterprise... his executive assistant Sarah...',
            category: 'Occupational stereotypes',
            status: 'Possible gender bias detected',
            confidence: 'High',
          },
        ],
        bookmarkedArticleIds: ['news-unesco-textbooks', 'news-ap-parliament-parity'],
      };
    } catch (_err) {
      demoUser = {
        id: `usr-demo-${Date.now()}`,
        name: role === 'student' ? 'Maya Lin' : 'Dr. Elena Rostova',
        email: role === 'student' ? 'student@equora.edu' : 'elena.rostova@school.edu',
        role,
        schoolOrOrg: role === 'student' ? 'Riverdale High School' : 'Department of Social Studies',
        gradeLevel: role === 'student' ? 'Grade 10' : 'Faculty',
        avatarColor: role === 'student' ? 'from-amber-400 to-rose-400' : 'from-indigo-500 to-sky-400',
        createdAt: new Date().toISOString().split('T')[0],
        savedScans: [
          {
            id: 'scan-demo-1',
            date: 'Yesterday, 3:15 PM',
            title: 'High School Business Math Problem 14.2',
            textSnippet: 'A corporate CEO manages an enterprise... his executive assistant Sarah...',
            category: 'Occupational stereotypes',
            status: 'Possible gender bias detected',
            confidence: 'High',
          },
        ],
        bookmarkedArticleIds: ['news-unesco-textbooks', 'news-ap-parliament-parity'],
      };
    }

    saveUserSession(demoUser);
    setIsAuthModalOpen(false);
  };

  const oauthLogin = async () => {
    setOauthError(null);
    const response = await fetch('/api/auth/oauth');
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Google sign-in could not be started.');
    }

    if (!data.authorizationUrl) {
      throw new Error('Google sign-in could not be started.');
    }
    window.location.assign(data.authorizationUrl);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setIsProfileDrawerOpen(false);
  };

  const saveScan = (scan: Omit<SavedScan, 'id' | 'date'>) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const newScan: SavedScan = {
      ...scan,
      id: `scan-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedUser: User = {
      ...user,
      savedScans: [newScan, ...user.savedScans],
    };

    saveUserSession(updatedUser);
  };

  const removeScan = (id: string) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      savedScans: user.savedScans.filter((s) => s.id !== id),
    };
    saveUserSession(updatedUser);
  };

  const toggleBookmark = (articleId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const exists = user.bookmarkedArticleIds.includes(articleId);
    const updatedUser: User = {
      ...user,
      bookmarkedArticleIds: exists
        ? user.bookmarkedArticleIds.filter((id) => id !== articleId)
        : [...user.bookmarkedArticleIds, articleId],
    };

    saveUserSession(updatedUser);
  };

  const isBookmarked = (articleId: string) => {
    return user ? user.bookmarkedArticleIds.includes(articleId) : false;
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openProfileDrawer = () => {
    setIsProfileDrawerOpen(true);
  };

  const closeProfileDrawer = () => {
    setIsProfileDrawerOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        demoLogin,
        oauthLogin,
        oauthError,
        logout,
        saveScan,
        removeScan,
        toggleBookmark,
        isBookmarked,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isProfileDrawerOpen,
        openProfileDrawer,
        closeProfileDrawer,
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
