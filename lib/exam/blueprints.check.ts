// Self-check: every blueprint topic exists in the curriculum, ids are unique, marks > 0.
// Run: npx tsx lib/exam/blueprints.check.ts
import { BLUEPRINTS, totalMarks } from './blueprints'
import { getSubject } from '../curriculum'

const seen = new Set<string>()
const errs: string[] = []
for (const b of BLUEPRINTS) {
  if (seen.has(b.id)) errs.push(`dup id ${b.id}`)
  seen.add(b.id)
  const s = getSubject(b.subjectId)
  if (!s) { errs.push(`${b.id}: unknown subject ${b.subjectId}`); continue }
  if (!s.boards.includes(b.board)) errs.push(`${b.id}: board ${b.board} not in subject`)
  if (b.tier && !s.tiers?.includes(b.tier)) errs.push(`${b.id}: tier ${b.tier} not in subject`)
  const ids = new Set(s.topics.map((t) => t.id))
  for (const sec of b.sections) for (const t of sec.topics) if (!ids.has(t)) errs.push(`${b.id}: unknown topic ${t}`)
  if (totalMarks(b) <= 0) errs.push(`${b.id}: zero marks`)
}
if (errs.length) { console.error(errs.join('\n')); process.exit(1) }
console.log(`ok: ${BLUEPRINTS.length} blueprints`)
