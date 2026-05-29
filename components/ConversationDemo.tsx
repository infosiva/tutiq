'use client'
// components/ConversationDemo.tsx — animated AI tutoring conversation
// Shows our "conversation" differentiator vs Seneca/Atom flashcards

import { useEffect, useState } from 'react'

const MESSAGES = [
  { from: 'student', text: "I don't understand quadratic equations" },
  { from: 'ai',      text: 'Let\'s break it down. ax²+bx+c=0. The key is finding two numbers that multiply to ac and add to b. Try this: x²+5x+6=0…' },
  { from: 'student', text: 'So x = −2 and x = −3?' },
  { from: 'ai',      text: '✅ Exactly right! Want to try a harder one?' },
] as const

export default function ConversationDemo() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= MESSAGES.length) return
    const timer = setTimeout(() => setVisible(v => v + 1), 900)
    return () => clearTimeout(timer)
  }, [visible])

  return (
    <div
      className="w-[280px] rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: 'rgba(10,10,20,0.85)',
        border: '1px solid rgba(16,185,129,0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 40px rgba(16,185,129,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
        <span className="text-base">🤖</span>
        <span className="text-xs font-bold text-emerald-300">Tutiq AI Tutor</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2.5">
        {MESSAGES.slice(0, visible).map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${msg.from === 'student' ? 'flex-row-reverse' : 'flex-row'}`}
            style={{
              animation: 'demoMsgIn 0.35s cubic-bezier(0.23,1,0.32,1) both',
            }}
          >
            {/* Avatar */}
            <div
              className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
              style={
                msg.from === 'student'
                  ? { background: 'rgba(245,158,11,0.25)', color: '#fbbf24' }
                  : { background: 'rgba(16,185,129,0.25)', color: '#34d399' }
              }
            >
              {msg.from === 'student' ? 'S' : '🤖'}
            </div>

            {/* Bubble */}
            <div
              className="text-[11px] leading-snug rounded-xl px-3 py-2 max-w-[190px]"
              style={
                msg.from === 'student'
                  ? {
                      background: 'rgba(245,158,11,0.15)',
                      color: 'rgba(255,255,255,0.85)',
                      borderBottomRightRadius: '4px',
                    }
                  : {
                      background: 'rgba(16,185,129,0.12)',
                      color: 'rgba(255,255,255,0.85)',
                      borderBottomLeftRadius: '4px',
                    }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator while next message is loading */}
        {visible < MESSAGES.length && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px]"
              style={{ background: 'rgba(16,185,129,0.25)', color: '#34d399' }}>
              🤖
            </div>
            <div className="flex gap-1 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.12)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <p className="text-[10px] text-white/25 text-center mt-1">
        Real conversation · Not just flashcards
      </p>

      <style>{`
        @keyframes demoMsgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
