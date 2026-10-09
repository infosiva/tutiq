import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'
import { openItem } from '@/lib/exam/ticket'
import { markItem } from '@/lib/exam/marker'

export const dynamic = 'force-dynamic'

// POST {ticket, response} -> marks. Ticket is the sealed item issued by /api/exam/item.
export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited
  const b = await req.json().catch(() => null) as { ticket?: string; response?: string } | null
  const item = b?.ticket ? openItem(b.ticket) : null
  if (!item || typeof b?.response !== 'string') return NextResponse.json({ error: 'invalid ticket or missing response' }, { status: 400 })
  return NextResponse.json({ result: await markItem(item, b.response) })
}
