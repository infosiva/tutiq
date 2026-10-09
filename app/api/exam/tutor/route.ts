import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'
import { examLlm } from '@/lib/exam/llm'
import { moderate } from '@/lib/exam/moderate'
import { isTone, tutorSystem } from '@/lib/exam/tutor'

export const dynamic = 'force-dynamic'

// POST {tone, age, topic, message} -> {reply}. Guarded tutor; learner text moderated, only verdicts logged.
export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited
  const b = await req.json().catch(() => null) as { tone?: string; age?: string; topic?: string; message?: string } | null
  if (!b?.message || !isTone(b.tone)) return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  const v = moderate(b.message, 600)
  if (!v.ok) return NextResponse.json({ error: v.reason }, { status: 400 })
  const age = String(b.age ?? '11').replace(/[^0-9]/g, '').slice(0, 2) || '11'
  const topic = String(b.topic ?? '').slice(0, 80)
  const { text } = await examLlm('generate', tutorSystem(b.tone, age), `Topic: ${topic}\nLearner: ${b.message}`, 400)
  if (!moderate(text).ok) return NextResponse.json({ error: 'could not answer, try again' }, { status: 503 })
  return NextResponse.json({ reply: text })
}
