// Quiz scopes after teaching: topic check -> "so far" review -> full mock paper. Plan only; items come from generateItem.
import { BLUEPRINTS, type Blueprint, type QType } from './blueprints'

export interface Slot { blueprintId: string; sectionIndex: number; topic: string; slot: string; type: QType }
export type Scope = 'topic' | 'sofar' | 'mock'

const sections = (bp: Blueprint) => bp.sections.flatMap((s, i) => s.topics.map(t => ({ i, t, type: s.type })))

/** topic: 5 slots on one topic. sofar: 10 slots interleaved across covered topics. mock: the blueprint's own section counts. */
export function planQuiz(scope: Scope, blueprintId: string, topics: string[] = []): Slot[] {
  const bp = BLUEPRINTS.find(b => b.id === blueprintId)
  if (!bp) return []
  const mk = (i: number, topic: string, type: QType, n: number): Slot => ({ blueprintId, sectionIndex: i, topic, slot: `${scope}${n}`, type })
  if (scope === 'mock') return bp.sections.flatMap((s, i) => Array.from({ length: s.count }, (_, n) => mk(i, s.topics[n % s.topics.length], s.type, n)))
  const pool = sections(bp).filter(x => topics.includes(x.t))
  if (!pool.length) return []
  const n = scope === 'topic' ? 5 : 10
  return Array.from({ length: n }, (_, k) => { const p = pool[k % pool.length]; return mk(p.i, p.t, p.type, k) })
}

export function quizPlanDemo() {
  const bp = BLUEPRINTS[0]
  console.assert(planQuiz('mock', bp.id).length === bp.sections.reduce((a, s) => a + s.count, 0), 'mock = blueprint count')
  const t = bp.sections[0].topics[0]
  console.assert(planQuiz('topic', bp.id, [t]).length === 5, 'topic quiz 5')
  console.assert(planQuiz('sofar', bp.id, [t]).length === 10, 'sofar 10')
  console.assert(planQuiz('topic', 'nope').length === 0, 'unknown blueprint')
}
