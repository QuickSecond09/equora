import React from 'react';
import { PageId } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D192E] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-2xl font-serif font-bold text-white tracking-tight">EQUORA</span>
            <p className="text-sm font-serif italic text-peach-200/90 text-[#FFD8CC]">
              "Explore. Question. Understand."
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              A student-focused educational platform helping learners recognize representation
              patterns, examine curriculum examples, and evaluate global gender parity with critical
              curiosity.
            </p>
          </div>

          {/* Platform Navigation */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Platform
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('scan')}
                  className="hover:text-white transition-colors"
                >
                  Textbook Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('chat')}
                  className="hover:text-white transition-colors"
                >
                  EQUORA Guide Chat
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('learn')}
                  className="hover:text-white transition-colors"
                >
                  Interactive Scenarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('world')}
                  className="hover:text-white transition-colors"
                >
                  Global Inequality World Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('report')}
                  className="hover:text-white transition-colors text-peach-300 text-[#FFD8CC]"
                >
                  Report Inequality Incident
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Editorial */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Inquiry & Sources
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('news')}
                  className="hover:text-white transition-colors"
                >
                  Fresh News & Reporting
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors"
                >
                  About the Project & Team
                </button>
              </li>
              <li>
                <a
                  href="https://hdr.undp.org/data-center/thematic-composite-indices/gender-inequality-index"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>UNDP Gender Inequality Index</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://en.unesco.org/gem-report/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>UNESCO GEM Report</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            Created as an educational project exploring gender representation and inequality.
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            EQUORA © {new Date().getFullYear()} · Educational Awareness
          </p>
        </div>
      </div>
    </footer>
  );
};
