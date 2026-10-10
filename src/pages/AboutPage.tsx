import React from 'react';
import {
  Eye,
  BookOpen,
  HelpCircle,
  Search,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Users,
  Compass,
  Table,
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  // Official project team members matching Section 2.1 of Project Logbook
  const teamMembers = [
    {
      id: 'dharmil',
      name: 'Dharmil',
      role: 'Project Leader',
      subroles: ['Data Expert', 'Information Researcher', 'Tester'],
      institution: 'EQUORA Team',
      bio: 'Schedules and allocates tasks among the team; ensures tasks are completed on time; collects research questions & sources, and works on training data.',
    },
    {
      id: 'tapan',
      name: 'Tapan',
      role: 'Prototype Builder / Coder',
      subroles: ['Designer', 'Data Expert', 'Tester'],
      institution: 'EQUORA Team',
      bio: 'Creates the prototype application and codes algorithms; plans user interface & process flow for the new user experience; trains/teaches computer models.',
    },
    {
      id: 'aayush',
      name: 'Aayush',
      role: 'Marketing / Communications Leader',
      subroles: ['Tester'],
      institution: 'EQUORA Team',
      bio: 'Collates the team Project Logbook submission; creates content for the video pitch; selects spokespeople within the team for various matters relating to the project.',
    },
    {
      id: 'janmay',
      name: 'Janmay',
      role: 'Video Producer & Information Researcher',
      subroles: ['Information Researcher', 'Tester'],
      institution: 'EQUORA Team',
      bio: 'Films the activities of the team and edits these into a presentation for submission; collects questions from the team and identifies where answers can be located.',
    },
    {
      id: 'takshil',
      name: 'Takshil',
      role: 'Video Producer',
      subroles: ['Tester'],
      institution: 'EQUORA Team',
      bio: 'Films the activities of the team and edits these into a cohesive video presentation for submission; tests prototype workflows and user feedback loops.',
    },
  ];

  // Section 2.1 Team Roles Table from Project Logbook
  const roleBreakdownTable = [
    {
      role: 'Project Leader',
      description: 'Schedules and allocates tasks among the team. Ensures tasks are completed on time.',
      members: 'Dharmil',
    },
    {
      role: 'Data Expert',
      description: 'Decides on type of data needed to train an AI model. Collects data.',
      members: 'Tapan, Dharmil',
    },
    {
      role: 'Information Researcher',
      description: 'Collects questions from the team that need answers. Identifies where answers can be located (source).',
      members: 'Dharmil, Janmay',
    },
    {
      role: 'Designer',
      description: 'Works with the team and the user to create a process flow for the new user experience. Plans the user interface for the prototype.',
      members: 'Tapan',
    },
    {
      role: 'Prototype builder/coder',
      description: 'Works with data expert to train/teach computer. Creates the prototype and codes if necessary.',
      members: 'Tapan',
    },
    {
      role: 'Tester',
      description: 'Works with users to tests the prototype. Gets feedback from users and user sign-off when the prototype has met user requirements.',
      members: 'All Team Members',
    },
    {
      role: 'Marketing/Communications Leader',
      description: 'Collates the team Project Logbook submission and creates the content for the video pitch. Selects spokespeople within the team for various matters relating to the project.',
      members: 'Aayush',
    },
    {
      role: 'Video Producer',
      description: 'Films the activities of the team and edits these into a presentation for submission.',
      members: 'Janmay, Takshil',
    },
  ];

  const processSteps = [
    {
      step: 'RECOGNIZE',
      desc: 'Notice who is depicted in examples, who is given executive agency, and how language is structured.',
    },
    {
      step: 'PRACTICE',
      desc: 'Apply the "Flip Test" and evaluate interactive scenarios to sharpen critical reading habits.',
    },
    {
      step: 'ASK',
      desc: 'Engage with the conversational guide to explore nuance, historical context, and fairness.',
    },
    {
      step: 'EXAMINE',
      desc: 'Scan real textbook pages with ScanKit and review AI-assisted textual observations.',
    },
    {
      step: 'LEARN',
      desc: 'Understand why representation shapes career aspirations and self-efficacy in STEM and civic life.',
    },
    {
      step: 'ACT',
      desc: 'Propose balanced classroom reframes, equitable group project roles, and curious discussions.',
    },
  ];

  const howItWorksFlow = [
    { label: 'Scan', sub: 'High-res image capture' },
    { label: 'OCR', sub: 'Optical character extraction' },
    { label: 'AI-assisted analysis', sub: 'Contextual bias evaluation' },
    { label: 'Understanding', sub: 'Pedagogical insight & reframe' },
    { label: 'Learning', sub: 'Classroom discussion & action' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20 pb-24">
      {/* 1. Hero Section */}
      <section className="space-y-6">
        <div className="text-xs font-mono uppercase tracking-widest text-[#F97059]">
          Platform Mission
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#0D192E] tracking-tight">
          Why EQUORA?
        </h1>
        <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-serif italic text-balance">
          "To help students notice what they might otherwise overlook."
        </p>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
          <p>
            Gender inequality is not always loud or obvious. It rarely announces itself as hostile
            discrimination. Instead, it enters our minds quietly through the pages we read every
            day at school:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-medium text-xs sm:text-sm text-[#0D192E]">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200/70">
              • Textbooks
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200/70">
              • Curriculum
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200/70">
              • Classroom examples
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200/70">
              • Activities
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200/70">
              • Expectations
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200/70">
              • Representation
            </div>
          </div>

          <p className="pt-2">
            When word problems routinely depict men as engineers and women as assistants, or when
            science history omits female innovators, students subconsciously absorb limits on what
            they and others can achieve. EQUORA provides the analytical tools to question those
            defaults.
          </p>
        </div>
      </section>

      {/* 2. "Why we built it" Section */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-semibold">
            Student-Centered Motivation
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D192E] mt-1">
            Why we built it
          </h2>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF5F0]/70 via-white to-sky-50/50 dark:from-[#0E1729] dark:via-[#0F172A] dark:to-[#0B1324] border border-peach-200 dark:border-slate-800 space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed shadow-sm">
          <p>
            EQUORA was conceived by students and educators who noticed a gap between high-level
            academic discussions of gender equality and the everyday realities of the classroom.
          </p>
          <p>
            Students often sense when a textbook exercise feels archaic or skewed, but lack a clear,
            constructive vocabulary to articulate why. By marrying computer vision and balanced
            natural language evaluation with verified global benchmarks, EQUORA transforms passive
            reading into active inquiry.
          </p>
        </div>
      </section>

      {/* 3. Illustrated Process: RECOGNIZE -> PRACTICE -> ASK -> EXAMINE -> LEARN -> ACT */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#F97059] font-semibold">
            Learning Methodology
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D192E] mt-1">
            The EQUORA Cycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Six interconnected steps from observation to thoughtful classroom contribution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {processSteps.map((step, idx) => (
            <div
              key={step.step}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#2563EB] font-bold">0{idx + 1}</span>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
                    Step
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-[#0D192E] tracking-tight mb-2">
                  {step.step}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. "How EQUORA works" (Scan -> OCR -> AI-assisted analysis -> Understanding -> Learning) */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-semibold">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D192E] mt-1">
            How EQUORA works
          </h2>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D192E] text-white border border-slate-800 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {howItWorksFlow.map((flow, i) => (
              <div
                key={flow.label}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 relative"
              >
                <div className="font-mono text-[10px] text-sky-400">Phase 0{i + 1}</div>
                <div className="text-sm font-semibold text-white">{flow.label}</div>
                <div className="text-[11px] text-slate-400">{flow.sub}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            ScanKit applies perspective rectification, binarization, and noise attenuation to the
            raw image. The OCR layer extracts textual lines, which are then passed to the EQUORA
            pedagogical engine to detect stereotypical role distributions, masculine-default
            pronouns, and exclusionary framing.
          </div>
        </div>
      </section>

      {/* 5. Project Team Section */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Contributors & Research Team
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D192E] mt-1">
              Project Team ({teamMembers.length} Members)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Core Team
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={member.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] text-[#0D192E] flex items-center justify-center font-serif text-lg font-bold border border-peach-200">
                  {idx + 1}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#0D192E]">{member.name}</h3>
                  <div className="text-xs text-[#2563EB] font-medium mt-0.5">{member.role}</div>
                  
                  {/* Subrole tags from Project Logbook */}
                  {member.subroles && member.subroles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {member.subroles.map((sr) => (
                        <span
                          key={sr}
                          className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-600 border border-slate-200/80"
                        >
                          {sr}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    {member.institution}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 2.1 Logbook Official Roles Table */}
        <div className="mt-8 space-y-3 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-sky-100 text-[#00A3E0] font-mono text-xs font-bold">
                Section 2.1
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#0D192E]">
                Who is in your team and what are their roles?
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Project Logbook Submission Table
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#00A3E0] text-white">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] w-1/4 border-r border-white/20">
                    ROLES
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] w-1/2 border-r border-white/20">
                    Role Description
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] w-1/4">
                    Team Member Name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {roleBreakdownTable.map((row, i) => (
                  <tr
                    key={row.role}
                    className={`hover:bg-sky-50/40 transition-colors ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#0D192E] border-r border-slate-100 align-top">
                      {row.role}
                    </td>
                    <td className="py-3 px-4 leading-relaxed border-r border-slate-100 align-top">
                      {row.description}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#0D192E] align-top">
                      {row.members === 'All Team Members' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> All Team Members
                        </span>
                      ) : (
                        <span className="font-semibold text-[#2563EB]">{row.members}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Mandatory Educational Disclaimer */}
      <section className="p-6 rounded-3xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-4 text-xs text-slate-600 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block mb-1">Educational Awareness Disclaimer</strong>
          EQUORA is an educational awareness tool. Its AI-assisted observations are not definitive
          judgments and should be considered alongside context and reliable sources.
        </div>
      </section>

      {/* 7. Philosophy Ending Quote */}
      <div className="text-center py-10">
        <div className="font-serif text-3xl sm:text-4xl italic text-[#0D192E] font-medium">
          "Explore. Question. Understand."
        </div>
      </div>
    </div>
  );
};
