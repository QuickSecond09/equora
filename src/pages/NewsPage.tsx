import React, { useState, useEffect } from 'react';
import { NEWS_ARTICLES } from '../data/newsData';
import { NewsArticle } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  ArrowUpRight,
  Calendar,
  Globe,
  Bookmark,
  Filter,
  Newspaper,
  RefreshCw,
  Sparkles,
  BookOpen,
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  Share2
} from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { user, isBookmarked, toggleBookmark, openAuthModal } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Live (2024-2026 Archive)');
  const [selectedReaderArticle, setSelectedReaderArticle] = useState<NewsArticle | null>(null);

  const categories = [
    'All',
    'Education',
    'Workplace',
    'Sports',
    'Representation',
    'Law & Rights',
    'Society',
  ];

  // Load from /api/news if available
  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          setLastUpdatedTime('Synced just now');
        }
      })
      .catch((_err) => {
        // Uses fallback NEWS_ARTICLES
      });
  }, []);

  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/news/refresh', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          setLastUpdatedTime('Updated just now');
        }
      }
    } catch (_err) {
      setLastUpdatedTime('Synced (offline cache)');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.countryOrRegion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);

  const handleBookmarkClick = (e: React.MouseEvent, articleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal('login');
    } else {
      toggleBookmark(articleId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* 1. Header with Live Status & Refresh Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2563EB] mb-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>International Journalism Wire · Direct Report Links</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] tracking-tight">
            Fresh News & Reporting
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Curated coverage from verified international outlets on policy reforms, curriculum
            audits, pay equity legislation, and sports representation. Every story links directly to the full investigative publication.
          </p>
        </div>

        {/* Controls: Search + Refresh Feed button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleRefreshFeed}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all whitespace-nowrap"
            title="Fetch latest updates from verified news feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Checking Updates...' : 'Check for Latest Reports'}</span>
          </button>

          {/* Search input with Glassmorphism */}
          <div className="w-full sm:w-64">
            <div className="flex items-center gap-2 backdrop-blur-xl bg-white/80 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 shadow-2xs focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search reports, outlets, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Category Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0D192E] text-white shadow-2xs'
                  : 'backdrop-blur-md bg-white/70 text-slate-600 hover:bg-white border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 shrink-0">
          <Clock className="w-3 h-3" />
          <span>Status: {lastUpdatedTime}</span>
        </div>
      </div>

      {/* 3. Featured Story Card with Glassmorphic Gradient */}
      {featuredArticle && (
        <section className="backdrop-blur-xl bg-gradient-to-br from-[#FFF5F0]/85 via-white/90 to-[#E0F2FE]/50 rounded-3xl p-6 sm:p-10 border border-white/80 shadow-md relative overflow-hidden group">
          <div className="max-w-4xl space-y-4 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0D192E]">{featuredArticle.source}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredArticle.publicationDate}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#2563EB] font-medium">{featuredArticle.countryOrRegion}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredArticle.readTime}</span>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={(e) => handleBookmarkClick(e, featuredArticle.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#2563EB] hover:bg-white/80 transition-colors"
                title={isBookmarked(featuredArticle.id) ? 'Remove Bookmark' : 'Save to Bookmarks'}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarked(featuredArticle.id)
                      ? 'fill-[#2563EB] text-[#2563EB]'
                      : 'text-slate-400'
                  }`}
                />
              </button>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D192E] leading-tight">
              {featuredArticle.headline}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {featuredArticle.summary}
            </p>

            {/* Direct action links */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* Direct External Link to Actual Article */}
              <a
                href={featuredArticle.directArticleUrl || featuredArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D192E] text-white hover:bg-[#1E293B] text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Read Full Coverage at {featuredArticle.source}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* In-App Reader Modal Trigger */}
              <button
                onClick={() => setSelectedReaderArticle(featuredArticle)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>View Digest & Key Findings</span>
              </button>

              <span className="text-xs text-slate-400 pl-1">
                Verified direct link · Opens original publication
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 4. Editorial Multi-Card Grid with Glass Highlights */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-[#0D192E]">
            Recent Documented Developments ({regularArticles.length})
          </h3>
          <span className="text-xs text-slate-400">All links open verified article pages</span>
        </div>

        {regularArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => {
              const bookmarked = isBookmarked(article.id);
              const articleDirectLink = article.directArticleUrl || article.url;

              return (
                <article
                  key={article.id}
                  className="backdrop-blur-md bg-white/80 rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:bg-white transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{article.source}</span>
                      <div className="flex items-center gap-2">
                        <span>{article.category}</span>
                        <button
                          onClick={(e) => handleBookmarkClick(e, article.id)}
                          className="text-slate-400 hover:text-[#2563EB] transition-colors p-0.5"
                          title={bookmarked ? 'Bookmarked' : 'Save bookmark'}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              bookmarked ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-400'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-serif font-bold text-[#0D192E] leading-snug group-hover:text-[#2563EB] transition-colors">
                      {article.headline}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate pr-2">
                      <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{article.countryOrRegion}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedReaderArticle(article)}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        Digest
                      </button>

                      {/* DIRECT LINK TO ARTICLE */}
                      <a
                        href={articleDirectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
                        title={`Open article at ${article.source}`}
                      >
                        <span>Read article</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
            No articles match your active filter or search query.
          </div>
        )}
      </section>

      {/* 5. In-App Article Reader Modal */}
      {selectedReaderArticle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-900">{selectedReaderArticle.source}</span>
                <span>·</span>
                <span>{selectedReaderArticle.publicationDate}</span>
                <span>·</span>
                <span className="text-[#2563EB] font-medium">{selectedReaderArticle.category}</span>
              </div>
              <button
                onClick={() => setSelectedReaderArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Summary */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D192E] leading-snug">
                {selectedReaderArticle.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedReaderArticle.summary}
              </p>
            </div>

            {/* Key Findings */}
            {selectedReaderArticle.keyFindings && selectedReaderArticle.keyFindings.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-[#0D192E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Investigative Findings</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 pl-1">
                  {selectedReaderArticle.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Policy Takeaway */}
            {selectedReaderArticle.policyTakeaway && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1 text-xs">
                <div className="font-bold text-[#0D192E] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Curriculum & Policy Takeaway</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{selectedReaderArticle.policyTakeaway}</p>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Direct external source: {selectedReaderArticle.source}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedReaderArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <a
                  href={selectedReaderArticle.directArticleUrl || selectedReaderArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] rounded-xl shadow-xs"
                >
                  <span>Open Full Article</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
