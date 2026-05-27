'use client'
// components/HeroDemo.tsx — learning path visualization for tutiq
// Shows: topic nodes with progress, mastery arc, achievement badge
import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Lock, Trophy } from 'lucide-react'

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Coding']

const PATH_NODES = [
  { id: 1, label: 'Number Basics',       done: true,    active: false, icon: '➕' },
  { id: 2, label: 'Fractions',           done: true,    active: false, icon: '½' },
  { id: 3, label: 'Algebra Intro',       done: false,   active: true,  icon: '𝑥' },
  { id: 4, label: 'Linear Equations',    done: false,   active: false, icon: '📐' },
  { id: 5, label: 'Quadratics',          done: false,   active: false, icon: '⌒', locked: true },
]

const MASTERY_PCT = 42 // percent mastery to show

export default function HeroDemo() {
  const [activeSubject, setActiveSubject] = useState(0)
  const [quizVisible, setQuizVisible] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Cycle subject every 4s
  useEffect(() => {
    const t = setInterval(() => setActiveSubject(p => (p + 1) % SUBJECTS.length), 4000)
    return () => clearInterval(t)
  }, [])

  // Show mini quiz after 1.8s
  useEffect(() => {
    const t = setTimeout(() => setQuizVisible(true), 1800)
    return () => clearTimeout(t)
  }, [])

  function handleAnswer(idx: number) {
    if (confirmed) return
    setSelected(idx)
    setTimeout(() => setConfirmed(true), 400)
  }

  // SVG arc for mastery ring
  const R = 30
  const CIRC = 2 * Math.PI * R
  const dash = (MASTERY_PCT / 100) * CIRC

  return (
    <div className="relative w-full max-w-sm mx-auto float select-none">
      {/* Emerald glow */}
      <div
        className="absolute inset-x-6 bottom-0 h-20 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl border p-5 overflow-hidden"
        style={{
          background: 'rgba(2,44,34,0.55)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(16,185,129,0.25)',
          boxShadow: '0 24px 64px rgba(16,185,129,0.14), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Header row: subject chips + mastery arc */}
        <div className="flex items-center justify-between mb-4">
          {/* Subject chips */}
          <div className="flex flex-wrap gap-1.5">
            {SUBJECTS.map((s, i) => (
              <button
                key={s}
                onClick={() => setActiveSubject(i)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all duration-200"
                style={
                  i === activeSubject
                    ? { background: 'rgba(16,185,129,0.30)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.45)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {s}
              </button>
            ))}
          </div>

          {/* Mastery ring */}
          <div className="flex flex-col items-center shrink-0 ml-2">
            <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
              <circle cx="34" cy="34" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
              <circle
                cx="34" cy="34" r={R} fill="none"
                stroke="url(#arcGrad)" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${CIRC}`}
                style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.23,1,0.32,1)' }}
              />
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute" style={{ marginTop: '16px' }}>
              <span className="text-[13px] font-black text-emerald-300 leading-none">{MASTERY_PCT}%</span>
            </div>
            <span className="text-[9px] text-white/35 mt-0.5 leading-none">mastery</span>
          </div>
        </div>

        {/* Learning path nodes */}
        <div className="mb-4">
          <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-2.5">Your path · Maths</div>
          <div className="flex items-center gap-0">
            {PATH_NODES.map((node, i) => (
              <div key={node.id} className="flex items-center">
                {/* Node */}
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={
                      node.done
                        ? { background: 'rgba(16,185,129,0.25)', border: '1.5px solid rgba(16,185,129,0.6)', color: '#6ee7b7' }
                        : node.active
                        ? { background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.8)', color: '#a7f3d0', boxShadow: '0 0 12px rgba(16,185,129,0.35)' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.25)' }
                    }
                  >
                    {node.done
                      ? <CheckCircle2 size={16} className="text-emerald-400" />
                      : node.locked
                      ? <Lock size={13} className="text-white/25" />
                      : <span className="text-xs">{node.icon}</span>
                    }
                  </div>
                  <span className="text-[8px] text-center leading-tight w-10 truncate"
                    style={{ color: node.active ? '#6ee7b7' : node.done ? 'rgba(110,231,183,0.6)' : 'rgba(255,255,255,0.22)' }}>
                    {node.label}
                  </span>
                </div>

                {/* Connector line */}
                {i < PATH_NODES.length - 1 && (
                  <div
                    className="h-px w-4 shrink-0 mb-3.5"
                    style={{
                      background: node.done
                        ? 'rgba(16,185,129,0.50)'
                        : 'rgba(255,255,255,0.08)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mini quiz card — appears after delay */}
        <div
          className="rounded-xl border p-3 transition-all duration-500"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255,255,255,0.07)',
            opacity: quizVisible ? 1 : 0,
            transform: quizVisible ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-sm">🎯</span>
            <span className="text-[11px] font-bold text-white">Quick Check</span>
            <span className="ml-auto text-[9px] text-white/30 font-medium">Algebra · Q1</span>
          </div>
          <p className="text-[11px] text-white/70 mb-2.5 leading-relaxed">
            Solve: 2x + 4 = 12. What is x?
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {['x = 4', 'x = 6', 'x = 8', 'x = 3'].map((opt, i) => {
              const isCorrect = i === 0 // x=4 is correct
              const isSelected = selected === i
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(i)}
                  className="rounded-lg px-2 py-1.5 text-[10px] font-semibold transition-all duration-200 text-left"
                  style={
                    confirmed && isCorrect
                      ? { background: 'rgba(16,185,129,0.30)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.5)' }
                      : confirmed && isSelected && !isCorrect
                      ? { background: 'rgba(239,68,68,0.20)', color: 'rgba(252,165,165,0.9)', border: '1px solid rgba(239,68,68,0.35)' }
                      : isSelected
                      ? { background: 'rgba(16,185,129,0.15)', color: '#a7f3d0', border: '1px solid rgba(16,185,129,0.35)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {confirmed && (
            <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 fade-up">
              <Trophy size={10} /> Great work! 2x = 8, so x = 4. +10 XP earned!
            </div>
          )}
        </div>

        {/* Streak badge */}
        <div className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold backdrop-blur-sm"
          style={{ background: 'rgba(5,46,22,0.85)', borderColor: 'rgba(16,185,129,0.40)', color: '#6ee7b7' }}>
          🔥 Start your streak today
        </div>
      </div>
    </div>
  )
}
