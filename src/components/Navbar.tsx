import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Menu,
  X,
  ScanLine,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, openAuthModal, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
  };

  // Safe display values
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

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

        {/* Zone 2: Navigation Links */}
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

        {/* Zone 3: Primary Actions + Theme Toggle + Authentication */}
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

          {/* Authentication Button: Sign In (Signed Out) vs Account Dropdown (Signed In) */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl backdrop-blur-md bg-white/80 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all text-xs text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                    {initial}
                  </div>
                )}
                <span className="hidden lg:inline font-medium max-w-[100px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Account Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 backdrop-blur-2xl bg-white/95 dark:bg-[#0B1324]/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-fade-in ring-1 ring-black/5 dark:ring-white/10">
                  <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800/80 px-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Authenticated</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email || 'Google Account'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0D192E] dark:hover:text-white rounded-xl backdrop-blur-md bg-white/70 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all cursor-pointer focus:outline-none"
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
              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{displayName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                      {user.email || 'Google Account'}
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" title="Active session" />
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full py-1.5 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
