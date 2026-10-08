import { BrainTeaserPuzzle, WordScramblePuzzle, SpotTheBiasPuzzle } from '../types';

export const BRAIN_TEASERS: BrainTeaserPuzzle[] = [
  {
    id: 'bt-surgeon',
    title: 'The Emergency Operating Room',
    difficulty: 'Quick Spark',
    category: 'Occupational Bias',
    riddle:
      'A father and his 12-year-old son are in a severe highway car crash. The father tragically dies at the scene. The boy is rushed by ambulance to the regional trauma hospital in critical condition. In the operating room, the chief surgeon scrubs in, looks closely at the boy on the table, turns pale, and exclaims: "I cannot operate on this patient—he is my son!" How is this possible?',
    hint: 'Think about familial relationships and unconscious assumptions about who holds medical authority.',
    options: [
      { id: 'opt-a', text: 'The surgeon is the boy’s mother.', isCorrect: true },
      { id: 'opt-b', text: 'The boy has two fathers in a married same-sex family.', isCorrect: true },
      { id: 'opt-c', text: 'The surgeon is a ghost hallucination.', isCorrect: false },
      { id: 'opt-d', text: 'The hospital misidentified the emergency patient.', isCorrect: false },
    ],
    revealExplanation:
      'The surgeon is the boy’s mother (or in modern diverse families, the boy has two fathers). In psychological experiments at Boston University, between 40% and 75% of participants (including students and doctors) struggled to solve this riddle because their immediate subconscious schema defaulted to "surgeon = male".',
    psychologicalInsight:
      'Implicit cognitive schema: Our brains rely on cognitive shortcuts (heuristics) built from repeated media exposure. Even when we consciously champion equality, automated occupational associations can blind us to simple solutions.',
    historicalOrSocialFact:
      'In 1970, only 9% of US medical school students were women. Today, women represent over 52% of entering medical students, yet women still account for under 22% of tenured surgical department chairs globally.',
  },
  {
    id: 'bt-flight-crew',
    title: 'The Transatlantic Cockpit',
    difficulty: 'Moderate Riddle',
    category: 'STEM & Aviation',
    riddle:
      'A commercial Boeing 787 lands in Frankfurt after a turbulent transatlantic flight. Two senior pilots emerge from the cockpit: Captain Miller and First Officer Davis. It is established that Captain Miller is the mother of First Officer Davis’s only child. Yet, Captain Miller and First Officer Davis are NOT married to each other, have never had a romantic relationship, and have never used a surrogate or donor. How is this possible?',
    hint: 'Pay close attention to who is married to whom, or how two people can have the exact same child in a family tree.',
    options: [
      { id: 'opt-a', text: 'They are married to each other under different legal surnames.', isCorrect: false },
      { id: 'opt-b', text: 'They are two married women (a married lesbian couple) who co-parented their child.', isCorrect: true },
      { id: 'opt-c', text: 'Captain Miller is First Officer Davis’s mother (and her child is First Officer Davis!).', isCorrect: true },
      { id: 'opt-d', text: 'One of the pilots adopted the other pilot in adulthood.', isCorrect: false },
    ],
    revealExplanation:
      'Either: 1) Captain Miller is First Officer Davis’s mother (making Davis the "only child"), OR 2) First Officer Davis is a woman married to Captain Miller’s husband’s sibling, OR 3) Captain Miller is the mother of First Officer Davis himself! Cognitive lock-in occurs when readers automatically imagine both pilots as middle-aged heterosexual men.',
    psychologicalInsight:
      'Gender and family role schemas: Listeners automatically assign male gender to high-status technical titles ("Captain", "First Officer") and struggle to map maternal lineage onto professional aviation hierarchies.',
    historicalOrSocialFact:
      'Globally, women account for just 5.8% of commercial airline pilots, making aviation one of the most starkly gender-imbalanced technical professions in modern transportation.',
  },
  {
    id: 'bt-blind-audition',
    title: 'The Symphony Orchestra Screen',
    difficulty: 'Moderate Riddle',
    category: 'Institutional Equity',
    riddle:
      'In the 1970s, major symphony orchestras insisted that conductor audition panels were 100% merit-based: "We only listen for musical perfection; gender has zero influence on our ears." Yet over 95% of hired musicians across the top 5 orchestras were men. To test bias, orchestras put up a thick visual privacy screen between musicians and the jury. At first, female hiring barely changed. Then orchestras introduced ONE additional rule to the screened audition—and female acceptance instantly jumped by 50%! What was the missing detail?',
    hint: 'Think about sensory clues other than direct sight that give away gender before a note is played.',
    options: [
      { id: 'opt-a', text: 'Musicians were required to take off their shoes or walk on a heavy carpet carpeted runway.', isCorrect: true },
      { id: 'opt-b', text: 'Musicians had to play electronic digital synthesizers instead of wooden violins.', isCorrect: false },
      { id: 'opt-c', text: 'The jury was replaced entirely with computer pitch-detection algorithms.', isCorrect: false },
      { id: 'opt-d', text: 'Musicians were forbidden from warming up before playing.', isCorrect: false },
    ],
    revealExplanation:
      'Musicians had to remove high-heeled shoes or walk on carpet! Even behind the screen, the jury could hear the clicking footsteps of female auditionees walking onto the wooden stage. Once the footsteps were silenced, auditions became truly blind, and the likelihood of a female musician advancing surged by 50% (documented in Harvard economists Claudia Goldin and Cecilia Rouse\'s landmark 2000 study).',
    psychologicalInsight:
      'Subtle perceptual leakage: Implicit bias doesn’t require direct visual gaze; micro-cues like footsteps, pitch of greeting, or names on paper trigger unconscious stereotyping even among trained judges.',
    historicalOrSocialFact:
      'Following the introduction of blind auditions and carpeted runways, the proportion of women in top US symphony orchestras rose from less than 10% in 1970 to over 38% today.',
  },
  {
    id: 'bt-archeologist-hunter',
    title: 'The 9,000-Year-Old Andean Tomb',
    difficulty: 'Deep Mind Bender',
    category: 'History & Anthropology',
    riddle:
      'In 2018, archeologists excavating the high-altitude Wilamaya Patjxa site in Peru uncovered a 9,000-year-old human skeleton buried alongside a lavish hunting toolkit: stone projectile points, flake knives, and animal processing tools. For over a century, archeological textbooks taught that prehistoric hunters were exclusively male ("Man the Hunter"). How did physical anthropologists prove that this big-game hunter challenged the textbook paradigm?',
    hint: 'Think about molecular genetics and amelogenin dental proteins.',
    options: [
      { id: 'opt-a', text: 'Proteomic analysis of dental enamel and osteological pelvic analysis proved the hunter was biological female.', isCorrect: true },
      { id: 'opt-b', text: 'They found ancient cave hieroglyphs signed with a female handprint.', isCorrect: false },
      { id: 'opt-c', text: 'The weapons were made of softer stone reserved for decorative burials.', isCorrect: false },
      { id: 'opt-d', text: 'The skeleton was discovered clutching woven baskets alongside spear tips.', isCorrect: false },
    ],
    revealExplanation:
      'Dental peptide analysis (amelogenin proteins on tooth enamel) and bone anatomy proved the hunter was biological female (17–19 years old). Subsequent review of 107 ancient burial sites across North and South America revealed that between 30% and 50% of Pleistocene big-game hunters were female, completely overturning the 20th-century myth that ancient women only gathered berries.',
    psychologicalInsight:
      'Historical projection: Mid-20th-century scientists projected modern post-war suburban gender roles (male breadwinner / female domestic caretaker) backward onto Ice Age hunter-gatherer societies.',
    historicalOrSocialFact:
      'Published in Science Advances in 2020 by Randy Haas et al., this discovery sparked global curriculum revisions in university anthropology and world history textbooks.',
  },
  {
    id: 'bt-vc-pitch',
    title: 'The Venture Capitalist & Founder Meeting',
    difficulty: 'Moderate Riddle',
    category: 'Economics & Venture',
    riddle:
      'Two tech entrepreneurs, Elena and Marcus, pitched identical SaaS business models with identical $2M ARR metrics to two different angel investor boards. Both were asked 10 questions. Marcus was asked: "How will you capture market share and scale to $20M?" Elena was asked: "How will you prevent user churn and safeguard against downside cash loss?" Marcus raised $3M; Elena struggled to close $400k. What psychological investment asymmetry explains this puzzle?',
    hint: 'Focus on regulatory focus theory: promotion questions versus prevention questions.',
    options: [
      { id: 'opt-a', text: 'Male founders are asked promotion-focused questions (upside potential); female founders are asked prevention-focused questions (downside risk).', isCorrect: true },
      { id: 'opt-b', text: 'Venture investors have stricter math requirements for women founders.', isCorrect: false },
      { id: 'opt-c', text: 'Marcus had more years of software coding experience.', isCorrect: false },
      { id: 'opt-d', text: 'Elena pitched an idea in a crowded retail cosmetics market.', isCorrect: false },
    ],
    revealExplanation:
      'Promotion vs. Prevention Questioning: Harvard and Columbia researchers (Dana Kanze et al.) analyzed hundreds of VC pitch Q&A transcripts and discovered that 67% of questions asked to male entrepreneurs were promotion-oriented (growth, vision, scaling), while 66% of questions asked to female entrepreneurs were prevention-oriented (risk mitigation, retention, loss avoidance). Startups asked promotion questions raise 7x more funding.',
    psychologicalInsight:
      'Unconscious risk attribution: Investors subconsciously view male leadership through a lens of exploratory upside and female leadership through a lens of defensive maintenance.',
    historicalOrSocialFact:
      'Despite founding over 40% of small businesses in the US, female-founded startups receive less than 2.3% of total venture capital funding worldwide.',
  },
  {
    id: 'bt-nobel-physics',
    title: 'The Invisible Laboratory Pioneer',
    difficulty: 'Deep Mind Bender',
    category: 'STEM History',
    riddle:
      'In 1905, a brilliant scientist co-authored groundbreaking physics calculations. In 1938, a female physicist in Sweden did the mathematical equations proving that the uranium nucleus had split in half (discovering nuclear fission). Yet when the 1944 Nobel Prize in Chemistry was awarded for nuclear fission, ONLY her male lab partner Otto Hahn received the Nobel Prize, while she was omitted for over four decades. Who was this physicist, and what is this phenomenon called?',
    hint: 'Her name is Lise, and the chemical element 109 (Meitnerium) was later named in her honor.',
    options: [
      { id: 'opt-a', text: 'Lise Meitner — illustrating the "Matilda Effect".', isCorrect: true },
      { id: 'opt-b', text: 'Rosalind Franklin — illustrating the Photo 51 paradox.', isCorrect: false },
      { id: 'opt-c', text: 'Chien-Shiung Wu — illustrating the parity breakdown.', isCorrect: false },
      { id: 'opt-d', text: 'Marie Curie — illustrating radioactive isolation.', isCorrect: false },
    ],
    revealExplanation:
      'Lise Meitner! She provided the crucial theoretical explanation and mathematical calculation for nuclear fission while living in exile from Nazi Germany. Her exclusion from the Nobel Prize is one of the most famous historical cases of the Matilda Effect—where female scientists’ work is credited solely to their male colleagues.',
    psychologicalInsight:
      'Attribution asymmetry: Historically, when scientific teams consist of men and women, the broader community has reflexively assigned the primary creative genius to the male member and regarded the female member as a technical assistant.',
    historicalOrSocialFact:
      'Element 109 in the periodic table was officially named Meitnerium (Mt) in 1997 to honor Lise Meitner, making her one of only two women with an element named exclusively for her (alongside Marie Curie).',
  },
  {
    id: 'bt-chess-masters',
    title: 'The Tournament Champions Paradox',
    difficulty: 'Quick Spark',
    category: 'Cognitive Science & Sports',
    riddle:
      'In a competitive chess hall, two world-rated grandmasters played 7 tournament games in one weekend. Both players won 4 matches each, suffered zero losses, and there were no draws or stalemates. How could both players emerge undefeated with winning records?',
    hint: 'Did the riddle specify they were playing against one another?',
    options: [
      { id: 'opt-a', text: 'They were playing against different opponents in separate tournament brackets.', isCorrect: true },
      { id: 'opt-b', text: 'They were playing simultaneous exhibition speed games on one board.', isCorrect: false },
      { id: 'opt-c', text: 'The chess arbiter awarded bonus points for illegal moves.', isCorrect: false },
      { id: 'opt-d', text: 'One player was coaching via electronic earpiece.', isCorrect: false },
    ],
    revealExplanation:
      'They weren’t playing each other! Grandmaster Judit Polgár and Grandmaster Magnus Carlsen were playing different competitors in open tournament divisions. Assumption blindness happens when we construct unnecessary constraints (assuming two mentioned subjects must be locked in direct conflict or zero-sum competition).',
    psychologicalInsight:
      'Constraint imposition: When analyzing gender and performance, people often default to binary adversarial frames ("men vs. women") rather than evaluating individual mastery across broad cooperative or independent fields.',
    historicalOrSocialFact:
      'Judit Polgár broke Bobby Fischer’s record to become the youngest grandmaster in history at age 15, and defeated eleven current or former world chess champions during her professional career.',
  },
  {
    id: 'bt-code-architect',
    title: 'The Tech Architecture Lead & Support Engineer',
    difficulty: 'Quick Spark',
    category: 'Workplace & Tech',
    riddle:
      'At a global cloud computing enterprise, the Principal Distributed Systems Architect and the Junior Customer Support Specialist shared an office. When a high-priority enterprise outage occurred, the person in faded jeans and sneakers calmly debugged the Linux kernel core dump, while the person in a tailored three-piece suit and luxury watch answered incoming help desk phone tickets. An incoming auditor assumed the suited professional was the chief architect. What cognitive bias caused the auditor’s mistake?',
    hint: 'Sartorial conformity bias combined with gender and occupational status tropes.',
    options: [
      { id: 'opt-a', text: 'Superficial sartorial bias: mistaking external formal dress and traditional male corporate attire for technical competence.', isCorrect: true },
      { id: 'opt-b', text: 'The auditor was looking for network cables rather than people.', isCorrect: false },
      { id: 'opt-c', text: 'The Linux kernel was running in simulated demo mode.', isCorrect: false },
      { id: 'opt-d', text: 'Junior engineers are legally required to wear luxury watches.', isCorrect: false },
    ],
    revealExplanation:
      'The engineer in sneakers was Dr. Priya Sharma, Principal Architect; the suited professional was the support specialist! The auditor relied on superficial signifiers of corporate authority rather than observing actual domain workflow. In tech, domain leadership rarely correlates with traditional corporate dress.',
    psychologicalInsight:
      'Halo effect & appearance stereotyping: Observers frequently confuse polished executive presentation with technical engineering capability, frequently penalizing women and minority coders who don’t fit historic stereotypical moulds.',
    historicalOrSocialFact:
      'Research across open-source code repositories (like GitHub) found that pull requests submitted by women developers had a HIGHER acceptance rate than men’s—but ONLY when their profiles were gender-neutral. When gender was visible, women’s code acceptance rates dropped significantly.',
  },
];

