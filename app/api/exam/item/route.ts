import { guarded } from "@/lib/access"
import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'
import { BLUEPRINTS } from '@/lib/exam/blueprints'
import { generateItem } from '@/lib/exam/generator'
import { sealItem } from '@/lib/exam/ticket'

export const dynamic = 'force-dynamic'

// POST {blueprintId, sectionIndex, topic, slot} -> one validated question (answer withheld; marking is server-side).
async function handler(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited
  const b = await req.json().catch(() => null) as { blueprintId?: string; sectionIndex?: number; topic?: string; slot?: string } | null
  const bp = BLUEPRINTS.find(x => x.id === b?.blueprintId)
  const section = bp?.sections[b?.sectionIndex ?? -1]
  if (!bp || !section || !b?.topic || !section.topics.includes(b.topic)) {
    return NextResponse.json({ error: 'invalid blueprint/section/topic' }, { status: 400 })
  }
  const item = await generateItem(section, b.topic, String(b.slot ?? '0').slice(0, 16))
  if (!item) return NextResponse.json({ error: 'could not build a valid question, try again' }, { status: 503 })
  const { answer: _a, markScheme: _m, ...pub } = item
  return NextResponse.json({ item: pub, ticket: sealItem(item) })
}

export const POST = guarded(handler)
