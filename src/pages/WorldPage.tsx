import React, { useState } from 'react';
import { RealWorldMap } from '../components/RealWorldMap';
import { COUNTRIES_GII_DATA, GII_METADATA, getGIIColor } from '../data/globeData';
import { CountryGII } from '../types';
import {
  Map,
  Info,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Award,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Layers,
  Heart,
  Landmark,
  Briefcase,
  GraduationCap,
  Search,
  Globe
} from 'lucide-react';

export const WorldPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryGII>(
    COUNTRIES_GII_DATA[0] // Denmark default (#1)
  );
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryRegion, setDirectoryRegion] = useState('All');

  const regions = ['All', 'Europe', 'Americas', 'Asia', 'Africa', 'Middle East', 'Oceania'];

  const filteredDirectoryCountries = COUNTRIES_GII_DATA.filter((c) => {
    const matchesRegion = directoryRegion === 'All' || c.region.toLowerCase() === directoryRegion.toLowerCase();
    const matchesSearch =
      !directorySearch.trim() ||
      c.name.toLowerCase().includes(directorySearch.toLowerCase().trim()) ||
      c.iso.toLowerCase().includes(directorySearch.toLowerCase().trim());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-sky-400 mb-1.5 font-semibold">
            International Benchmark Data · UNDP Human Development Reports
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] dark:text-white tracking-tight">
            Gender Inequality, Seen Globally.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Explore how gender inequality varies across countries using verified United Nations Gender Inequality Index (GII) data. Click any nation on the map to inspect its civic, educational, and health benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 shadow-2xs">
          <Map className="w-4 h-4 text-[#2563EB] dark:text-sky-400" />
          <span className="font-semibold text-slate-900 dark:text-white">Mapbox & Open Data Engine</span>
        </div>
      </div>

      {/* 2. Primary World Map Display Stage */}
      <section className="space-y-4">
        <RealWorldMap
          selectedCountry={selectedCountry}
          onSelectCountry={(c) => setSelectedCountry(c)}
        />

        {/* Dataset Transparency Metadata Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-mono">Dataset Name</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{GII_METADATA.datasetName}</div>
          </div>

          <div>
            <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-mono">Publication Year</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{GII_METADATA.year}</div>
          </div>

          <div>
            <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-mono">Institutional Source</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{GII_METADATA.source}</div>
          </div>

          <div>
            <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-mono">Index Scope</div>
            <div className="text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
              Health, parliamentary empowerment, secondary education, and labor participation.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Selected Country Deep Dossier */}
      {selectedCountry && (
        <section className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-sky-400 font-semibold">
                  {selectedCountry.region} Region
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0D192E] dark:bg-[#1E293B] text-white">
                  Global Rank #{selectedCountry.rank}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D192E] dark:text-white mt-1">
                {selectedCountry.name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-500 block">
                  Gender Inequality Index (GII)
                </span>
                <span
                  className="font-mono text-2xl font-bold"
                  style={{ color: getGIIColor(selectedCountry.gii) }}
                >
                  {selectedCountry.gii.toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          {/* 5 Core Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Maternal Mortality */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Maternal Mortality</span>
              </div>
              <div className="text-xl font-bold text-[#0D192E] dark:text-white font-mono">
                {selectedCountry.maternalMortalityRatio}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">deaths per 100k births</div>
            </div>

            {/* Adolescent Birth Rate */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                <span>Adolescent Births</span>
              </div>
              <div className="text-xl font-bold text-[#0D192E] dark:text-white font-mono">
                {selectedCountry.adolescentBirthRate}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">births per 1,000 (15-19)</div>
            </div>

            {/* Parliamentary Share */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Landmark className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
                <span>Parliament Seats</span>
              </div>
              <div className="text-xl font-bold text-[#0D192E] dark:text-white font-mono">
                {selectedCountry.femaleParliamentShare}%
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">held by women</div>
            </div>

            {/* Secondary Education */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Secondary Education</span>
              </div>
              <div className="text-xl font-bold text-[#0D192E] dark:text-white font-mono">
                {selectedCountry.femaleSecondaryEdu}%
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">adult women completed</div>
            </div>

            {/* Labor Force Participation */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Labor Force Ratio</span>
              </div>
              <div className="text-xl font-bold text-[#0D192E] dark:text-white font-mono">
                {selectedCountry.laborForceRatio}%
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">female to male ratio</div>
            </div>
          </div>

          {/* Expert Analysis Commentary */}
          <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-[#0B1324] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-semibold text-[#0D192E] dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
              <span>International Data Observation & Context</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedCountry.explanation}
            </p>
          </div>
        </section>
      )}

      {/* 4. Global Comparative Dimensions & Educational Explainer */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Dimensions Explainer */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#F97059] font-semibold">
              Measurement Architecture
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#0D192E] dark:text-white mt-1">
              What the GII Measures
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              The United Nations Development Programme created the Gender Inequality Index (GII) to
              quantify human development loss attributable to gender disparities. It combines three
              interdependent dimensions:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-[#0D192E] dark:text-white flex items-center justify-between">
                <span>1. Reproductive Health</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Maternal & Youth Health</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Measured by the Maternal Mortality Ratio (deaths per 100,000 live births) and the
                Adolescent Birth Rate (births per 1,000 women aged 15–19). Poor maternal healthcare
                and early childbirth disproportionately derail girls' secondary education and life
                chances.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-[#0D192E] dark:text-white flex items-center justify-between">
                <span>2. Civic & Educational Empowerment</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Parliament & High School</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Measured by the percentage of national parliamentary seats held by women and the
                percentage of adult women with completed secondary or higher education compared to
                men.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-[#0D192E] dark:text-white flex items-center justify-between">
                <span>3. Economic Status</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Labor Market Parity</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Measured by the female labor force participation rate relative to the male rate for
                individuals aged 15 and older, reflecting formal earning independence.
              </p>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start gap-3 text-xs text-slate-700 dark:text-blue-200">
            <Info className="w-4 h-4 text-[#2563EB] dark:text-sky-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Critical Data Reminder:</strong> Do not imply that one number represents every
              aspect of gender equality. Even nations with very low GII scores continue to work
              through gender wage gaps, digital harassment, and domestic unpaid labor distribution.
            </p>
          </div>
        </div>

        {/* Global Countries Quick Lookup List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#0D192E] dark:text-white">
                  Global Index Directory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredDirectoryCountries.length} of {COUNTRIES_GII_DATA.length} nations
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-sky-400 border border-blue-100 dark:border-blue-900/40">
                178 Countries
              </span>
            </div>

            {/* Search Box */}
            <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#0B1324] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search any country or ISO..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
              {directorySearch && (
                <button
                  onClick={() => setDirectorySearch('')}
                  className="text-slate-400 hover:text-black dark:hover:text-white text-xs font-bold cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setDirectoryRegion(reg)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    directoryRegion === reg
                      ? 'bg-[#0D192E] dark:bg-[#2563EB] text-white font-medium shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto pr-1">
              {filteredDirectoryCountries.length > 0 ? (
                filteredDirectoryCountries.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountry(c)}
                    className={`w-full py-2.5 px-3 flex items-center justify-between text-left rounded-xl transition-colors cursor-pointer ${
                      selectedCountry?.id === c.id
                        ? 'bg-slate-100 dark:bg-slate-800/90 font-semibold text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: getGIIColor(c.gii) }}
                      />
                      <span className="text-xs text-slate-900 dark:text-slate-200 truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">#{c.rank}</span>
                    </div>
                    <div className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                      {c.gii.toFixed(3)}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No countries found matching "{directorySearch}".
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
