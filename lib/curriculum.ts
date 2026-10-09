// Curriculum map for 11+ and GCSE. Config, not logic: edit here, nothing else hardcodes topics.
// Topic lists are working drafts from public specification structure; verify each against the
// board's own specification page before release (see HANDOFF.md).

export type ExamStage = '11plus' | 'gcse'

export interface Topic {
  id: string
  title: string
  /** Assessment objective tags used for reporting (e.g. AO1/AO2/AO3 for GCSE Maths) */
  ao?: string[]
  /** Memorise-module set this topic feeds: 'words' | 'formulae' | 'terms' | 'dates' | 'techniques' */
  memorise?: 'words' | 'formulae' | 'terms' | 'dates' | 'techniques'
}

export interface Subject {
  id: string
  title: string
  stage: ExamStage
  /** Board or board-style template. 11+ boards are separate templates (GL, CEM). */
  boards: string[]
  /** GCSE tiers where applicable */
  tiers?: string[]
  topics: Topic[]
}

const t = (id: string, title: string, extra: Partial<Topic> = {}): Topic => ({ id, title, ...extra })

export const SUBJECTS: Subject[] = [
  // ───── 11+ ─────
  {
    id: '11plus-english', title: '11+ English', stage: '11plus', boards: ['GL', 'CEM'],
    topics: [
      t('comprehension', 'Comprehension (fiction, non-fiction, poetry)'),
      t('vocab-in-context', 'Vocabulary in context', { memorise: 'words' }),
      t('spag', 'Spelling, punctuation and grammar'),
      t('word-classes', 'Word classes and sentence structure'),
      t('cloze', 'Cloze and missing-word passages', { memorise: 'words' }),
      t('spelling-patterns', 'Spelling patterns and common errors', { memorise: 'words' }),
    ],
  },
  {
    id: '11plus-maths', title: '11+ Maths', stage: '11plus', boards: ['GL', 'CEM'],
    topics: [
      t('number-place-value', 'Number and place value'),
      t('four-operations', 'Four operations and mental methods'),
      t('fractions-decimals-percentages', 'Fractions, decimals and percentages'),
      t('ratio-proportion', 'Ratio and proportion'),
      t('algebra-basic', 'Simple algebra and sequences'),
      t('measures', 'Measures, time and money'),
      t('geometry', 'Shape, angles, area and perimeter', { memorise: 'formulae' }),
      t('data-handling', 'Statistics and data handling'),
      t('word-problems', 'Multi-step word problems'),
    ],
  },
  {
    id: '11plus-vr', title: '11+ Verbal Reasoning', stage: '11plus', boards: ['GL', 'CEM'],
    topics: [
      t('synonyms-antonyms', 'Synonyms and antonyms', { memorise: 'words' }),
      t('odd-one-out', 'Odd one out', { memorise: 'words' }),
      t('word-meanings', 'Word meanings and definitions', { memorise: 'words' }),
      t('hidden-words', 'Hidden and missing words', { memorise: 'words' }),
      t('anagrams', 'Anagrams and word shuffling', { memorise: 'words' }),
      t('analogies', 'Word analogies', { memorise: 'words' }),
      t('letter-codes', 'Letter codes and sequences'),
      t('number-codes', 'Number codes and letter-number logic'),
      t('logic-deduction', 'Logic and deduction'),
    ],
  },
  {
    id: '11plus-nvr', title: '11+ Non-Verbal Reasoning', stage: '11plus', boards: ['GL', 'CEM'],
    topics: [
      t('shape-sequences', 'Shape sequences and series'),
      t('odd-shape', 'Odd one out (shapes)'),
      t('analogies-shapes', 'Shape analogies'),
      t('rotation-reflection', 'Rotation and reflection'),
      t('nets-3d', 'Nets and 3D shapes'),
      t('matrices', 'Matrices and grids'),
      t('hidden-shapes', 'Hidden shapes and spatial reasoning'),
      t('codes-shapes', 'Shape codes'),
    ],
  },
  // ───── GCSE ─────
  {
    id: 'gcse-maths', title: 'GCSE Maths', stage: 'gcse', boards: ['AQA', 'Edexcel', 'OCR'],
    tiers: ['Foundation', 'Higher'],
    topics: [
      t('number', 'Number', { ao: ['AO1', 'AO2'] }),
      t('algebra', 'Algebra', { ao: ['AO1', 'AO2', 'AO3'], memorise: 'formulae' }),
      t('ratio-proportion-rates', 'Ratio, proportion and rates of change', { ao: ['AO1', 'AO2', 'AO3'] }),
      t('geometry-measures', 'Geometry and measures', { ao: ['AO1', 'AO2', 'AO3'], memorise: 'formulae' }),
      t('probability', 'Probability', { ao: ['AO1', 'AO2', 'AO3'] }),
      t('statistics', 'Statistics', { ao: ['AO1', 'AO2', 'AO3'] }),
    ],
  },
  {
    id: 'gcse-english-language', title: 'GCSE English Language', stage: 'gcse', boards: ['AQA', 'Edexcel', 'OCR'],
    topics: [
      t('reading-fiction', 'Reading: fiction extracts', { ao: ['AO1', 'AO2', 'AO4'] }),
      t('reading-nonfiction', 'Reading: non-fiction and comparison', { ao: ['AO1', 'AO2', 'AO3'] }),
      t('language-techniques', 'Language and structure techniques', { ao: ['AO2'], memorise: 'techniques' }),
      t('creative-writing', 'Descriptive and narrative writing', { ao: ['AO5', 'AO6'] }),
      t('transactional-writing', 'Transactional writing (letters, articles, speeches)', { ao: ['AO5', 'AO6'] }),
      t('spag-gcse', 'Spelling, punctuation and grammar accuracy', { ao: ['AO6'] }),
    ],
  },
  {
    id: 'gcse-science', title: 'GCSE Science (Combined / Triple)', stage: 'gcse', boards: ['AQA', 'Edexcel', 'OCR'],
    tiers: ['Foundation', 'Higher'],
    topics: [
      t('biology-cells', 'Biology: cell biology and organisation', { memorise: 'terms' }),
      t('biology-infection-bioenergetics', 'Biology: infection, response and bioenergetics', { memorise: 'terms' }),
      t('biology-inheritance-ecology', 'Biology: homeostasis, inheritance and ecology', { memorise: 'terms' }),
      t('chemistry-atomic-bonding', 'Chemistry: atomic structure, periodic table, bonding', { memorise: 'terms' }),
      t('chemistry-reactions', 'Chemistry: quantitative, chemical and energy changes', { memorise: 'formulae' }),
      t('chemistry-organic-earth', 'Chemistry: rates, organic, atmosphere and resources', { memorise: 'terms' }),
      t('physics-energy-electricity', 'Physics: energy, electricity and particle model', { memorise: 'formulae' }),
      t('physics-forces-waves', 'Physics: forces, waves and electromagnetism', { memorise: 'formulae' }),
      t('physics-atomic-space', 'Physics: atomic structure and space', { memorise: 'terms' }),
      t('working-scientifically', 'Working scientifically and required practicals', { ao: ['AO3'] }),
    ],
  },
  {
    id: 'gcse-history', title: 'GCSE History', stage: 'gcse', boards: ['AQA', 'Edexcel', 'OCR'],
    // Options differ per board; extend per chosen option. Skills are common to all boards.
    topics: [
      t('source-analysis', 'Source analysis and utility', { ao: ['AO3'] }),
      t('interpretations', 'Interpretations and historians', { ao: ['AO4'] }),
      t('extended-writing-history', 'Extended essays and analytical writing', { ao: ['AO1', 'AO2'] }),
      t('key-dates-terms', 'Key dates, people and terms', { memorise: 'dates' }),
    ],
  },
  {
    id: 'gcse-geography', title: 'GCSE Geography', stage: 'gcse', boards: ['AQA', 'Edexcel', 'OCR'],
    topics: [
      t('physical-geography', 'Physical: hazards, ecosystems, rivers, coasts', { memorise: 'terms' }),
      t('human-geography', 'Human: urban issues, development, resources', { memorise: 'terms' }),
      t('fieldwork-skills', 'Fieldwork and geographical skills', { ao: ['AO3', 'AO4'] }),
      t('case-studies', 'Case studies and key facts', { memorise: 'dates' }),
    ],
  },
]

export const subjectsFor = (stage: ExamStage) => SUBJECTS.filter((s) => s.stage === stage)
export const getSubject = (id: string) => SUBJECTS.find((s) => s.id === id)
