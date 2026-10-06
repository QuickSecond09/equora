import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { UserProfileDrawer } from './components/UserProfileDrawer';
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { ChatPage } from './pages/ChatPage';
import { LearnPage } from './pages/LearnPage';
import { WorldPage } from './pages/WorldPage';
import { NewsPage } from './pages/NewsPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  // Sync with browser hash if present (e.g. #scan, #world)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (['home', 'scan', 'chat', 'learn', 'world', 'news', 'about'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E293B] relative selection:bg-[#FFD8CC]/60 selection:text-[#0D192E]">
        {/* Sticky Glassmorphic Navigation */}
        <Navbar currentPage={currentPage} onNavigate={navigateTo} />

        {/* Main Content Area */}
        <main className="flex-1">
          {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
          {currentPage === 'scan' && <ScanPage />}
          {currentPage === 'chat' && <ChatPage />}
          {currentPage === 'learn' && <LearnPage />}
          {currentPage === 'world' && <WorldPage />}
          {currentPage === 'news' && <NewsPage />}
          {currentPage === 'about' && <AboutPage />}
        </main>

        {/* Platform Editorial Footer */}
        <Footer onNavigate={navigateTo} />

        {/* Glassmorphic Global Modals */}
        <AuthModal />
        <UserProfileDrawer />
      </div>
    </AuthProvider>
  );
}

