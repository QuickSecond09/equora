import React, { useState } from 'react';
import { NEWS_ARTICLES } from '../data/newsData';
import { NewsArticle } from '../types';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowUpRight, Calendar, Globe, Bookmark, Filter, Newspaper } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { user, isBookmarked, toggleBookmark, openAuthModal } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Education',
    'Workplace',
    'Sports',
    'Representation',
    'Law & Rights',
    'Society',
  ];

  const filteredArticles = NEWS_ARTICLES.filter((article) => {
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
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#F97059] mb-1.5">
            Documented Journalism
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] tracking-tight">
            Fresh News & Reporting
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Curated coverage from verified international outlets on policy reforms, curriculum
            audits, pay equity legislation, and sports representation.
          </p>
        </div>

        {/* Search input with Glassmorphism */}
        <div className="w-full md:w-72">
          <div className="flex items-center gap-2 backdrop-blur-xl bg-white/70 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 shadow-2xs focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
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

      {/* 2. Interactive Category Filter Bar */}
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

            <div className="pt-2 flex items-center gap-4">
              <a
                href={featuredArticle.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D192E] text-white hover:bg-[#1E293B] text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Read Full Coverage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-slate-400">Verified reporting · Direct source archive</span>
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
          <span className="text-xs text-slate-400">Showing accredited news items</span>
        </div>

        {regularArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => {
              const bookmarked = isBookmarked(article.id);
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
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{article.countryOrRegion}</span>
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
                    >
                      <span>Read article</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
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
    </div>
  );
};
