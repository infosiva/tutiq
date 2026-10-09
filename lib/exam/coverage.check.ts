// Coverage matrix: every curriculum topic must appear in a blueprint (questions); memorise topics flagged. Run: npx tsx lib/exam/coverage.check.ts
import { SUBJECTS } from '../curriculum'
import { BLUEPRINTS } from './blueprints'

const used = new Set(BLUEPRINTS.flatMap(b => b.sections.flatMap(s => s.topics.map(t => `${b.subjectId}/${t}`))))
// Lesson/memorise-only by design: writing + dated-fact topics are not auto-marked until step 7 calibration.
const LESSON_ONLY = new Set(['gcse-english-language/reading-nonfiction', 'gcse-english-language/transactional-writing', 'gcse-english-language/spag-gcse', 'gcse-history/key-dates-terms'])
let gaps = 0
for (const s of SUBJECTS) for (const t of s.topics) {
  const q = used.has(`${s.id}/${t.id}`)
  if (!q && !LESSON_ONLY.has(`${s.id}/${t.id}`)) { gaps++; console.log(`NO QUESTIONS: ${s.id}/${t.id}`) }
}
console.log(`topics without questions: ${gaps}; memorise topics: ${SUBJECTS.flatMap(s => s.topics).filter(t => t.memorise).length}`)
process.exit(gaps ? 1 : 0)
