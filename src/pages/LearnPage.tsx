import React, { useState } from 'react';
import { SCENARIOS, RECOGNIZE_BIAS_CHECKLIST } from '../data/scenariosData';
import { Scenario } from '../types';
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
  Filter,
  Check
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'Yes' | 'No' | 'It depends on context'>>({});
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

  const currentScenario: Scenario | undefined = filteredScenarios[currentIndex] || filteredScenarios[0];
  const userChoice = currentScenario ? selectedAnswers[currentScenario.id] : undefined;
  const isAnswered = !!userChoice;

  const handleSelectOption = (option: 'Yes' | 'No' | 'It depends on context') => {
    if (!currentScenario || isAnswered) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: option,
    }));

    const nextCompleted = new Set(completedScenarios);
    nextCompleted.add(currentScenario.id);
    setCompletedScenarios(nextCompleted);

    // If matches the pedagogical correct answer, trigger celebratory confetti
    if (option === currentScenario.correctAnswer) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#F97059', '#FFD8CC'],
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredScenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleResetProgress = () => {
    setSelectedAnswers({});
    setCompletedScenarios(new Set());
    setCurrentIndex(0);
  };

  const progressPercentage = Math.round((completedScenarios.size / SCENARIOS.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-24">
      {/* 1. Header Section */}
      <div className="max-w-3xl">
        <div className="text-xs font-mono uppercase tracking-widest text-[#F97059] mb-1.5">
          Interactive Evaluation Lab
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] tracking-tight">
          Learn to Recognize Bias
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Test your analytical instincts against real-world educational scenarios. Notice how subtle
          assumptions enter textbooks, classroom duties, and problem sets.
        </p>
      </div>

      {/* 2. "Before You Decide — Recognize Bias" 4-Question Framework */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-semibold">
            Core Toolkit
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#0D192E] mt-1">
            Before You Decide — Recognize Bias
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Whenever evaluating a textbook illustration, word problem, or school task, apply these four
            guiding questions:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RECOGNIZE_BIAS_CHECKLIST.map((item, idx) => (
            <div
              key={item.title}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200/70 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-[#2563EB] font-semibold">0{idx + 1}</span>
                <h3 className="text-sm font-semibold text-[#0D192E] mt-1">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">"{item.question}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Scenario Game Stage */}
      <section className="space-y-6">
        {/* Progress & Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF5F0] text-[#F97059] flex items-center justify-center font-bold text-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0D192E]">
                Scenarios Solved: {completedScenarios.size} of {SCENARIOS.length}
              </div>
              <div className="w-32 sm:w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-[#FFD8CC] to-[#2563EB] h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProgress}
              className="text-[11px] text-slate-500 hover:text-black flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Category Filter Buttons (Functional controls per frontend constitution) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-[#0D192E] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scenario Card */}
        {currentScenario && (
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-md space-y-7 animate-fade-in">
            {/* Context Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#2563EB] font-semibold uppercase">
                  Scenario {currentIndex + 1} of {filteredScenarios.length}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {currentScenario.category}
                </span>
              </div>

              <div className="text-[11px] text-slate-400">
                {currentScenario.curriculumContext}
              </div>
            </div>

            {/* Excerpt Box */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D192E]">
                {currentScenario.title}
              </h3>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 text-sm font-serif leading-relaxed text-slate-800 shadow-inner">
                {currentScenario.excerpt}
              </div>
            </div>

            {/* The Question */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-[#0D192E]">
                {currentScenario.question}
              </h4>

              {/* 3 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Yes', 'No', 'It depends on context'] as const).map((opt) => {
                  const isSelected = userChoice === opt;
                  const isCorrectChoice = opt === currentScenario.correctAnswer;

                  let buttonStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';

                  if (isAnswered) {
                    if (isSelected && isCorrectChoice) {
                      buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200';
                    } else if (isSelected && !isCorrectChoice) {
                      buttonStyle = 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-200';
                    } else if (isCorrectChoice) {
                      buttonStyle = 'bg-emerald-50/50 border-emerald-300 text-emerald-700';
                    } else {
                      buttonStyle = 'opacity-50 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-center flex items-center justify-center gap-2 ${buttonStyle} ${
                        !isAnswered ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : ''
                      }`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrectChoice && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation Drawer after selection */}
            {isAnswered && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF5F0]/70 via-white to-sky-50/50 border border-peach-200 space-y-4 animate-slide-up">
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
                    onClick={handleNext}
                    disabled={currentIndex === filteredScenarios.length - 1}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] disabled:opacity-40 rounded-xl transition-colors shadow-sm"
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
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {filteredScenarios.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'bg-[#2563EB] w-5'
                        : selectedAnswers[s.id]
                        ? 'bg-emerald-400'
                        : 'bg-slate-200'
                    }`}
                    title={s.title}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === filteredScenarios.length - 1}
                className="flex items-center gap-1 text-slate-600 hover:text-black disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
