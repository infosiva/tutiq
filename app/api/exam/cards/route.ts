import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'
import { generateCards } from '@/lib/exam/cards'

export const dynamic = 'force-dynamic'

// POST {subjectId, topicId} -> validated memorise cards (fail closed: 503, never unchecked facts).
export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited
  const b = await req.json().catch(() => null) as { subjectId?: string; topicId?: string } | null
  if (!b?.subjectId || !b.topicId) return NextResponse.json({ error: 'subjectId and topicId required' }, { status: 400 })
  const cards = await generateCards(b.subjectId, b.topicId)
  if (!cards) return NextResponse.json({ error: 'no memorise cards for this topic or generation failed' }, { status: 503 })
  return NextResponse.json({ cards })
}
