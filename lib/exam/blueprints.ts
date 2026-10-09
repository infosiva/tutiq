// Paper blueprints: editable config. Generator reads these; nothing else hardcodes paper shape.
// UNVERIFIED formats (see HANDOFF.md): check each against the board's own page before release.
// Set `verified: true` only after that check.

export type QType = 'mcq' | 'short' | 'extended'

export interface Section {
  /** Subject topic ids from lib/curriculum.ts (section draws questions from these) */
  topics: string[]
  type: QType
  count: number
  marksEach: number
  /** 1 easy .. 3 hard */
  difficulty?: 1 | 2 | 3
}

export interface Blueprint {
  id: string
  subjectId: string
  board: string
  tier?: string
  title: string
  minutes: number
  calculator?: boolean
  sections: Section[]
  verified: boolean
}

const mcq = (topics: string[], count: number, difficulty: 1 | 2 | 3 = 2): Section => ({
  topics, type: 'mcq', count, marksEach: 1, difficulty,
})

export const BLUEPRINTS: Blueprint[] = [
  // ───── 11+ GL: separate multiple-choice papers ─────
  {
    id: 'gl-vr', subjectId: '11plus-vr', board: 'GL', title: 'GL Verbal Reasoning', minutes: 50, verified: false,
    sections: [mcq(['synonyms-antonyms', 'odd-one-out', 'word-meanings', 'hidden-words', 'anagrams', 'analogies', 'letter-codes', 'number-codes', 'logic-deduction'], 50)],
  },
  {
    id: 'gl-nvr', subjectId: '11plus-nvr', board: 'GL', title: 'GL Non-Verbal Reasoning', minutes: 40, verified: false,
    sections: [mcq(['shape-sequences', 'odd-shape', 'analogies-shapes', 'rotation-reflection', 'nets-3d', 'matrices', 'hidden-shapes', 'codes-shapes'], 40)],
  },
  {
    id: 'gl-maths', subjectId: '11plus-maths', board: 'GL', title: 'GL Maths', minutes: 50, verified: false,
    sections: [mcq(['number-place-value', 'four-operations', 'fractions-decimals-percentages', 'ratio-proportion', 'algebra-basic', 'measures', 'geometry', 'data-handling', 'word-problems'], 50)],
  },
  {
    id: 'gl-english', subjectId: '11plus-english', board: 'GL', title: 'GL English', minutes: 50, verified: false,
    sections: [mcq(['comprehension', 'vocab-in-context', 'spag', 'word-classes', 'cloze', 'spelling-patterns'], 40)],
  },
  // ───── 11+ CEM: mixed question types per timed section ─────
  {
    id: 'cem-verbal', subjectId: '11plus-vr', board: 'CEM', title: 'CEM Verbal (mixed sections)', minutes: 45, verified: false,
    sections: [
      mcq(['synonyms-antonyms', 'word-meanings'], 15),
      mcq(['odd-one-out', 'hidden-words', 'anagrams', 'analogies'], 15),
      mcq(['letter-codes', 'number-codes', 'logic-deduction'], 10),
    ],
  },
  {
    id: 'cem-nonverbal', subjectId: '11plus-nvr', board: 'CEM', title: 'CEM Non-Verbal (mixed sections)', minutes: 30, verified: false,
    sections: [
      mcq(['shape-sequences', 'odd-shape', 'matrices'], 12),
      mcq(['rotation-reflection', 'nets-3d', 'hidden-shapes', 'codes-shapes'], 12),
    ],
  },
  {
    id: 'cem-maths', subjectId: '11plus-maths', board: 'CEM', title: 'CEM Maths (mixed sections)', minutes: 45, verified: false,
    sections: [
      mcq(['number-place-value', 'four-operations', 'fractions-decimals-percentages'], 20),
      { topics: ['ratio-proportion', 'algebra-basic', 'measures', 'geometry', 'data-handling', 'word-problems'], type: 'short', count: 10, marksEach: 2, difficulty: 2 },
    ],
  },
  // ───── GCSE Maths: 3 papers (1 non-calc, 2 calc) ─────
  ...(['AQA', 'Edexcel', 'OCR'] as const).flatMap((board) =>
    (['Foundation', 'Higher'] as const).flatMap((tier) =>
      [1, 2, 3].map<Blueprint>((p) => ({
        id: `gcse-maths-${board.toLowerCase()}-${tier.toLowerCase()}-p${p}`,
        subjectId: 'gcse-maths', board, tier,
        title: `GCSE Maths ${board} ${tier} Paper ${p}`,
        minutes: 90, calculator: p !== 1, verified: false,
        sections: [
          { topics: ['number', 'algebra', 'ratio-proportion-rates', 'geometry-measures', 'probability', 'statistics'], type: 'short', count: 25, marksEach: 2, difficulty: tier === 'Higher' ? 3 : 2 },
          { topics: ['algebra', 'ratio-proportion-rates', 'geometry-measures'], type: 'extended', count: 5, marksEach: 6, difficulty: tier === 'Higher' ? 3 : 2 },
        ],
      })),
    ),
  ),
  // ───── Other GCSE subjects: generic board-agnostic shape until each spec is checked ─────
  {
    id: 'gcse-english-language-p1', subjectId: 'gcse-english-language', board: 'AQA', title: 'GCSE English Language Paper 1 (style)', minutes: 105, verified: false,
    sections: [
      { topics: ['reading-fiction', 'language-techniques'], type: 'short', count: 4, marksEach: 4, difficulty: 2 },
      { topics: ['reading-fiction'], type: 'extended', count: 1, marksEach: 8, difficulty: 2 },
      { topics: ['creative-writing'], type: 'extended', count: 1, marksEach: 40, difficulty: 2 },
    ],
  },
  {
    id: 'gcse-science-combined', subjectId: 'gcse-science', board: 'AQA', tier: 'Higher', title: 'GCSE Science paper (style)', minutes: 75, verified: false,
    sections: [
      mcq(['biology-cells', 'chemistry-atomic-bonding', 'physics-energy-electricity'], 6),
      { topics: ['biology-infection-bioenergetics', 'chemistry-reactions', 'physics-forces-waves', 'working-scientifically'], type: 'short', count: 12, marksEach: 3, difficulty: 2 },
      { topics: ['biology-inheritance-ecology', 'chemistry-organic-earth', 'physics-atomic-space'], type: 'extended', count: 2, marksEach: 6, difficulty: 3 },
    ],
  },
  {
    id: 'gcse-history-skills', subjectId: 'gcse-history', board: 'AQA', title: 'GCSE History skills paper (style)', minutes: 105, verified: false,
    sections: [
      { topics: ['source-analysis'], type: 'short', count: 3, marksEach: 8, difficulty: 2 },
      { topics: ['interpretations'], type: 'extended', count: 1, marksEach: 16, difficulty: 3 },
      { topics: ['extended-writing-history'], type: 'extended', count: 1, marksEach: 16, difficulty: 3 },
    ],
  },
  {
    id: 'gcse-geography-skills', subjectId: 'gcse-geography', board: 'AQA', title: 'GCSE Geography paper (style)', minutes: 90, verified: false,
    sections: [
      mcq(['physical-geography', 'human-geography'], 8),
      { topics: ['physical-geography', 'human-geography', 'fieldwork-skills'], type: 'short', count: 8, marksEach: 4, difficulty: 2 },
      { topics: ['case-studies'], type: 'extended', count: 2, marksEach: 9, difficulty: 3 },
    ],
  },
]

export const blueprintsFor = (subjectId: string) => BLUEPRINTS.filter((b) => b.subjectId === subjectId)
export const getBlueprint = (id: string) => BLUEPRINTS.find((b) => b.id === id)
export const totalMarks = (b: Blueprint) => b.sections.reduce((n, s) => n + s.count * s.marksEach, 0)
