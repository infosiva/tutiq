// Memorise cards: topic -> validated {front, back} pairs. Retrieval-practice format (front is a prompt, back is the answer).
import { examLlm } from './llm'
import { moderate } from './moderate'
import { getSubject } from '../curriculum'

export interface CardSpec { front: string; back: string }

const SYS = `You write ORIGINAL UK exam-prep flashcards for children. Reply with ONE JSON array only: [{"front","back"}].
front = a short question or prompt that forces recall (never "define X" with X in the answer); back = the answer, max 20 words.`

export function parseCards(text: string): CardSpec[] {
  const m = text.match(/\[[\s\S]*\]/)
  if (!m) return []
  try {
    return (JSON.parse(m[0]) as unknown[]).flatMap(o => {
      const c = o as Partial<CardSpec>
      return typeof c.front === 'string' && typeof c.back === 'string' && c.front.trim() && c.back.trim() && c.back.split(/\s+/).length <= 20
        ? [{ front: c.front.trim(), back: c.back.trim() }] : []
    })
  } catch { return [] }
}

export async function generateCards(subjectId: string, topicId: string, n = 8): Promise<CardSpec[] | null> {
  const topic = getSubject(subjectId)?.topics.find(t => t.id === topicId)
  if (!topic?.memorise) return null
  const { text } = await examLlm('generate', SYS, `Topic: ${topic.title}\nKind: ${topic.memorise}\nCount: ${Math.min(n, 12)}`, 900)
  if (!moderate(text).ok) return null
  const cards = parseCards(text)
  if (!cards.length) return null
  // independent check: drop the whole set if any card is wrong rather than ship a wrong fact
  const v = await examLlm('validate', 'Check flashcards. Reply exactly PASS only if every back is factually correct for its front; else FAIL.', JSON.stringify(cards), 8)
  return /^\s*PASS/i.test(v.text) ? cards : null
}

export function cardsDemo() {
  console.assert(parseCards('x [{"front":"2+2?","back":"4"}] y').length === 1, 'parses')
  console.assert(parseCards('[{"front":"a","back":"' + 'w '.repeat(25) + '"}]').length === 0, 'long back dropped')
  console.assert(parseCards('nope').length === 0, 'garbage -> empty')
}