export const WORD_SCRAMBLES: WordScramblePuzzle[] = [
  {
    id: 'ws-matilda',
    concept: 'MATILDA EFFECT',
    scrambled: 'TADAMIL TECFFE',
    category: 'STEM & History',
    clue: 'The systematic historical bias where women scientists’ discoveries and achievements are attributed to their male male colleagues or mentors.',
    definition:
      'Named after suffragist Matilda Joslyn Gage by science historian Margaret Rossiter in 1993, this effect describes the systemic suppression or erasure of female scientific contributions (e.g., Rosalind Franklin, Jocelyn Bell Burnell, Lise Meitner).',
    exampleContext:
      'When textbook chapters attribute the discovery of pulsars solely to Antony Hewish without mentioning student Jocelyn Bell Burnell who actually identified the signals.',
  },
  {
    id: 'ws-glass-ceiling',
    concept: 'GLASS CEILING',
    scrambled: 'SSALG GNILIEC',
    category: 'Workplace & Economics',
    clue: 'An unacknowledged, invisible barrier to advancement in a profession, especially affecting women and members of minorities.',
    definition:
      'Coined in the 1970s, this metaphor represents systemic structural barriers, informal networks ("old boys clubs"), and implicit biases that prevent qualified women from reaching senior executive or board-level appointments.',
    exampleContext:
      'Textbooks analyzing why women comprise 50% of entry-level accounting and law graduates, yet make up less than 20% of equity partners or Fortune 500 CEOs.',
  },
  {
    id: 'ws-stereotype-threat',
    concept: 'STEREOTYPE THREAT',
    scrambled: 'PETEYROETS TAERHT',
    category: 'Cognitive Science & Education',
    clue: 'The psychological anxiety that one’s performance will conform to or confirm a negative cultural stereotype about one’s identity group.',
    definition:
      'Identified by Claude Steele and Joshua Aronson, this cognitive burden consumes working memory. For example, when girls are told "girls struggle with spatial math" right before an exam, their scores drop due to cortisol stress, not mathematical capability.',
    exampleContext:
      'Simply checking a gender box before an advanced STEM test has been shown to induce anxiety and measurably lower exam performance for female test-takers.',
  },
  {
    id: 'ws-occupational-segregation',
    concept: 'OCCUPATIONAL SEGREGATION',
    scrambled: 'CUPPATIONALOC GERESATIONG',
    category: 'Labor Economics',
    clue: 'The distribution of workers across different jobs and career fields based strictly on gender expectations and social conditioning.',
    definition:
      'Occurs horizontally (women funneled into care, hospitality, and primary education; men into engineering, finance, construction) and vertically (men dominating high-wage executive ranks within the same industry).',
    exampleContext:
      'Career fair brochures that depict boys only next to precision machining and girls only next to floral design or daycare administration.',
  },
  {
    id: 'ws-gender-parity',
    concept: 'GENDER PARITY',
    scrambled: 'DRENEG YTRIPA',
    category: 'Global Development',
    clue: 'A statistical measure comparing equal representation and proportional access of genders in education, civic life, and leadership.',
    definition:
      'Calculated as the ratio of female to male values for a given indicator (e.g. UNESCO Gender Parity Index). A value between 0.97 and 1.03 reflects equal participation in schooling or civic parliaments.',
    exampleContext:
      'Tracking United Nations Sustainable Development Goal 5 (SDG 5) across national primary and secondary school graduation rates.',
  },
  {
    id: 'ws-unconscious-bias',
    concept: 'UNCONSCIOUS BIAS',
    scrambled: 'CONSCIUNOUS SAIB',
    category: 'Social Psychology',
    clue: 'Social stereotypes and implicit associations about certain groups of people that individuals form outside their conscious awareness.',
    definition:
      'Learned attitudes, cultural tropes, and media repetitions stored in the amygdala and cerebral cortex that influence automatic decision-making, grading, hiring, and interpersonal behavior without deliberate malice.',
    exampleContext:
      'Teachers unknowingly calling on male students for math explanations and female students for handwriting tasks.',
  },
  {
    id: 'ws-intersectionality',
    concept: 'INTERSECTIONALITY',
    scrambled: 'SECTIONINTERYALTI',
    category: 'Sociology & Human Rights',
    clue: 'The framework analyzing how multiple social identities (e.g., gender, race, class, disability) combine and compound systems of discrimination.',
    definition:
      'Introduced by legal scholar Kimberlé Crenshaw in 1989, demonstrating that inequalities cannot be understood through single-issue lenses; the experiences of Black, Indigenous, or disabled women differ fundamentally from generic experiences.',
    exampleContext:
      'Analyzing global wage data showing women of color face substantially wider pay gaps than White women compared to male benchmarks.',
  },
  {
    id: 'ws-care-economy',
    concept: 'CARE ECONOMY',
    scrambled: 'EACR YMCONOE',
    category: 'Macroeconomics',
    clue: 'The sector of human activity involving child-rearing, elderly care, and domestic maintenance—often unpaid and excluded from GDP.',
    definition:
      'The foundational economic infrastructure of society. Globally, women perform over 76% of total unpaid care work (representing an estimated $11 trillion in uncounted economic value, or roughly 9% of global GDP).',
    exampleContext:
      'Economics textbook chapters that define "productive work" exclusively as monetized wage labor while ignoring maternal and community care.',
  },
];

