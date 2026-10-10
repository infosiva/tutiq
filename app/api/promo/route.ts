import { validatePromoCode } from '@/lib/promoCode'
import { sign } from '@/lib/access'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest, NextResponse } from 'next/server'

const limiter = rateLimit({ windowMs: 60_000, max: 8, message: 'Too many code attempts — wait a minute.' })

export async function POST(req: NextRequest) {
  const limited = limiter.check(req)
  if (limited) return limited
  const { code } = await req.json().catch(() => ({}))
  if (!code) return NextResponse.json({ valid: false }, { status: 400 })
  const entry = validatePromoCode(code)
  if (!entry) return NextResponse.json({ valid: false, message: 'Invalid code' })
  const res = NextResponse.json({ valid: true, daysUnlocked: entry.daysUnlocked, feature: entry.feature })
  res.cookies.set('tq_promo', sign({ exp: Date.now() + entry.daysUnlocked * 86400_000 }), {
    maxAge: entry.daysUnlocked * 86400, httpOnly: true, sameSite: 'lax', path: '/',
  })
  return res
}
