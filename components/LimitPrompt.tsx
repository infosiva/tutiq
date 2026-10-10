// Shown when a guest hits the cap. Contextual upsell: what's left, then code / sign-in / plan. No surprise paywall.
import type { CSSProperties } from 'react'

export interface LimitPromptProps {
  used: number
  cap: number
  accent: string
  signInHref: string
  planHref: string
  onEnterCode?: () => void
}

const btn = (bg: string, fg: string, border = 'transparent'): CSSProperties => ({ minHeight: 44, padding: '0 16px', borderRadius: 12, background: bg, color: fg, border: `1px solid ${border}`, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' })

export function LimitPrompt({ used, cap, accent, signInHref, planHref, onEnterCode }: LimitPromptProps) {
  const left = Math.max(0, cap - used)
  return (
    <div role="status" style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16 }}>
      <p style={{ margin: 0, fontWeight: 700 }}>{left > 0 ? `${left} free ${left === 1 ? 'try' : 'tries'} left today` : `You've used today's ${cap} free tries`}</p>
      <p style={{ margin: '4px 0 12px', color: '#475569', fontSize: 14 }}>Have a trial code? Enter it for full access. Or sign in to save progress, then pick a plan for everything.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {onEnterCode && <button type="button" onClick={onEnterCode} style={btn('#fff', '#0f172a', '#cbd5e1')}>Enter code</button>}
        <a href={signInHref} style={btn(accent, '#fff')}>Sign in</a>
        <a href={planHref} style={btn('#fff', '#0f172a', '#cbd5e1')}>See plans</a>
      </div>
    </div>
  )
}
