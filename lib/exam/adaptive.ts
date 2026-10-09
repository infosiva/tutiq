// No-LLM scheduling: FSRS (ts-fsrs) for memorise cards, Elo-style ability per topic for the next-question picker.
import { fsrs, createEmptyCard, Rating, type Card as FsrsCard } from 'ts-fsrs'
const sched = fsrs() // ponytail: default params; optimise per cohort once >1000 reviews

export interface Card { id: string; f: FsrsCard }
export const newCard = (id: string, now = new Date()): Card => ({ id, f: createEmptyCard(now) })

// correct -> Good, wrong -> Again. Binary because a child taps right/wrong; add Hard/Easy in UI later.
export function review(card: Card, correct: boolean, now = new Date()): Card {
  return { ...card, f: sched.next(card.f, now, correct ? Rating.Good : Rating.Again).card }
}

export const dueCards = (cards: Card[], now = new Date()) =>
  cards.filter(c => c.f.due <= now).sort((a, b) => +a.f.due - +b.f.due)

export type Ability = Record<string, number> // topic -> rating, start 1000

export function updateAbility(a: Ability, topic: string, difficulty: 1 | 2 | 3, correct: boolean, k = 32): Ability {
  const r = a[topic] ?? 1000
  const itemR = 800 + difficulty * 200
  const expected = 1 / (1 + 10 ** ((itemR - r) / 400))
  return { ...a, [topic]: Math.round(r + k * ((correct ? 1 : 0) - expected)) }
}

// Pick the weakest topic; difficulty matched to rating so the learner succeeds ~70% of the time.
export function nextQuestion(a: Ability, topics: string[]): { topic: string; difficulty: 1 | 2 | 3 } {
  const topic = [...topics].sort((x, y) => (a[x] ?? 1000) - (a[y] ?? 1000))[0]
  const r = a[topic] ?? 1000
  return { topic, difficulty: r < 1000 ? 1 : r < 1150 ? 2 : 3 }
}

export function adaptiveDemo() {
  const t0 = new Date('2026-01-01')
  let c = newCard('x', t0)
  console.assert(dueCards([c], t0).length === 1, 'new card due')
  c = review(c, true, t0); console.assert(c.f.due > t0 && dueCards([c], t0).length === 0, 'good defers')
  const d = review(newCard('y', t0), false, t0); console.assert(d.f.due <= c.f.due, 'again sooner than good')
  let a: Ability = {}
  a = updateAbility(a, 't', 2, true); console.assert(a.t > 1000, 'win raises')
  a = updateAbility(a, 'u', 2, false); console.assert(a.u < 1000, 'loss lowers')
  console.assert(nextQuestion({ t: 1100, u: 900 }, ['t', 'u']).topic === 'u', 'weakest first')
}
