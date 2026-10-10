import React, { useState } from 'react';
import { SCENARIOS, RECOGNIZE_BIAS_CHECKLIST } from '../data/scenariosData';
import { BRAIN_TEASERS, WORD_SCRAMBLES, SPOT_THE_BIAS_PUZZLES } from '../data/puzzlesData';
import { Scenario, BrainTeaserPuzzle, WordScramblePuzzle, SpotTheBiasPuzzle } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Check,
  Brain,
  Puzzle,
  Search,
  Lightbulb,
  Shuffle,
  ShieldCheck,
  Zap,
  Flame,
  Trophy
} from 'lucide-react';

type PuzzleTab = 'scenarios' | 'brain-teasers' | 'word-scramble' | 'spot-the-bias';

export const LearnPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PuzzleTab>('scenarios');

  // -------------------------------------------------------------
  // Mode 1: Curriculum Scenarios State
  // -------------------------------------------------------------
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, 'Yes' | 'No' | 'It depends on context'>>({});
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = [
    'All',
    'Careers',
    'Sports',
    'Household responsibilities',
    'Leadership',
    'Science & technology',
    'Arts',
    'School activities',
    'Language & descriptions',
  ];

  const filteredScenarios = categoryFilter === 'All'
    ? SCENARIOS
    : SCENARIOS.filter((s) => s.category === categoryFilter);

  const currentScenario: Scenario = filteredScenarios[scenarioIndex] || filteredScenarios[0] || SCENARIOS[0];
  const scenarioUserChoice = scenarioAnswers[currentScenario?.id];
  const isScenarioAnswered = !!scenarioUserChoice;

  const handleSelectScenarioOption = (option: 'Yes' | 'No' | 'It depends on context') => {
    if (!currentScenario || isScenarioAnswered) return;

    setScenarioAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: option,
    }));

    const nextCompleted = new Set(completedScenarios);
    nextCompleted.add(currentScenario.id);
    setCompletedScenarios(nextCompleted);

    if (option === currentScenario.correctAnswer) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#F97059', '#FFD8CC'],
      });
    }
  };

  // -------------------------------------------------------------
  // Mode 2: Mind Bender Riddles State
  // -------------------------------------------------------------
  const [teaserIndex, setTeaserIndex] = useState<number>(0);
  const [teaserAnswers, setTeaserAnswers] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [solvedTeasers, setSolvedTeasers] = useState<Set<string>>(new Set());

  const currentTeaser: BrainTeaserPuzzle = BRAIN_TEASERS[teaserIndex] || BRAIN_TEASERS[0];
  const userTeaserChoice = teaserAnswers[currentTeaser.id];
  const isTeaserAnswered = !!userTeaserChoice;
  const isTeaserHintShown = revealedHints[currentTeaser.id];

  const handleSelectTeaserOption = (optionId: string, isCorrect: boolean) => {
    if (isTeaserAnswered) return;

    setTeaserAnswers((prev) => ({
      ...prev,
      [currentTeaser.id]: optionId,
    }));

    if (isCorrect) {
      const nextSolved = new Set(solvedTeasers);
      nextSolved.add(currentTeaser.id);
      setSolvedTeasers(nextSolved);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#059669', '#2563EB', '#F97059'],
      });
    }
  };

  // -------------------------------------------------------------
  // Mode 3: Concept Scramble State
  // -------------------------------------------------------------
  const [scrambleIndex, setScrambleIndex] = useState<number>(0);
  const [scrambleInputs, setScrambleInputs] = useState<Record<string, string>>({});
  const [scrambleFeedback, setScrambleFeedback] = useState<Record<string, 'correct' | 'incorrect' | null>>({});
  const [solvedScrambles, setSolvedScrambles] = useState<Set<string>>(new Set());
  const [scrambleHintsUsed, setScrambleHintsUsed] = useState<Record<string, boolean>>({});

  const currentScramble: WordScramblePuzzle = WORD_SCRAMBLES[scrambleIndex] || WORD_SCRAMBLES[0];
  const currentScrambleInput = scrambleInputs[currentScramble.id] || '';
  const isCurrentScrambleSolved = solvedScrambles.has(currentScramble.id);
  const currentScrambleStatus = scrambleFeedback[currentScramble.id];

  const handleCheckScramble = () => {
    const cleanInput = currentScrambleInput.trim().toUpperCase().replace(/\s+/g, ' ');
    const target = currentScramble.concept.toUpperCase();

    if (cleanInput === target) {
      setScrambleFeedback((prev) => ({ ...prev, [currentScramble.id]: 'correct' }));
      const nextSolved = new Set(solvedScrambles);
      nextSolved.add(currentScramble.id);
      setSolvedScrambles(nextSolved);

      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#10B981', '#F59E0B'],
      });
    } else {
      setScrambleFeedback((prev) => ({ ...prev, [currentScramble.id]: 'incorrect' }));
    }
  };

  const handleGiveScrambleHint = () => {
    setScrambleHintsUsed((prev) => ({ ...prev, [currentScramble.id]: true }));
    // Pre-fill first word or partial letters
    const words = currentScramble.concept.split(' ');
    const hintText = words.map(w => w[0] + '...').join(' ');
    setScrambleInputs((prev) => ({ ...prev, [currentScramble.id]: hintText }));
  };

  // -------------------------------------------------------------
  // Mode 4: Spot The Bias Detective State
  // -------------------------------------------------------------
  const [spotIndex, setSpotIndex] = useState<number>(0);
  const [spotSelections, setSpotSelections] = useState<Record<string, string>>({});
  const [solvedSpots, setSolvedSpots] = useState<Set<string>>(new Set());

  const currentSpot: SpotTheBiasPuzzle = SPOT_THE_BIAS_PUZZLES[spotIndex] || SPOT_THE_BIAS_PUZZLES[0];
  const userSpotChoice = spotSelections[currentSpot.id];
  const isSpotAnswered = !!userSpotChoice;
  const isSpotCorrect = userSpotChoice === currentSpot.targetPhrase;

  const handleSelectSpotOption = (option: string) => {
    if (isSpotAnswered) return;

    setSpotSelections((prev) => ({
      ...prev,
      [currentSpot.id]: option,
    }));

    if (option === currentSpot.targetPhrase) {
      const nextSolved = new Set(solvedSpots);
      nextSolved.add(currentSpot.id);
      setSolvedSpots(nextSolved);

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#F97059', '#38BDF8'],
      });
    }
  };

  // -------------------------------------------------------------
  // Overall Aggregate Stats
  // -------------------------------------------------------------
  const totalPuzzlesCount = SCENARIOS.length + BRAIN_TEASERS.length + WORD_SCRAMBLES.length + SPOT_THE_BIAS_PUZZLES.length;
  const totalSolvedCount = completedScenarios.size + solvedTeasers.size + solvedScrambles.size + solvedSpots.size;
  const overallPercentage = Math.round((totalSolvedCount / totalPuzzlesCount) * 100);

  const handleResetAllProgress = () => {
    setScenarioAnswers({});
    setCompletedScenarios(new Set());
    setScenarioIndex(0);

    setTeaserAnswers({});
    setRevealedHints({});
    setSolvedTeasers(new Set());
    setTeaserIndex(0);

    setScrambleInputs({});
    setScrambleFeedback({});
    setSolvedScrambles(new Set());
    setScrambleHintsUsed({});
    setScrambleIndex(0);

    setSpotSelections({});
    setSolvedSpots(new Set());
    setSpotIndex(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#F97059] mb-1.5 flex items-center gap-1.5 font-semibold">
            <Puzzle className="w-3.5 h-3.5 text-[#F97059]" />
            Interactive Evaluation & Puzzle Lab
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] tracking-tight">
            Learn to Recognize Bias
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Sharpen your analytical radar across 44 interactive challenges: real-world curriculum scenarios,
            famous cognitive riddles, terminology scrambles, and textbook editor puzzles.
          </p>
        </div>

        {/* Global Progress Pill Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4 min-w-[260px]">
          <div className="w-12 h-12 rounded-xl bg-[#FFF5F0] text-[#0D192E] flex items-center justify-center font-serif text-lg font-bold border border-peach-200">
            <Trophy className="w-6 h-6 text-[#F97059]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Mastery Progress</span>
              <span className="font-mono text-[#2563EB]">{totalSolvedCount}/{totalPuzzlesCount}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#F97059] h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>{overallPercentage}% Completed</span>
              <button
                onClick={handleResetAllProgress}
                className="hover:text-rose-500 transition-colors flex items-center gap-0.5"
                title="Reset puzzle progress"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Mode Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'scenarios'
              ? 'bg-[#0D192E] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Curriculum Scenarios</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono bg-white/20 text-white">
            {completedScenarios.size}/{SCENARIOS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('brain-teasers')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'brain-teasers'
              ? 'bg-[#0D192E] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Brain className="w-4 h-4 text-[#F97059]" />
          <span>Mind Benders & Riddles</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono bg-white/20 text-white">
            {solvedTeasers.size}/{BRAIN_TEASERS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('word-scramble')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'word-scramble'
              ? 'bg-[#0D192E] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Shuffle className="w-4 h-4 text-amber-400" />
          <span>Concept Scramble</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono bg-white/20 text-white">
            {solvedScrambles.size}/{WORD_SCRAMBLES.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('spot-the-bias')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'spot-the-bias'
              ? 'bg-[#0D192E] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Search className="w-4 h-4 text-emerald-400" />
          <span>Spot The Bias</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full font-mono bg-white/20 text-white">
            {solvedSpots.size}/{SPOT_THE_BIAS_PUZZLES.length}
          </span>
        </button>
      </div>

      {/* 3. Core Framework Card (Always visible context helper) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-semibold">
              Evaluation Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0D192E]">
              Before You Decide — 4 Cognitive Checks
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-[#FAF7F2] px-3 py-1 rounded-lg border border-slate-200">
            Pedagogical Heuristic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {RECOGNIZE_BIAS_CHECKLIST.map((item, idx) => (
            <div
              key={item.title}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-peach-200/60 hover:border-[#F97059]/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-md bg-[#FFF5F0] text-[#F97059] flex items-center justify-center font-mono text-xs font-bold border border-peach-200">
                  {idx + 1}
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-[#0D192E]">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.question}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/* MODE 1: CURRICULUM SCENARIOS (20 Puzzles)                      */}
      {/* ============================================================= */}
      {activeTab === 'scenarios' && (
        <section className="space-y-6 animate-fade-in">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setScenarioIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-slate-500">
              Scenario {scenarioIndex + 1} of {filteredScenarios.length}
            </div>
          </div>

          {/* Active Scenario Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono text-[#F97059] uppercase font-semibold">
                  {currentScenario.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D192E] mt-0.5">
                  {currentScenario.title}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Context: {currentScenario.curriculumContext}
                </div>
              </div>

              {completedScenarios.has(currentScenario.id) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>

            {/* Curriculum Excerpt Callout */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border-l-4 border-[#2563EB] text-slate-800 font-serif italic text-sm sm:text-base leading-relaxed">
              {currentScenario.excerpt}
            </div>

            {/* Question Prompt */}
            <div className="space-y-3">
              <div className="font-semibold text-sm text-[#0D192E]">
                {currentScenario.question}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Yes', 'No', 'It depends on context'] as const).map((opt) => {
                  const isSelected = scenarioUserChoice === opt;
                  const isCorrectChoice = opt === currentScenario.correctAnswer;

                  let btnStyle = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';
                  if (isScenarioAnswered) {
                    if (isSelected && isCorrectChoice) {
                      btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold ring-2 ring-emerald-200';
                    } else if (isSelected && !isCorrectChoice) {
                      btnStyle = 'bg-rose-50 text-rose-800 border-rose-400 font-semibold';
                    } else if (isCorrectChoice) {
                      btnStyle = 'bg-emerald-50/60 text-emerald-800 border-emerald-300 font-semibold';
                    } else {
                      btnStyle = 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectScenarioOption(opt)}
                      disabled={isScenarioAnswered}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between text-left ${btnStyle} ${
                        !isScenarioAnswered ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : ''
                      }`}
                    >
                      <span>{opt}</span>
                      {isScenarioAnswered && isCorrectChoice && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation Drawer after selection */}
            {isScenarioAnswered && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF5F0]/70 via-white to-sky-50/50 dark:from-[#0E1729] dark:via-[#0F172A] dark:to-[#0B1324] border border-peach-200 dark:border-slate-800 space-y-4 animate-slide-up">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0D192E]">
                    Curriculum Analysis:
                  </span>
                  <span className="text-xs font-mono text-[#F97059]">
                    Pedagogical consensus: "{currentScenario.correctAnswer}"
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentScenario.explanation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Key Takeaway:</strong>
                    <span className="text-slate-600">{currentScenario.keyTakeaway}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <strong className="text-[#2563EB] block mb-1">Critical Classroom Question:</strong>
                    <span className="text-slate-600">"{currentScenario.criticalQuestion}"</span>
                  </div>
                </div>

                {/* Next button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      if (scenarioIndex < filteredScenarios.length - 1) {
                        setScenarioIndex((prev) => prev + 1);
                      }
                    }}
                    disabled={scenarioIndex === filteredScenarios.length - 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] disabled:opacity-40 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Next Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => scenarioIndex > 0 && setScenarioIndex((prev) => prev - 1)}
                disabled={scenarioIndex === 0}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5 max-w-[60%] overflow-x-auto py-1">
                {filteredScenarios.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setScenarioIndex(idx)}
                    className={`h-2.5 rounded-full transition-all shrink-0 ${
                      idx === scenarioIndex
                        ? 'bg-[#2563EB] w-5'
                        : scenarioAnswers[s.id]
                        ? 'bg-emerald-400 w-2.5'
                        : 'bg-slate-200 w-2.5'
                    }`}
                    title={s.title}
                  />
                ))}
              </div>

              <button
                onClick={() => scenarioIndex < filteredScenarios.length - 1 && setScenarioIndex((prev) => prev + 1)}
                disabled={scenarioIndex === filteredScenarios.length - 1}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* MODE 2: MIND BENDERS & RIDDLES (8 Classic & Modern Riddles)     */}
      {/* ============================================================= */}
      {activeTab === 'brain-teasers' && (
        <section className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F97059] bg-[#FFF5F0] px-3 py-1 rounded-xl border border-peach-200">
                Cognitive Schema Riddles
              </span>
              <span className="text-xs text-slate-500">
                Testing unconscious mental shortcuts and occupational assumptions
              </span>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Riddle {teaserIndex + 1} of {BRAIN_TEASERS.length}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-50 text-[#2563EB] font-semibold border border-sky-200">
                    {currentTeaser.category}
                  </span>
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
                    currentTeaser.difficulty === 'Quick Spark'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : currentTeaser.difficulty === 'Moderate Riddle'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {currentTeaser.difficulty}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D192E] mt-2">
                  {currentTeaser.title}
                </h3>
              </div>

              {solvedTeasers.has(currentTeaser.id) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Riddle Solved!
                </span>
              )}
            </div>

            {/* Riddle Excerpt */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0D192E] to-[#1E293B] text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono text-sky-300">
                <span className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#F97059]" />
                  The Riddle:
                </span>
                <button
                  type="button"
                  onClick={() => setRevealedHints((prev) => ({ ...prev, [currentTeaser.id]: !isTeaserHintShown }))}
                  className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isTeaserHintShown ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              </div>

              <p className="font-serif text-base sm:text-lg leading-relaxed text-slate-100">
                "{currentTeaser.riddle}"
              </p>

              {isTeaserHintShown && (
                <div className="p-3 bg-white/10 rounded-xl text-xs text-amber-200 border border-white/10 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><strong>Hint:</strong> {currentTeaser.hint}</span>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Choose the explanation:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTeaser.options.map((opt) => {
                  const isSelected = userTeaserChoice === opt.id;

                  let style = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';
                  if (isTeaserAnswered) {
                    if (opt.isCorrect) {
                      style = 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold ring-2 ring-emerald-200';
                    } else if (isSelected && !opt.isCorrect) {
                      style = 'bg-rose-50 text-rose-800 border-rose-400 font-semibold';
                    } else {
                      style = 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectTeaserOption(opt.id, opt.isCorrect)}
                      disabled={isTeaserAnswered}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-start justify-between gap-2 ${style} ${
                        !isTeaserAnswered ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : ''
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isTeaserAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reveal Explanation Drawer */}
            {isTeaserAnswered && (
              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-peach-200 space-y-4 animate-slide-up">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#F97059]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D192E]">
                    The Cognitive Solution:
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {currentTeaser.revealExplanation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <strong className="text-[#2563EB] block mb-1 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" />
                      Psychological Mechanism:
                    </strong>
                    <span className="text-slate-600 leading-relaxed">{currentTeaser.psychologicalInsight}</span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-700 block mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Historical & Social Fact:
                    </strong>
                    <span className="text-slate-600 leading-relaxed">{currentTeaser.historicalOrSocialFact}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => teaserIndex < BRAIN_TEASERS.length - 1 && setTeaserIndex((prev) => prev + 1)}
                    disabled={teaserIndex === BRAIN_TEASERS.length - 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] disabled:opacity-40 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Next Riddle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => teaserIndex > 0 && setTeaserIndex((prev) => prev - 1)}
                disabled={teaserIndex === 0}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {BRAIN_TEASERS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setTeaserIndex(idx)}
                    className={`h-2.5 rounded-full transition-all shrink-0 ${
                      idx === teaserIndex
                        ? 'bg-[#2563EB] w-5'
                        : solvedTeasers.has(t.id)
                        ? 'bg-emerald-400 w-2.5'
                        : 'bg-slate-200 w-2.5'
                    }`}
                    title={t.title}
                  />
                ))}
              </div>

              <button
                onClick={() => teaserIndex < BRAIN_TEASERS.length - 1 && setTeaserIndex((prev) => prev + 1)}
                disabled={teaserIndex === BRAIN_TEASERS.length - 1}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* MODE 3: CONCEPT SCRAMBLE (8 Terminology Decoders)              */}
      {/* ============================================================= */}
      {activeTab === 'word-scramble' && (
        <section className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                Equality Concept Decoders
              </span>
              <span className="text-xs text-slate-500">
                Unscramble core sociological & economic equality terms
              </span>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Challenge {scrambleIndex + 1} of {WORD_SCRAMBLES.length}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                  {currentScramble.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D192E] mt-2">
                  Unscramble the Concept
                </h3>
              </div>

              {isCurrentScrambleSolved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Term Decoded!
                </span>
              )}
            </div>

            {/* Clue Card */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-peach-200 space-y-2">
              <div className="text-xs font-mono font-semibold text-[#F97059] uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#F97059]" />
                Definition Clue:
              </div>
              <p className="text-sm sm:text-base text-slate-800 font-serif leading-relaxed">
                "{currentScramble.clue}"
              </p>
            </div>

            {/* Scrambled Letters Display */}
            <div className="text-center space-y-4 py-2">
              <div className="text-xs font-mono uppercase text-slate-400">
                Scrambled Letters:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {currentScramble.scrambled.split('').map((char, i) => (
                  <span
                    key={`${char}-${i}`}
                    className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl flex items-center justify-center font-mono text-base sm:text-lg font-bold shadow-xs transition-transform hover:scale-105 ${
                      char === ' '
                        ? 'bg-transparent border-transparent w-4'
                        : 'bg-[#0D192E] text-white border border-slate-700'
                    }`}
                  >
                    {char === ' ' ? '' : char}
                  </span>
                ))}
              </div>
            </div>

            {/* User Input & Actions */}
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentScrambleInput}
                  onChange={(e) => {
                    setScrambleInputs((prev) => ({ ...prev, [currentScramble.id]: e.target.value }));
                    if (currentScrambleStatus) {
                      setScrambleFeedback((prev) => ({ ...prev, [currentScramble.id]: null }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCheckScramble();
                  }}
                  disabled={isCurrentScrambleSolved}
                  placeholder="Type your answer here..."
                  className="flex-1 p-3.5 bg-[#FAF7F2] border border-slate-300 rounded-xl text-sm font-mono uppercase tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />

                <button
                  onClick={handleCheckScramble}
                  disabled={isCurrentScrambleSolved || !currentScrambleInput.trim()}
                  className="px-5 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <button
                  type="button"
                  onClick={handleGiveScrambleHint}
                  disabled={isCurrentScrambleSolved}
                  className="hover:text-[#2563EB] transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reveal Letter Clue</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Quick clear
                    setScrambleInputs((prev) => ({ ...prev, [currentScramble.id]: '' }));
                    setScrambleFeedback((prev) => ({ ...prev, [currentScramble.id]: null }));
                  }}
                  className="hover:text-rose-500 transition-colors"
                >
                  Clear
                </button>
              </div>

              {currentScrambleStatus === 'incorrect' && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Not quite! Check the letter count or try the letter clue hint.</span>
                </div>
              )}
            </div>

            {/* Solved Explanation Card */}
            {isCurrentScrambleSolved && (
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-slide-up">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-mono text-sm font-bold uppercase tracking-wider">
                    Correct: {currentScramble.concept}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentScramble.definition}
                </p>

                <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 text-xs">
                  <strong className="text-emerald-900 block mb-1">Curriculum Case Study:</strong>
                  <span className="text-slate-600">{currentScramble.exampleContext}</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => scrambleIndex < WORD_SCRAMBLES.length - 1 && setScrambleIndex((prev) => prev + 1)}
                    disabled={scrambleIndex === WORD_SCRAMBLES.length - 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] disabled:opacity-40 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Next Concept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => scrambleIndex > 0 && setScrambleIndex((prev) => prev - 1)}
                disabled={scrambleIndex === 0}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {WORD_SCRAMBLES.map((ws, idx) => (
                  <button
                    key={ws.id}
                    onClick={() => setScrambleIndex(idx)}
                    className={`h-2.5 rounded-full transition-all shrink-0 ${
                      idx === scrambleIndex
                        ? 'bg-[#2563EB] w-5'
                        : solvedScrambles.has(ws.id)
                        ? 'bg-emerald-400 w-2.5'
                        : 'bg-slate-200 w-2.5'
                    }`}
                    title={ws.concept}
                  />
                ))}
              </div>

              <button
                onClick={() => scrambleIndex < WORD_SCRAMBLES.length - 1 && setScrambleIndex((prev) => prev + 1)}
                disabled={scrambleIndex === WORD_SCRAMBLES.length - 1}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* MODE 4: SPOT THE BIAS (8 Curriculum Detective Challenges)      */}
      {/* ============================================================= */}
      {activeTab === 'spot-the-bias' && (
        <section className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                Textbook Editor Detective
              </span>
              <span className="text-xs text-slate-500">
                Identify the biased phrase in the passage and watch it transform
              </span>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Detective Case {spotIndex + 1} of {SPOT_THE_BIAS_PUZZLES.length}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {currentSpot.subject}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {currentSpot.gradeLevel}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D192E] mt-2">
                  {currentSpot.title}
                </h3>
              </div>

              {solvedSpots.has(currentSpot.id) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Bias Neutralized!
                </span>
              )}
            </div>

            {/* Original Raw Excerpt */}
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border-l-4 border-amber-500 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Raw Textbook Excerpt:
              </span>
              <p className="font-serif text-base sm:text-lg text-slate-800 italic leading-relaxed">
                "{currentSpot.rawExcerpt}"
              </p>
            </div>

            {/* Instruction & Clickable Options */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Click the phrase that reinforces insidious gender bias:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSpot.options.map((phrase) => {
                  const isSelected = userSpotChoice === phrase;
                  const isCorrect = phrase === currentSpot.targetPhrase;

                  let style = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';
                  if (isSpotAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold ring-2 ring-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-50 text-rose-800 border-rose-400 font-semibold';
                    } else {
                      style = 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={phrase}
                      onClick={() => handleSelectSpotOption(phrase)}
                      disabled={isSpotAnswered}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-start justify-between gap-2 ${style} ${
                        !isSpotAnswered ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : ''
                      }`}
                    >
                      <span>"{phrase}"</span>
                      {isSpotAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Repaired Excerpt & Breakdown */}
            {isSpotAnswered && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/50 dark:from-emerald-950/40 dark:via-[#0F172A] dark:to-[#0B1324] border border-emerald-200 dark:border-emerald-800 space-y-4 animate-slide-up">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Equitable Revision:
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-200 font-serif text-slate-800 text-sm sm:text-base leading-relaxed italic border-l-4 border-l-emerald-500">
                  "{currentSpot.repairedExcerpt}"
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700">
                  <strong className="text-slate-900 block mb-1">Pedagogical Review:</strong>
                  {currentSpot.explanation}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => spotIndex < SPOT_THE_BIAS_PUZZLES.length - 1 && setSpotIndex((prev) => prev + 1)}
                    disabled={spotIndex === SPOT_THE_BIAS_PUZZLES.length - 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] disabled:opacity-40 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Next Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => spotIndex > 0 && setSpotIndex((prev) => prev - 1)}
                disabled={spotIndex === 0}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {SPOT_THE_BIAS_PUZZLES.map((sp, idx) => (
                  <button
                    key={sp.id}
                    onClick={() => setSpotIndex(idx)}
                    className={`h-2.5 rounded-full transition-all shrink-0 ${
                      idx === spotIndex
                        ? 'bg-[#2563EB] w-5'
                        : solvedSpots.has(sp.id)
                        ? 'bg-emerald-400 w-2.5'
                        : 'bg-slate-200 w-2.5'
                    }`}
                    title={sp.title}
                  />
                ))}
              </div>

              <button
                onClick={() => spotIndex < SPOT_THE_BIAS_PUZZLES.length - 1 && setSpotIndex((prev) => prev + 1)}
                disabled={spotIndex === SPOT_THE_BIAS_PUZZLES.length - 1}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
