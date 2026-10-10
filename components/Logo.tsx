// TutIQ logo: glyph + wordmark, key word in the hub-switchable accent.
export default function Logo({ size = 28, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, letterSpacing: '-0.02em' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="color-mix(in oklab, var(--accent, #0369a1) 18%, #f0f9ff)" />
        <g fill="none" stroke="var(--accent, #0369a1)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 9c-2-1.5-5-2-8-1.5V22c3-.4 6 .3 8 2M16 9c2-1.5 5-2 8-1.5V22c-3-.4-6 .3-8 2M16 9v15"/></g>
      </svg>
      <span>Tut<span style={{ color: dark ? 'color-mix(in oklab, var(--accent, #0369a1) 40%, white)' : 'var(--accent, #0369a1)' }}>IQ</span></span>
    </span>
  )
}
