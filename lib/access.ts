// 3-tier access, server-side: 'full' (valid signed promo cookie), 'paid' (signed plan cookie), 'guest' (capped), 'none' (cap used up).
// Cookies are HMAC-signed with ACCESS_SECRET; the guest cap is per signed cookie AND per IP/day.
import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export type Access = 'full' | 'paid' | 'guest' | 'none'
export const GUEST_DAILY_CAP = 5
const secret = () => process.env.ACCESS_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-secret')
const sig = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url')

export function sign(payload: object): string {
  const v = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${v}.${sig(v)}`
}
export function verify<T>(tok?: string): T | null {
  if (!tok || !secret()) return null
  const [v, s] = tok.split('.')
  if (!v || !s) return null
  const a = Buffer.from(sig(v)), b = Buffer.from(s)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try { return JSON.parse(Buffer.from(v, 'base64url').toString()) as T } catch { return null }
}

const ipHits = new Map<string, { day: string; n: number }>()
const today = () => new Date().toISOString().slice(0, 10)
const ipOf = (req: NextRequest) => req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'

export function getAccess(req: NextRequest): { tier: Access; left: number } {
  const promo = verify<{ exp: number }>(req.cookies.get('tq_promo')?.value)
  if (promo && promo.exp > Date.now()) return { tier: 'full', left: Infinity }
  const plan = verify<{ exp: number }>(req.cookies.get('tq_plan')?.value)
  if (plan && plan.exp > Date.now()) return { tier: 'paid', left: Infinity }
  const g = verify<{ day: string; n: number }>(req.cookies.get('tq_guest')?.value)
  const cookieN = g && g.day === today() ? g.n : 0
  const ip = ipHits.get(ipOf(req))
  const ipN = ip && ip.day === today() ? ip.n : 0
  const left = Math.max(0, GUEST_DAILY_CAP - Math.max(cookieN, ipN))
  return { tier: left > 0 ? 'guest' : 'none', left }
}

/** Gate for AI routes: returns a 402 response when blocked, else counts a guest use and returns {res:null, apply}. */
export function gate(req: NextRequest): { res: NextResponse | null; apply: (r: NextResponse) => NextResponse } {
  const { tier, left } = getAccess(req)
  if (tier === 'full' || tier === 'paid') return { res: null, apply: r => r }
  if (tier === 'none') {
    return { res: NextResponse.json({ error: 'guest_cap', message: 'Free taste used up for today. Enter a code or sign in.', left: 0 }, { status: 402 }), apply: r => r }
  }
  const n = GUEST_DAILY_CAP - left + 1
  ipHits.set(ipOf(req), { day: today(), n })
  return {
    res: null,
    apply: r => { r.cookies.set('tq_guest', sign({ day: today(), n }), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 86400 }); r.headers.set('x-guest-left', String(GUEST_DAILY_CAP - n)); return r },
  }
}

type Handler = (req: NextRequest) => Promise<NextResponse | Response>
/** Wrap a POST handler. mode 'taste' = guests get a capped daily taste; 'members' = full/paid only (guests get 401). */
export function guarded(handler: Handler, mode: 'taste' | 'members' = 'taste'): Handler {
  return async req => {
    if (mode === 'members') {
      const { tier } = getAccess(req)
      if (tier !== 'full' && tier !== 'paid') {
        return NextResponse.json({ error: 'members_only', message: 'Sign in and pick a plan, or enter a code, to use this.' }, { status: 401 })
      }
      return handler(req)
    }
    const g = gate(req)
    if (g.res) return g.res
    const r = await handler(req)
    return r instanceof NextResponse && r.status < 400 ? g.apply(r) : r
  }
}
