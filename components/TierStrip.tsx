// Honest 3-tier ladder: Guest / Code or free account / Paid plan. Sets its own background (AA contrast).
export interface Tier { name: string; price: string; items: { text: string; locked?: boolean }[] }

export function TierStrip({ tiers, accent = '#0369a1' }: { tiers: Tier[]; accent?: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3" style={{ background: '#fff', color: '#0f172a', padding: 12, borderRadius: 16, listStyle: 'none' }}>
      {tiers.map(t => (
        <li key={t.name} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 700, color: accent }}>{t.name} <span style={{ color: '#475569', fontWeight: 500 }}>{t.price}</span></div>
          <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', fontSize: 14, color: '#334155' }}>
            {t.items.map(i => <li key={i.text}>{i.locked ? '🔒 ' : '✓ '}{i.text}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  )
}
