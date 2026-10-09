// Blueprint section -> one validated question. Plain pipeline: generate -> validate -> (repair once) -> store.
import type { Section } from './blueprints'
import { examLlm } from './llm'
import { moderate } from './moderate'

export interface Item {
  id: string
  type: Section['type']
  topic: string
  ao: string
  marks: number
  stem: string
  options?: string[] // mcq only
  answer: string // mcq: option letter A-E; short/extended: model answer
  markScheme: string[] // one point per mark
  difficulty: 1 | 2 | 3
}

const SYS = `You write ORIGINAL UK exam questions for children and teenagers. Never copy real past papers.
Reply with ONE JSON object only: {"stem","options"?,"answer","markScheme":[],"ao"}.
mcq: 4-5 options as plain strings, answer = letter. short/extended: answer = model answer, markScheme = one line per mark.`

function parse(text: string): Omit<Item, 'id' | 'type' | 'topic' | 'marks' | 'difficulty'> | null {
  const m = text.match(/\{[\s\S]*\}/)
  if (!m) return null
  try {
    const o = JSON.parse(m[0])
    if (typeof o.stem !== 'string' || typeof o.answer !== 'string' || !Array.isArray(o.markScheme)) return null
    return { stem: o.stem, options: Array.isArray(o.options) ? o.options.map(String) : undefined, answer: o.answer, markScheme: o.markScheme.map(String), ao: String(o.ao ?? 'AO1') }
  } catch { return null }
}

function shapeOk(type: Item['type'], marks: number, r: NonNullable<ReturnType<typeof parse>>): boolean {
  if (type === 'mcq') return !!r.options && r.options.length >= 4 && r.options.length <= 5 && /^[A-E]$/.test(r.answer.trim())
  return r.markScheme.length === marks
}

// Independent check by a different model: does the stated answer actually solve the stem?
async function validate(r: NonNullable<ReturnType<typeof parse>>): Promise<boolean> {
  const { text } = await examLlm('validate', 'You check exam questions. Reply exactly PASS or FAIL: PASS only if the stem is unambiguous, solvable, and the stated answer is correct.', JSON.stringify(r), 8)
  return /^\s*PASS/i.test(text)
}

const cache = new Map<string, Item>() // ponytail: in-memory until step 8 persistence; key = blueprint row + slot

export async function generateItem(section: Section, topic: string, slot: string, diff: 1 | 2 | 3 = section.difficulty ?? 2): Promise<Item | null> {
  const key = `${topic}|${section.type}|${section.marksEach}|${diff}|${slot}`
  const hit = cache.get(key)
  if (hit) return hit
  for (let attempt = 0; attempt < 2; attempt++) {
    const { text } = await examLlm(attempt ? 'repair' : 'generate', SYS,
      `Topic: ${topic}\nType: ${section.type}\nMarks: ${section.marksEach}\nDifficulty: ${diff}/3\nSlot: ${slot}`, 700)
    if (!moderate(text).ok) continue
    const r = parse(text)
    if (!r || !shapeOk(section.type, section.marksEach, r) || !(await validate(r))) continue
    const item: Item = { id: key, type: section.type, topic, marks: section.marksEach, difficulty: diff, ...r }
    cache.set(key, item)
    return item
  }
  return null // caller shows "couldn't build this question", never a wrong one
}

export const getItem = (id: string): Item | undefined => cache.get(id)
