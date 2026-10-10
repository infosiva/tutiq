import { NextRequest, NextResponse } from 'next/server'
import { getAccess, GUEST_DAILY_CAP } from '@/lib/access'

export async function GET(req: NextRequest) {
  const { tier, left } = getAccess(req)
  return NextResponse.json({ tier, left: Number.isFinite(left) ? left : null, cap: GUEST_DAILY_CAP })
}
