import { SampleTextbook } from '../types';

export const SAMPLE_TEXTBOOKS: SampleTextbook[] = [
  {
    id: 'sample-math-finance',
    title: 'High School Business Math — Unit 4 Corporate Salaries',
    subject: 'Mathematics',
    gradeLevel: 'Grade 10',
    description: 'A word problem exploring corporate executive compensation, contrasting a male CEO with his female executive assistant.',
    scannedText: `CHAPTER 4: CORPORATE COMPENSATION AND DIVIDENDS

Problem 14.2:
A corporate CEO manages an enterprise of 1,200 employees. He earns an annual base compensation of $380,000, plus an annual executive performance bonus. His executive assistant, Sarah, handles his appointment calendar, serves refreshments during stakeholder briefings, and earns an hourly wage of $22.50. 

(a) If he works 50 weeks per year, calculate his equivalent hourly compensation.
(b) How many hours must Sarah work to equal his base monthly salary?
(c) Discuss why his strategic market vision entitles him to superior capital allocation compared to administrative assistants.`,
  },
  {
    id: 'sample-social-family',
    title: 'Primary Social Studies — Our Neighborhood & Family Roles',
    subject: 'Social Studies',
    gradeLevel: 'Grade 4',
    description: 'A reading passage describing weekend routines for parents, associating earning with the father and domestic maintenance with the mother.',
    scannedText: `UNIT 2: THE MODERN FAMILY AND COMMUNITY WORK

Lesson 3: Weekend Routines
Every family maintains a division of responsibilities to ensure the household functions smoothly. 

On Saturday morning, Father leaves early for the accounting office to earn money for the household expenses. He is the primary breadwinner who protects and finances the family's needs. Meanwhile, Mother stays home to care for the children, prepare breakfast, wash the dirty dishes in the kitchen sink, and iron the school clothes for Monday morning.

Review Questions:
1. What does Father do to support the family economically?
2. List three household duties that Mother completes while staying at home.`,
  },
  {
    id: 'sample-science-discovery',
    title: 'Introductory Physical Science — The Innovators of Electrical Power',
    subject: 'Physics',
    gradeLevel: 'Grade 8',
    description: 'An excerpt using exclusively male universal pronouns and terms like "mankind" and "man-made" for scientific innovation.',
    scannedText: `SECTION 3: MAN-MADE CURRENTS AND THE HARNESSING OF NATURE

From the dawn of civilization, mankind has sought to bend the physical elements to his will. The modern electrical grid is a testament to the boldness of man's engineering ingenuity. 

When a scientist enters his laboratory to calibrate a high-voltage circuit, he must wear insulated gloves. He calculates the voltage drop using Ohm's Law and records his findings in his notebook. Without his relentless analytical discipline, modern industrial progress would not exist.

Lab Exercise:
Design a parallel circuit that an engineer can use to power his workshop tools safely.`,
  },
  {
    id: 'sample-balanced-biology',
    title: 'Modern Cellular Biology — Pioneers of Genetic Structure',
    subject: 'Biology',
    gradeLevel: 'Grade 11',
    description: 'A balanced educational passage highlighting collaborative research, Dr. Rosalind Franklin, and gender-inclusive scientific representation.',
    scannedText: `CHAPTER 12: UNRAVELING THE DOUBLE HELIX

The discovery of DNA's molecular geometry in 1953 resulted from collaborative investigations across physical chemistry and X-ray crystallography. 

Dr. Rosalind Franklin, an expert biophysicist at King's College London, obtained Photo 51—the critical high-resolution diffraction photograph that revealed the helical nature of the molecule. Her precise measurements of density and hydration were fundamental to James Watson and Francis Crick's subsequent structural modeling. 

Simultaneously, Dr. Barbara McClintock demonstrated mobile genetic elements in maize, receiving the Nobel Prize in Physiology or Medicine. Today, research teams around the globe, led by scientists of all genders, utilize CRISPR gene editing to develop drought-resistant crops.

Review Question:
How did diverse scientific methodologies across chemistry and physics contribute to our understanding of genetics?`,
  },
];
