'use client'
// Intercepts 402 (guest cap) / 401 (members only) from our own /api calls and shows the upsell once, at the moment of limit.
import { useEffect, useState } from 'react'
import { LimitPrompt } from '@/components/LimitPrompt'

export default function AccessWatcher() {
  const [state, setState] = useState<null | 'cap' | 'members'>(null)
  useEffect(() => {
    const orig = window.fetch
    window.fetch = async (...a) => {
      const r = await orig(...a)
      const url = typeof a[0] === 'string' ? a[0] : a[0] instanceof Request ? a[0].url : String(a[0])
      if (url.includes('/api/') && !url.includes('/api/access') && !url.includes('/api/promo')) {
        if (r.status === 402) setState('cap'); else if (r.status === 401) setState('members')
      }
      return r
    }
    return () => { window.fetch = orig }
  }, [])
  if (!state) return null
  return (
    <div style={{ position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 60, maxWidth: 520, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 12px 40px rgba(15,23,42,.25)' }}>
      <LimitPrompt used={state === 'cap' ? 5 : 0} cap={5} accent="#0369a1" signInHref="/onboard" planHref="/pricing" />
      <button type="button" onClick={() => setState(null)} style={{ minHeight: 44, width: '100%', background: '#fff', color: '#334155', border: 0, borderTop: '1px solid #e2e8f0', borderRadius: '0 0 16px 16px', cursor: 'pointer' }}>Close</button>
    </div>
  )
}
