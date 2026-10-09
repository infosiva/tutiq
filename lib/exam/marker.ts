// MCQ: exact. Short: per-mark-scheme-point yes/no by the LLM at temperature 0. Extended: PROPOSED marks only,
// flagged unverified until step 7 calibration against hand-marked answers shows agreement.
import type { Item } from './generator'
import { examLlm } from './llm'
import { moderate } from './moderate'

export interface Marked { awarded: number; of: number; hits: boolean[]; proposed: boolean; feedback: string }

export async function markItem(item: Item, response: string): Promise<Marked> {
  const answer = response.trim().slice(0, 2000)
  if (item.type === 'mcq') {
    const ok = answer.toUpperCase().charAt(0) === item.answer.trim().toUpperCase()
    return { awarded: ok ? item.marks : 0, of: item.marks, hits: [ok], proposed: false, feedback: ok ? 'Correct' : `Correct answer: ${item.answer}` }
  }
  if (!answer || !moderate(answer).ok) return { awarded: 0, of: item.marks, hits: item.markScheme.map(() => false), proposed: true, feedback: 'No creditable answer' }
  const { text } = await examLlm('mark',
    'You mark a child\'s answer against a mark scheme. Credit only what the answer states. Reply ONLY JSON: {"hits":[true|false per mark point, same order],"feedback":"one short sentence"}.',
    JSON.stringify({ question: item.stem, markScheme: item.markScheme, answer }), 300)
  const m = text.match(/\{[\s\S]*\}/)
  let hits: boolean[] = item.markScheme.map(() => false), feedback = 'Could not mark automatically'
  try {
    const o = JSON.parse(m?.[0] ?? '{}')
    if (Array.isArray(o.hits) && o.hits.length === item.markScheme.length) { hits = o.hits.map(Boolean); feedback = String(o.feedback ?? '').slice(0, 200) }
  } catch { /* keep zero + message: never invent marks */ }
  return { awarded: hits.filter(Boolean).length, of: item.marks, hits, proposed: item.type === 'extended', feedback }
}
