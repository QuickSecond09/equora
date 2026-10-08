import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ScanLine, User as UserIcon, LogIn, ChevronDown, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, openAuthModal, openProfileDrawer } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'scan', label: 'Scan' },
    { id: 'chat', label: 'Chat' },
    { id: 'learn', label: 'Learn' },
    { id: 'world', label: 'World' },
    { id: 'news', label: 'News' },
    { id: 'report', label: 'Report' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 backdrop-blur-xl bg-[#FAF7F2]/85 dark:bg-[#070D18]/85 border-b border-peach-200/50 dark:border-slate-800/80 shadow-[0_4px_20px_-2px_rgba(249,112,89,0.08)]'
          : 'py-4 backdrop-blur-md bg-[#FAF7F2]/90 dark:bg-[#070D18]/90 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#0D192E] dark:text-white hover:text-[#2563EB] dark:hover:text-[#38BDF8] transition-colors focus:outline-none"
        >
          EQUORA
        </button>

        {/* Zone 2: 4-7 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-[#0D192E] dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0D192E] dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F97059] rounded-full transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions + Theme Toggle + Glassmorphic Auth Trigger */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl backdrop-blur-md bg-white/70 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs text-slate-700 dark:text-slate-200 transition-all focus:outline-none cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:text-indigo-600 transition-colors" />
            )}
          </button>

          {/* Scan button */}
          <button
            onClick={() => handleNavClick('scan')}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-[#0D192E] bg-gradient-to-r from-[#FFD8CC] to-[#FECDD3] hover:from-[#FDBA74] hover:to-[#FDA4AF] rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap focus:outline-none"
          >
            <ScanLine className="w-3.5 h-3.5 text-[#0D192E]" />
            <span className="hidden sm:inline">Scan a Page</span>
            <span className="sm:hidden">Scan</span>
          </button>

          {/* User Sign In / Profile Button (Glassmorphic) */}
          {user ? (
            <button
              onClick={openProfileDrawer}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl backdrop-blur-md bg-white/70 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all text-xs text-slate-800 dark:text-slate-100"
              title="Open Account & Saved Scans"
            >
              <div
                className={`w-6 h-6 rounded-lg bg-gradient-to-br ${user.avatarColor} text-[#0D192E] font-bold text-[11px] flex items-center justify-center`}
              >
                {user.name.charAt(0)}
              </div>
              <span className="hidden lg:inline font-medium max-w-[90px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0D192E] dark:hover:text-white rounded-xl backdrop-blur-md bg-white/60 hover:bg-white dark:bg-slate-800/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white rounded-lg focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-[#FAF7F2]/95 dark:bg-[#070D18]/95 border-b border-slate-200/80 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fade-in">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-[#FFD8CC]/50 dark:bg-slate-800 text-[#0D192E] dark:text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#F97059]" />}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                Theme: {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className="text-[11px] text-slate-400">Switch to {isDark ? 'Light' : 'Dark'}</span>
            </button>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openProfileDrawer();
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <span>Account: {user.name}</span>
                <span className="text-[11px] text-[#2563EB] dark:text-sky-400">View Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

