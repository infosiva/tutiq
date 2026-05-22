'use client'
// components/HeroDemo.tsx — animated tutoring session preview
// Shows: AI asks question → student answers → AI explains
import { useState, useEffect } from 'react'
import { GraduationCap, ArrowRight } from 'lucide-react'

const SESSION = [
  { role: 'tutor', text: "Let's tackle quadratic equations. Do you know what ax² + bx + c = 0 means?" },
  { role: 'user',  text: "I've seen it but I'm not sure how to solve it." },
  { role: 'tutor', text: "Great starting point! We use the quadratic formula: x = (−b ± √(b²−4ac)) / 2a. Let me walk you through it step by step 🎯" },
]

export default function HeroDemo() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= SESSION.length) return
    const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 600 : 1400)
    return () => clearTimeout(t)
  }, [step])

  return (
    <div className="relative w-full max-w-sm mx-auto float">
      {/* Emerald glow behind card */}
      <div
        className="absolute inset-x-4 bottom-0 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: '#10b981' }}
      />

      {/* Academic badge */}
      <div className="absolute -top-4 -right-4 z-10 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold text-emerald-300 backdrop-blur-sm">
        <GraduationCap size={12} /> Step-by-step tutoring
      </div>

      {/* Chat card */}
      <div
        className="relative rounded-2xl border p-5"
        style={{
          background: 'rgba(4,47,46,0.50)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(16,185,129,0.22)',
          boxShadow: '0 24px 64px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-emerald-500/10">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.30), rgba(20,184,166,0.20))' }}
          >🎓</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white">Tutiq AI</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400">Online now</span>
            </div>
          </div>
          <span
            className="text-[10px] font-semibold rounded-full px-2.5 py-1 shrink-0"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}
          >
            Maths · Grade 9
          </span>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-3 mb-4 min-h-[120px]">
          {SESSION.slice(0, step).map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-up`}>
              <div
                className="max-w-[88%] rounded-xl px-3 py-2 text-[11px] leading-relaxed"
                style={
                  msg.role === 'tutor'
                    ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.82)', border: '1px solid rgba(255,255,255,0.05)' }
                    : { background: 'rgba(16,185,129,0.22)', color: '#d1fae5' }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {step < SESSION.length && (
            <div className="flex justify-start fade-up">
              <div className="rounded-xl px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="typing-dot" style={{ color: '#10b981' }} />
                <span className="typing-dot" style={{ color: '#10b981' }} />
                <span className="typing-dot" style={{ color: '#10b981' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
          style={{ borderColor: 'rgba(16,185,129,0.18)', background: 'rgba(255,255,255,0.03)' }}
        >
          <span className="text-[11px] text-white/25 flex-1">Ask your next question…</span>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(16,185,129,0.30)' }}
          >
            <ArrowRight size={10} className="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
