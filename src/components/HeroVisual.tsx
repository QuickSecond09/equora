import React, { useState } from 'react';
import { BookOpen, Sparkles, Globe2, ArrowRight, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeroVisualProps {
  onScanClick: () => void;
  onExploreWorld: () => void;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ onScanClick, onExploreWorld }) => {
  const [activeStage, setActiveStage] = useState<number>(3);

  const stages = [
    {
      num: 1,
      title: 'Textbook Page',
      subtitle: 'Original curriculum problem',
      icon: BookOpen,
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      num: 2,
      title: 'Optical Scan',
      subtitle: 'ScanKit OCR enhancement',
      icon: Sparkles,
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      num: 3,
      title: 'Understanding',
      subtitle: 'Contextual bias assessment',
      icon: Eye,
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      num: 4,
      title: 'World Context',
      subtitle: 'Global UNDP benchmark data',
      icon: Globe2,
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#FFF5F0]/90 via-white to-[#F0F7FF]/90 border border-peach-200/70 shadow-xl overflow-hidden">
      {/* Decorative subtle ambient glows */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-[#FFD8CC]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top 4-Stage Stepper Navigation */}
      <div className="mb-7 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {stages.map((st) => {
            const Icon = st.icon;
            const isSelected = activeStage === st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setActiveStage(st.num)}
                className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all duration-200 relative border ${
                  isSelected
                    ? 'bg-white shadow-sm border-[#0D192E]/20 ring-2 ring-[#0D192E]/10'
                    : 'bg-white/60 hover:bg-white/90 border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg border text-xs ${st.badgeColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[11px] font-mono font-semibold ${
                      isSelected ? 'text-[#0D192E]' : 'text-slate-400'
                    }`}
                  >
                    0{st.num}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                  {st.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {st.subtitle}
                </div>

                {isSelected && (
                  <span className="absolute bottom-0 inset-x-4 h-[2px] bg-[#0D192E] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Demonstration: Balanced Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        {/* Left Column: Scanned Page & OCR Capture */}
        <div className="lg:col-span-6 bg-white/95 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
              <span className="font-mono text-[11px] text-slate-500">
                Primary Social Studies · Excerpt p. 42
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                Page Scanned
              </span>
            </div>

            {/* Document excerpt box */}
            <div className="font-serif text-sm text-slate-800 leading-relaxed bg-[#FAF7F2] p-4 sm:p-5 rounded-xl border border-slate-200/70 relative">
              <p className="mb-3">
                "On Saturday morning,{' '}
                <mark className="bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded font-medium border-b-2 border-amber-400">
                  Father reads the business news before heading to his office
                </mark>
                , while{' '}
                <mark className="bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded font-medium border-b-2 border-amber-400">
                  Mother prepares the meals and tends to the household laundry
                </mark>
                ."
              </p>
              <p className="text-xs text-slate-500 font-sans italic">
                — Exercise 4: Describe the economic and domestic contributions in your community.
              </p>

              {/* Glowing optical scanline only during scan stage */}
              {activeStage === 2 && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent animate-scan" />
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-slate-700 font-medium text-[11px]">
                Potential stereotypical role pattern identified
              </span>
            </div>

            <button
              onClick={onScanClick}
              className="text-[#2563EB] hover:text-[#1D4ED8] font-medium text-xs flex items-center gap-1 group whitespace-nowrap"
            >
              <span>Scan your own page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Stage Content */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Main Dark Insight Card */}
          <div className="bg-[#0D192E] text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-sky-300 font-mono mb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  EQUORA Observation
                </span>
                <span className="text-[11px] text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/80 font-mono">
                  Confidence: High
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-2 leading-snug">
                Gendered Roles in Household Economics
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Repeated pairing of economic provision exclusively with fathers and domestic labor
                exclusively with mothers limits students' understanding of shared household
                partnership and diverse career trajectories.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="text-[11px] font-semibold text-sky-400">
                Suggested Classroom Reframe:
              </div>
              <p className="leading-relaxed text-slate-200">
                "Highlight diverse households where parents balance external careers and equally share
                domestic cooking, cleaning, and child rearing."
              </p>
            </div>
          </div>

          {/* Connected Global Data Preview Strip */}
          <div className="bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 flex items-center justify-between shadow-2xs gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB] shrink-0">
                <Globe2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  Global Labor & Leadership Index
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Compare how parental leave & labor parity impact equality across 60+ nations
                </div>
              </div>
            </div>

            <button
              onClick={onExploreWorld}
              className="px-3 py-1.5 text-xs font-medium text-[#0D192E] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              Explore Globe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
