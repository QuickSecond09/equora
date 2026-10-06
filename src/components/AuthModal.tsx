import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Sparkles,
  GraduationCap,
  School,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    signup,
    demoLogin,
    oauthLogin,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'educator'>('student');
  const [schoolOrOrg, setSchoolOrOrg] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 10');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMicrosoftOption, setShowMicrosoftOption] = useState(false);

  // Sync with prop
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) setErrorMsg(res.error || 'Failed to sign in.');
      } else {
        const res = await signup({
          name,
          email,
          password,
          role,
          schoolOrOrg,
          gradeLevel: role === 'student' ? gradeLevel : 'Faculty',
        });
        if (!res.success) setErrorMsg(res.error || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoRole: 'student' | 'educator') => {
    setLoading(true);
    try {
      await demoLogin(demoRole);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = async (provider: 'google' | 'microsoft') => {
    setLoading(true);
    try {
      await oauthLogin(provider);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Darkened blurred backdrop with glass depth */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#0D192E]/45 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Glassmorphic Modal Shell matching EQUORA editorial palette */}
      <div className="relative w-full max-w-md rounded-3xl backdrop-blur-2xl bg-[#FAF7F2]/85 border border-white/70 shadow-[0_25px_60px_-15px_rgba(13,25,46,0.22)] p-6 sm:p-8 overflow-hidden z-10 animate-slide-up max-h-[92vh] overflow-y-auto ring-1 ring-peach-300/30">
        {/* Warm ambient glowing orbs behind frosted surface */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FFD8CC]/55 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button with subtle glass highlight */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-slate-900 backdrop-blur-md bg-white/40 hover:bg-white/80 border border-white/60 shadow-2xs transition-all z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1.5 mb-6 relative z-10">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#0D192E]">
            EQUORA
          </span>
          <p className="text-xs text-slate-600">
            {mode === 'login'
              ? 'Sign in to access your saved textbook scans and curriculum logs.'
              : 'Join the student & educator network exploring representation.'}
          </p>
        </div>

        {/* Social / SSO Auth Options */}
        <div className="space-y-2 mb-5 relative z-10">
          {/* Google Sign In (Glassmorphic Button) */}
          <button
            type="button"
            onClick={() => handleOAuthClick('google')}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-slate-800 backdrop-blur-md bg-white/70 hover:bg-white/95 border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Microsoft Education Account Option */}
          {showMicrosoftOption ? (
            <button
              type="button"
              onClick={() => handleOAuthClick('microsoft')}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-slate-800 backdrop-blur-md bg-white/70 hover:bg-white/95 border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all flex items-center justify-center gap-3 animate-fade-in"
            >
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                <div className="bg-[#F25022] rounded-[1px]" />
                <div className="bg-[#7FBA00] rounded-[1px]" />
                <div className="bg-[#00A4EF] rounded-[1px]" />
                <div className="bg-[#FFB900] rounded-[1px]" />
              </div>
              <span>Continue with Microsoft School Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowMicrosoftOption(true)}
              className="w-full py-1 text-[11px] text-slate-500 hover:text-slate-800 font-medium transition-colors flex items-center justify-center gap-1"
            >
              <span>Use Microsoft School Account</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Hairline Divider */}
        <div className="relative mb-5 flex items-center justify-center text-xs text-slate-400 z-10">
          <div className="border-t border-slate-200/70 w-full" />
          <span className="bg-transparent px-2.5 font-medium whitespace-nowrap text-[11px] text-slate-500">
            or continue with email
          </span>
          <div className="border-t border-slate-200/70 w-full" />
        </div>

        {/* Segmented Mode Switcher (Glass Tabs) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-white/35 backdrop-blur-md border border-white/60 rounded-2xl mb-5 relative z-10">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-1.5 text-xs font-semibold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-[#0D192E] shadow-2xs'
                : 'text-slate-600 hover:text-[#0D192E]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`py-1.5 text-xs font-semibold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#0D192E] shadow-2xs'
                : 'text-slate-600 hover:text-[#0D192E]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50/80 backdrop-blur-sm border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form Fields with Frosted Glass Aesthetics */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Full Name</label>
                <div className="flex items-center gap-2 bg-white/55 backdrop-blur-md border border-slate-200/70 rounded-xl px-3 py-2 text-xs focus-within:bg-white/90 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Role Selector: Student vs Educator */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">I am joining as:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'student'
                        ? 'bg-white text-[#0D192E] border-[#2563EB] shadow-2xs ring-1 ring-[#2563EB]/20'
                        : 'bg-white/40 text-slate-600 border-white/60 hover:bg-white/80'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('educator')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'educator'
                        ? 'bg-white text-[#0D192E] border-[#2563EB] shadow-2xs ring-1 ring-[#2563EB]/20'
                        : 'bg-white/40 text-slate-600 border-white/60 hover:bg-white/80'
                    }`}
                  >
                    <School className="w-3.5 h-3.5 text-[#F97059]" />
                    <span>Educator</span>
                  </button>
                </div>
              </div>

              {/* School / Grade Level */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700">
                    {role === 'student' ? 'Grade / Year' : 'Department'}
                  </label>
                  <input
                    type="text"
                    placeholder={role === 'student' ? 'e.g. Grade 10' : 'Social Studies'}
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full bg-white/55 backdrop-blur-md border border-slate-200/70 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white/90 focus:border-[#2563EB] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700">School / Org</label>
                  <input
                    type="text"
                    placeholder="e.g. Riverdale High"
                    value={schoolOrOrg}
                    onChange={(e) => setSchoolOrOrg(e.target.value)}
                    className="w-full bg-white/55 backdrop-blur-md border border-slate-200/70 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white/90 focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">Email Address</label>
            <div className="flex items-center gap-2 bg-white/55 backdrop-blur-md border border-slate-200/70 rounded-xl px-3 py-2 text-xs focus-within:bg-white/90 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-700">Password</label>
              {mode === 'login' && (
                <span className="text-[10px] text-slate-400">Demo pwd: password123</span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-white/55 backdrop-blur-md border border-slate-200/70 rounded-xl px-3 py-2 text-xs focus-within:bg-white/90 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Sign In to EQUORA' : 'Create Student Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Demo Profiles (Frosted Glass Container) */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#F97059]" /> Quick Demo Access:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              disabled={loading}
              className="p-2 rounded-xl backdrop-blur-md bg-white/50 hover:bg-white/90 border border-white/75 text-slate-800 font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Demo Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('educator')}
              disabled={loading}
              className="p-2 rounded-xl backdrop-blur-md bg-white/50 hover:bg-white/90 border border-white/75 text-slate-800 font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Demo Educator</span>
            </button>
          </div>
        </div>

        {/* Trust marker */}
        <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-slate-400 relative z-10">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Student privacy protected · Educational research use only</span>
        </div>
      </div>
    </div>
  );
};
