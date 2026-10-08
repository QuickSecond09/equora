import React from 'react';
import { PageId } from '../types';
import { HeroVisual } from '../components/HeroVisual';
import {
  ScanLine,
  Brain,
  GraduationCap,
  Globe2,
  Newspaper,
  ArrowRight,
  BookOpen,
  Briefcase,
  Award,
  Home,
  MessageSquare,
  Sparkles,
  Users
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const biasVectors = [
    {
      icon: Users,
      title: 'Who gets represented',
      desc: 'Are women, men, and diverse contributors visible in equal measure across historical movements and modern scientific discoveries?',
      category: 'Representation',
    },
    {
      icon: Briefcase,
      title: 'Which careers are associated with different genders',
      desc: 'Are leadership, engineering, and surgery routinely coded masculine, while caregiving, teaching, and hospitality are coded feminine?',
      category: 'Vocational Stereotypes',
    },
    {
      icon: Award,
      title: 'Who is shown leading',
      desc: 'Who makes the final strategic call in business word problems, student council examples, and government simulations?',
      category: 'Executive Agency',
    },
    {
      icon: Home,
      title: 'Who performs certain responsibilities',
      desc: 'How are household cleaning, food preparation, and childcare distributed in elementary readers and family scenarios?',
      category: 'Domestic Division',
    },
    {
      icon: MessageSquare,
      title: 'How boys and girls are described',
      desc: 'Do descriptive adjectives assign "logic and boldness" to boys and "gentleness and emotional vulnerability" to girls?',
      category: 'Descriptive Framing',
    },
    {
      icon: BookOpen,
      title: 'Which experiences are included or left out',
      desc: 'Whose cultural histories, inventions, and civic milestones are given center stage versus footnote status?',
      category: 'Curriculum Inclusion',
    },
  ];

  const exploreCards: {
    id: PageId;
    badge: string;
    title: string;
    description: string;
    actionText: string;
    colorClass: string;
    accentBg: string;
  }[] = [
    {
      id: 'scan',
      badge: 'SCAN & OCR',
      title: 'Turn textbook pages into readable text.',
      description: 'Upload a photo or drag a textbook page to apply optical enhancement and OCR text extraction.',
      actionText: 'Open Scanner',
      colorClass: 'from-[#FFD8CC]/40 via-white to-white border-peach-200/60',
      accentBg: 'bg-[#FFD8CC] text-[#0D192E]',
    },
    {
      id: 'scan',
      badge: 'UNDERSTAND',
      title: 'Explore possible gender bias with AI-assisted analysis.',
      description: 'Review contextual observations on roles, representation, and phrasing with balanced pedagogical explanations.',
      actionText: 'See Analysis Pipeline',
      colorClass: 'from-[#E0F2FE]/50 via-white to-white border-sky-200/60',
      accentBg: 'bg-[#2563EB] text-white',
    },
    {
      id: 'learn',
      badge: 'LEARN & PUZZLES',
      title: 'Test your instincts with interactive puzzles & scenarios.',
      description: 'Solve 44 interactive challenges: 20 curriculum scenarios, cognitive mind-bender riddles, concept scrambles, and spot-the-bias puzzles.',
      actionText: 'Solve Puzzles',
      colorClass: 'from-[#FFF1F2]/50 via-white to-white border-rose-200/60',
      accentBg: 'bg-[#F97059] text-white',
    },
    {
      id: 'world',
      badge: 'WORLD',
      title: 'Explore gender inequality data across 178 countries.',
      description: 'Interact with our high-definition world map powered by real UNDP Gender Inequality Index benchmarks across all continents.',
      actionText: 'Explore World Map',
      colorClass: 'from-[#0D192E]/5 via-white to-white border-slate-300/60',
      accentBg: 'bg-[#0D192E] text-white',
    },
    {
      id: 'news',
      badge: 'NEWS',
      title: 'Discover recent reporting about gender inequality.',
      description: 'Read documented reporting from UNESCO, Reuters, BBC, and Nature with direct verified links and live updates.',
      actionText: 'Read Fresh News',
      colorClass: 'from-[#FEF3C7]/40 via-white to-white border-amber-200/60',
      accentBg: 'bg-amber-500 text-white',
    },
    {
      id: 'report',
      badge: 'REPORT',
      title: 'Report instances of inequality anonymously or verified.',
      description: 'Document classroom stereotyping, athletic disparity, or workplace bias with confidential tracking codes and community transparency.',
      actionText: 'File a Report',
      colorClass: 'from-[#FEE2E2]/40 via-white to-white border-rose-200/60',
      accentBg: 'bg-rose-500 text-white',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. Hero Section */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD8CC]/60 text-xs font-semibold text-[#0D192E] border border-peach-300/70">
            <Sparkles className="w-3.5 h-3.5 text-[#F97059]" />
            <span>Student-Focused Curriculum Awareness</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#0D192E] tracking-tight leading-[1.1] text-balance">
            See the stories behind the pages.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            EQUORA helps students explore gender representation and possible bias in the textbooks
            and curriculum around them.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('scan')}
              className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ScanLine className="w-4 h-4 text-[#FFD8CC]" />
              <span>Scan a Page</span>
            </button>

            <button
              onClick={() => onNavigate('world')}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0D192E] backdrop-blur-md bg-white/80 hover:bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow transition-all"
            >
              <Globe2 className="w-4 h-4 text-[#2563EB]" />
              <span>Explore the World</span>
            </button>
          </div>

          {/* Floating Glassmorphic Verification Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-600">
            <div className="backdrop-blur-xl bg-white/70 border border-white/80 shadow-2xs px-3.5 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-800">ScanKit Image Cleaning</span>
            </div>
            <div className="backdrop-blur-xl bg-white/70 border border-white/80 shadow-2xs px-3.5 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="font-medium text-slate-800">UNDP Real GII Dataset</span>
            </div>
            <div className="backdrop-blur-xl bg-white/70 border border-white/80 shadow-2xs px-3.5 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F97059]" />
              <span className="font-medium text-slate-800">Contextual AI Nuance</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Connection: Textbook -> AI -> Understanding -> World */}
        <div className="mt-14 sm:mt-16">
          <HeroVisual
            onScanClick={() => onNavigate('scan')}
            onExploreWorld={() => onNavigate('world')}
          />
        </div>
      </section>

      {/* 2. "Gender bias isn't always obvious" Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] mb-2">
            Pedagogical Insight
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] tracking-tight mb-4">
            Gender bias isn't always obvious.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Bias in learning materials rarely appears as overt discrimination. Instead, it accumulates
            through subtle repetitions—who is asked to solve the complex equation, who is pictured
            directing the laboratory, and who is quietly cast in the role of helper.
          </p>
        </div>

        {/* Editorial Grid of Bias Vectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biasVectors.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-[#FFF5F0] text-[#F97059] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">0{i + 1}</span>
                  </div>

                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    {v.category}
                  </span>
                  <h3 className="text-lg font-semibold text-[#0D192E] mt-1 mb-2.5">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. "Explore EQUORA" Large Visual Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-[#F97059] mb-2">
            The EQUORA Framework
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] tracking-tight">
            Explore EQUORA
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Five integrated experiences built for curiosity, textual scrutiny, and global context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exploreCards.map((card) => (
            <div
              key={card.title}
              className={`p-7 rounded-3xl bg-gradient-to-br ${card.colorClass} border shadow-sm hover:shadow-md transition-all flex flex-col justify-between group`}
            >
              <div>
                <span className="inline-block text-[11px] font-mono tracking-wider text-slate-500 font-semibold mb-3">
                  {card.badge}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#0D192E] leading-snug mb-3">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onNavigate(card.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between bg-white border border-slate-200 text-[#0D192E] hover:bg-slate-50 group-hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0D192E] transition-all" />
                </button>
              </div>
            </div>
          ))}

          {/* Special Feature Highlight Card: The Chat Guide */}
          <div className="p-7 rounded-3xl bg-[#0D192E] text-white border border-slate-800 shadow-md flex flex-col justify-between group">
            <div>
              <span className="inline-block text-[11px] font-mono tracking-wider text-peach-300 text-[#FFD8CC] font-semibold mb-3">
                CHAT GUIDE
              </span>
              <h3 className="text-xl font-serif font-bold text-white leading-snug mb-3">
                Ask questions about representation with our friendly AI guide.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Wondering if an example is a stereotype, or how to speak up about unfairness? Ask
                EQUORA anytime.
              </p>
            </div>

            <div>
              <button
                onClick={() => onNavigate('chat')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between bg-[#FFD8CC] text-[#0D192E] hover:bg-[#FECDD3] transition-colors shadow-sm"
              >
                <span>Chat with EQUORA</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