export const SPOT_THE_BIAS_PUZZLES: SpotTheBiasPuzzle[] = [
  {
    id: 'sp-history-wives',
    title: 'The Industrial Revolution Civic Leaders',
    subject: 'World History',
    gradeLevel: 'Grade 8',
    rawExcerpt:
      'While the great statesmen and factory owners debated the Reform Acts in Parliament, their wives tended the gardens and hosted social dinners to refresh their husbands.',
    targetPhrase: 'their wives tended the gardens and hosted social dinners',
    options: [
      'great statesmen and factory owners',
      'debated the Reform Acts in Parliament',
      'their wives tended the gardens and hosted social dinners',
      'to refresh their husbands',
    ],
    repairedExcerpt:
      'While prominent male statesmen debated the Reform Acts in Parliament, female trade unionists, suffragists, and political essayists organized public petitions and strikes demanding workers’ rights.',
    explanation:
      'The original excerpt relegates 19th-century women entirely to decorative, passive domesticity, erasing the pivotal contributions of working-class women organizers, Chartist leaders, and early suffragists who shaped labor laws.',
  },
  {
    id: 'sp-math-ceo',
    title: 'Corporate Ratio Calculations in Business Math',
    subject: 'Applied Mathematics',
    gradeLevel: 'Grade 9',
    rawExcerpt:
      'A corporate CEO earns $350,000 annually based on his strategic foresight. His secretary Mary earns $32,000. Express Mary’s salary as a percentage of his earnings.',
    targetPhrase: 'His secretary Mary',
    options: [
      'corporate CEO earns $350,000',
      'based on his strategic foresight',
      'His secretary Mary',
      'percentage of his earnings',
    ],
    repairedExcerpt:
      'A corporate CEO, Dr. Marcus Lee, earns $350,000. Executive Operations Director Sarah Chen earns $185,000. Calculate the compensation ratio and discuss executive wage distribution.',
    explanation:
      'Defaulting male pronouns to high-earning strategic leadership ("CEO / his strategic foresight") while assigning female names to low-wage administrative support ("His secretary Mary") reinforces persistent occupational wage hierarchies in problem sets.',
  },
  {
    id: 'sp-science-natural-dexterity',
    title: 'Vocational Technical Laboratory Guidelines',
    subject: 'Secondary Science',
    gradeLevel: 'Grade 10',
    rawExcerpt:
      'Boys possess natural spatial strength for lathe machinery, while girls with delicate fingers are well-suited for slide staining.',
    targetPhrase: 'girls with delicate fingers are well-suited for slide staining',
    options: [
      'Boys possess natural spatial strength',
      'for lathe machinery',
      'girls with delicate fingers are well-suited for slide staining',
      'laboratory safety protocol',
    ],
    repairedExcerpt:
      'All students will develop technical spatial calibration for lathe machinery and meticulous microscope precision through guided laboratory practice.',
    explanation:
      'Assigning machine mastery to innate male biological traits and bench delicacy to innate female traits discourages girls from precision engineering and boys from laboratory finesse.',
  },
  {
    id: 'sp-lit-passivity',
    title: 'Character Description in Classical Literature Study',
    subject: 'English Language Arts',
    gradeLevel: 'Grade 7',
    rawExcerpt:
      'The brave knight set forth on his perilous quest, while the princess wept helplessly in her tower awaiting rescue.',
    targetPhrase: 'the princess wept helplessly in her tower awaiting rescue',
    options: [
      'The brave knight set forth',
      'on his perilous quest',
      'the princess wept helplessly in her tower awaiting rescue',
      'in her tower',
    ],
    repairedExcerpt:
      'The brave knight set forth on his perilous quest, while Princess Lyra orchestrated defense fortifications and deciphered ancient navigational scrolls.',
    explanation:
      'Uncritical reinforcement of the "damsel in distress" trope strips female characters of agency, problem-solving intellect, and tactical leadership in storytelling.',
  },
  {
    id: 'sp-athletics-pe',
    title: 'Campus Physical Education Guidelines',
    subject: 'Health & Physical Education',
    gradeLevel: 'Grade 6',
    rawExcerpt:
      'During physical training, boys will run five full laps to build athletic stamina, while girls may do gentle aerobics or walk with friends.',
    targetPhrase: 'girls may do gentle aerobics or walk with friends',
    options: [
      'During physical training',
      'boys will run five full laps',
      'to build athletic stamina',
      'girls may do gentle aerobics or walk with friends',
    ],
    repairedExcerpt:
      'All students will complete high-intensity cardiovascular interval circuits tailored to their individual heart rate zones and athletic development goals.',
    explanation:
      'Lowering athletic expectations and conditioning standards for girls undercuts cardiovascular fitness development, self-efficacy, and confidence in athletic competition.',
  },
  {
    id: 'sp-civics-policeman',
    title: 'Community Helpers and Municipal Governance',
    subject: 'Primary Social Studies',
    gradeLevel: 'Grade 4',
    rawExcerpt:
      'When trouble strikes in the city, the brave policeman and fireman risk their lives to protect us, while nurses bandage our wounds.',
    targetPhrase: 'the brave policeman and fireman risk their lives to protect us, while nurses bandage our wounds',
    options: [
      'When trouble strikes in the city',
      'the brave policeman and fireman risk their lives to protect us, while nurses bandage our wounds',
      'protect us',
      'bandage our wounds',
    ],
    repairedExcerpt:
      'When emergencies strike in the city, first responders—including police officers, firefighters, and paramedics of all genders—work cooperatively with trauma nurses and physicians.',
    explanation:
      'Gender-exclusive job titles ("policeman", "fireman") and segregating protective heroics to men and domestic care to women locks early childhood learners into rigid gender roles.',
  },
  {
    id: 'sp-comp-nerd',
    title: 'Introduction to Computer Programming',
    subject: 'Computer Science',
    gradeLevel: 'Grade 9',
    rawExcerpt:
      'Programming is ideal for quiet teenage boys who love video games, whereas social students should consider digital marketing.',
    targetPhrase: 'ideal for quiet teenage boys who love video games',
    options: [
      'Programming is ideal for quiet teenage boys who love video games',
      'who love video games',
      'whereas social students',
      'should consider digital marketing',
    ],
    repairedExcerpt:
      'Software engineering requires creative problem-solving, collaborative teamwork, and human-centered design, welcoming students with varied passions from art to environmental science.',
    explanation:
      'Stereotyping software engineering as an anti-social masculine gamer preserve contributes directly to the historic drop in female computer science undergraduate enrollment.',
  },
  {
    id: 'sp-economics-unpaid',
    title: 'Macroeconomic Principles: Measuring National Gross Domestic Product',
    subject: 'Economics',
    gradeLevel: 'Grade 12',
    rawExcerpt:
      'Productive economic work is defined solely by market transactions; non-working mothers who cook and raise children contribute zero value to national output.',
    targetPhrase: 'non-working mothers who cook and raise children contribute zero value to national output',
    options: [
      'Productive economic work is defined solely',
      'by market transactions',
      'non-working mothers who cook and raise children contribute zero value to national output',
      'to national output',
    ],
    repairedExcerpt:
      'While standard GDP tracks market transactions, modern macroeconomists recognize that unpaid domestic caregiving and child-rearing generate vital foundational economic value worth trillions annually.',
    explanation:
      'Labeling full-time domestic caretakers as "non-working" and calculating their economic contribution as "zero" invisibilizes the disproportionately female care economy that sustains all productive workforce capacity.',
  },
];
