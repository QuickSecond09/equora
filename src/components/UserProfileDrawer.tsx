import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NEWS_ARTICLES } from '../data/newsData';
import {
  X,
  User,
  GraduationCap,
  School,
  Bookmark,
  FileText,
  Trash2,
  LogOut,
  ExternalLink,
  Award,
  Sparkles,
  Calendar
} from 'lucide-react';

export const UserProfileDrawer: React.FC = () => {
  const { user, isProfileDrawerOpen, closeProfileDrawer, logout, removeScan } = useAuth();
  const [activeTab, setActiveTab] = useState<'scans' | 'bookmarks'>('scans');

  if (!isProfileDrawerOpen || !user) return null;

  const bookmarkedArticles = NEWS_ARTICLES.filter((a) =>
    user.bookmarkedArticleIds.includes(a.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Blurred darkened backdrop */}
      <div
        onClick={closeProfileDrawer}
        className="fixed inset-0 bg-[#0D192E]/40 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Glassmorphic Slide-Out Drawer matching EQUORA Editorial Palette */}
      <div className="relative w-full sm:w-[420px] h-full backdrop-blur-3xl bg-[#FAF7F2]/85 border-l border-white/80 shadow-[-20px_0_50px_-15px_rgba(13,25,46,0.18)] p-6 flex flex-col justify-between z-10 overflow-y-auto animate-slide-left ring-1 ring-peach-300/30">
        {/* Soft glowing ambient spots */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#FFD8CC]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -left-20 w-60 h-60 bg-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-medium">
              Account Profile
            </span>
            <button
              onClick={closeProfileDrawer}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 backdrop-blur-md bg-white/40 hover:bg-white/80 border border-white/60 shadow-2xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Card with Glassmorphic Gradient */}
          <div className="mt-5 p-4 rounded-2xl backdrop-blur-xl bg-white/55 border border-white/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${user.avatarColor} text-[#0D192E] font-bold text-lg flex items-center justify-center shadow-xs border border-white/80`}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#0D192E]">{user.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-semibold text-[#2563EB] bg-sky-50/80 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-sky-200/80">
                    {user.role === 'student' ? 'Student' : 'Educator'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {user.gradeLevel || 'Secondary'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/50 text-xs text-slate-600 flex justify-between">
              <span>{user.schoolOrOrg || 'EQUORA Community'}</span>
              <span className="text-slate-400 font-mono text-[11px]">{user.email}</span>
            </div>
          </div>

          {/* Glass Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-white/35 backdrop-blur-md border border-white/60 rounded-2xl mt-6">
            <button
              onClick={() => setActiveTab('scans')}
              className={`py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'scans'
                  ? 'bg-white text-[#0D192E] shadow-2xs'
                  : 'text-slate-600 hover:text-[#0D192E]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Saved Scans ({user.savedScans.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'bookmarks'
                  ? 'bg-white text-[#0D192E] shadow-2xs'
                  : 'text-slate-600 hover:text-[#0D192E]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarks ({user.bookmarkedArticleIds.length})</span>
            </button>
          </div>

          {/* Tab Content: Saved Scans */}
          {activeTab === 'scans' && (
            <div className="mt-4 space-y-3">
              {user.savedScans.length > 0 ? (
                user.savedScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-3.5 rounded-2xl backdrop-blur-md bg-white/60 hover:bg-white/90 border border-white/80 shadow-2xs space-y-2 hover:border-[#2563EB]/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-[#0D192E]">{scan.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {scan.date} · {scan.category}
                        </div>
                      </div>
                      <button
                        onClick={() => removeScan(scan.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50/80 transition-colors"
                        title="Remove scan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 italic bg-[#FAF7F2]/80 backdrop-blur-xs p-2 rounded-xl border border-slate-200/50 line-clamp-2">
                      "{scan.textSnippet}"
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 font-medium">{scan.status}</span>
                      <span className="text-slate-400 font-mono">Conf: {scan.confidence}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No saved textbook scans yet. Click "Save to Account" on any analyzed page to archive it here!
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div className="mt-4 space-y-3">
              {bookmarkedArticles.length > 0 ? (
                bookmarkedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-3.5 rounded-2xl backdrop-blur-md bg-white/60 hover:bg-white/90 border border-white/80 shadow-2xs space-y-1.5 transition-all"
                  >
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{article.source}</span>
                      <span>{article.category}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#0D192E] line-clamp-2">
                      {article.headline}
                    </div>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{article.countryOrRegion}</span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563EB] hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        <span>Read</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No bookmarked articles yet. Click the bookmark icon on any news story to save it.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Log Out */}
        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
          <span className="text-[10px] text-slate-400">EQUORA Educational Session</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 backdrop-blur-xs rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
