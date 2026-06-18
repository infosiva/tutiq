'use client'
import { useState, useEffect } from 'react'

const SUBJECTS = [
  { subject: 'Mathematics', topic: 'Quadratic Equations', level: 'GCSE', q: 'Solve: x² + 5x + 6 = 0', hint: 'Factor into (x+2)(x+3)' },
  { subject: 'English', topic: 'Shakespeare Analysis', level: 'A-Level', q: "Analyse Hamlet's soliloquy theme", hint: 'Focus on existential conflict' },
  { subject: 'Science', topic: "Newton's Laws", level: 'GCSE', q: "State Newton's Third Law", hint: 'Every action has equal reaction' },
  { subject: 'History', topic: 'World War II', level: 'GCSE', q: 'Why did Germany invade Poland in 1939?', hint: 'Consider the Molotov–Ribbentrop Pact' },
]

export default function HeroClient({ overrides: _ = {} }: { overrides?: unknown }) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setShowHint(false)
      setTimeout(() => { setIdx(i => (i + 1) % SUBJECTS.length); setVisible(true) }, 350)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  const s = SUBJECTS[idx]

  return (
    <div style={{ color: 'var(--foreground)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
          padding: '40px 0 32px',
        }}
        className="tutiq-hero-grid"
      >
        {/* Left */}
        <div>
          <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            🎓 AI Tutoring for UK Students
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: 'var(--foreground)' }}>
            Ace every subject.<br />
            <span style={{ color: 'var(--accent)' }}>Tutor in your pocket.</span>
          </h1>
          <p style={{ fontSize: 17, opacity: 0.65, lineHeight: 1.65, marginBottom: 32, maxWidth: 440 }}>
            GCSE to A-Level. Instant explanations, practice questions, and personalised study plans — free to start.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="/tutor" style={{
              background: 'var(--accent)', color: '#fff', padding: '14px 28px',
              borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block',
            }}>Ask a Question Free →</a>
            <a href="#subjects" style={{
              border: '1.5px solid rgba(2,132,199,0.3)', color: 'var(--accent)',
              padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15,
              textDecoration: 'none', display: 'inline-block',
            }}>Browse Subjects</a>
          </div>
          <p style={{ fontSize: 12, opacity: 0.4, marginTop: 12 }}>
            Have a promo code? <a href="#promo" style={{ textDecoration: 'underline' }}>Apply here</a>
          </p>
        </div>

        {/* Right — animated tutor card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: '#fff', border: '1px solid rgba(2,132,199,0.15)',
            borderRadius: 20, padding: 28, width: '100%', maxWidth: 420,
            boxShadow: '0 8px 40px rgba(2,132,199,0.08)',
            transition: 'opacity 0.35s cubic-bezier(0.23,1,0.32,1), transform 0.35s cubic-bezier(0.23,1,0.32,1)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ background: 'rgba(2,132,199,0.1)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {s.subject}
              </span>
              <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {s.level}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>{s.topic}</p>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: 20 }}>{s.q}</p>
            <button
              onClick={() => setShowHint(h => !h)}
              style={{
                width: '100%', padding: '10px', borderRadius: 8,
                border: '1.5px solid rgba(2,132,199,0.25)',
                background: showHint ? 'rgba(2,132,199,0.06)' : 'transparent',
                color: 'var(--accent)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              {showHint ? '💡 ' + s.hint : 'Show Hint →'}
            </button>
            <div style={{ marginTop: 16, padding: '12px', background: '#f8fafc', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span style={{ fontSize: 13, color: '#475569' }}>AI tutor ready to explain step-by-step...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ borderTop: '1px solid rgba(2,132,199,0.1)', paddingTop: 24, paddingBottom: 8 }}>
        <div style={{ display: 'flex', gap: 48, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {([['All', 'GCSE Subjects'], ['A-Level', 'Support'], ['Instant', 'Explanations'], ['Free', 'No card needed']] as [string, string][]).map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)' }}>{v}</div>
              <div style={{ fontSize: 12, opacity: 0.55 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tutiq-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tutiq-hero-grid * { transition: none !important; }
        }
      `}</style>
    </div>
  )
}
