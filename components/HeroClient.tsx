'use client'
import { useState, useEffect, useRef } from 'react'

// Real tutoring exchanges — the chat IS the demo, not a bolted-on widget.
// Each exchange: a real student question + the actual explanation Tutiq gives.
const EXCHANGES = [
  {
    subject: 'Mathematics', level: 'GCSE',
    q: "I don't understand quadratic equations",
    a: "Let's break it down. For x² + 5x + 6 = 0, find two numbers that multiply to 6 and add to 5 — that's 2 and 3. So it factors to (x+2)(x+3)=0, giving x = −2 or x = −3.",
  },
  {
    subject: 'English', level: 'A-Level',
    q: "What's the theme of Hamlet's 'to be or not to be' soliloquy?",
    a: "It's Hamlet weighing existence against non-existence — whether it's nobler to endure suffering or end it. The real tension is his fear of the unknown after death, which paralyses his action throughout the play.",
  },
  {
    subject: 'Science', level: 'GCSE',
    q: "Can you explain Newton's Third Law simply?",
    a: 'Every action has an equal and opposite reaction. When you push on a wall, the wall pushes back on you with the same force — that\'s why you don\'t fall through it.',
  },
] as const

const TYPE_SPEED_MS = 14

export default function HeroClient({ overrides: _ = {} }: { overrides?: unknown }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'question' | 'typing' | 'answer' | 'pause'>('question')
  const [typed, setTyped] = useState('')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const s = EXCHANGES[idx]

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setTyped('')
    setPhase('question')

    timers.current.push(setTimeout(() => setPhase('typing'), 900))

    // Type out the answer character-by-character once "typing" starts
    const answer = EXCHANGES[idx].a
    let i = 0
    const startTyping = setTimeout(function tick() {
      if (i >= answer.length) return
      i++
      setTyped(answer.slice(0, i))
      timers.current.push(setTimeout(tick, TYPE_SPEED_MS))
    }, 900 + 700)
    timers.current.push(startTyping)

    const answerDoneDelay = 900 + 700 + answer.length * TYPE_SPEED_MS
    timers.current.push(setTimeout(() => setPhase('answer'), answerDoneDelay))
    timers.current.push(setTimeout(() => setPhase('pause'), answerDoneDelay + 2400))
    timers.current.push(setTimeout(() => setIdx(v => (v + 1) % EXCHANGES.length), answerDoneDelay + 3000))

    return () => timers.current.forEach(clearTimeout)
  }, [idx])

  return (
    <div style={{ color: '#0f172a' }}>
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
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: '#0f172a' }}>
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

        {/* Right — the live tutoring chat IS the demo (not a bolted-on widget) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: '#fff', border: '1px solid rgba(2,132,199,0.15)',
            borderRadius: 20, padding: 24, width: '100%', maxWidth: 420, minHeight: 340,
            boxShadow: '0 8px 40px rgba(2,132,199,0.08)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Chat header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #e2e8f0' }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--accent-2), var(--accent))', fontSize: 14,
              }}>🎓</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Tutiq AI Tutor</span>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#0369a1',
                background: '#f0f9ff', border: '1px solid rgba(2,132,199,0.25)', padding: '3px 10px', borderRadius: 20,
              }}>{s.subject} · {s.level}</span>
            </div>

            {/* Live conversation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {/* Student question */}
              <div
                key={`q-${idx}`}
                style={{
                  alignSelf: 'flex-end', maxWidth: '85%',
                  background: '#f0f9ff', color: '#0f172a',
                  padding: '10px 14px', borderRadius: '14px 14px 4px 14px',
                  fontSize: 13.5, lineHeight: 1.5, fontWeight: 600,
                  animation: 'heroMsgIn 0.35s cubic-bezier(0.23,1,0.32,1) both',
                }}
              >
                {s.q}
              </div>

              {/* AI typing indicator */}
              {phase === 'typing' && !typed && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '10px 14px', background: '#f8fafc', borderRadius: '14px 14px 14px 4px' }}>
                  <span className="typing-dot" style={{ color: 'var(--accent)' }} />
                  <span className="typing-dot" style={{ color: 'var(--accent)' }} />
                  <span className="typing-dot" style={{ color: 'var(--accent)' }} />
                </div>
              )}

              {/* AI answer — typewriter reveal */}
              {(phase === 'typing' || phase === 'answer' || phase === 'pause') && typed && (
                <div style={{
                  alignSelf: 'flex-start', maxWidth: '92%',
                  background: '#f8fafc', color: '#334155',
                  padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                  fontSize: 13, lineHeight: 1.6,
                }}>
                  {typed}
                  {phase === 'typing' && <span style={{ opacity: 0.4 }}>▍</span>}
                </div>
              )}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0', fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
              Real tutoring exchange · Try it free below
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
        @keyframes heroMsgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
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
