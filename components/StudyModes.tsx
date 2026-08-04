'use client'
// components/StudyModes.tsx
// 3 study mode cards. Each click sets the chat input to a starter prompt
// by writing to sessionStorage key 'tutiq_starter_prompt', then navigating to /onboard.

import { useRouter } from 'next/navigation'

const MODES = [
  {
    icon: '📝',
    title: 'Practice Questions',
    desc: 'Get 10 exam-style questions on any topic',
    prompt: 'Give me 10 exam-style practice questions on ',
    accentRgb: '99,102,241',
    textRgb: '79,70,229',
  },
  {
    icon: '💡',
    title: 'Explain This',
    desc: 'Paste any concept, get a clear step-by-step explanation',
    prompt: 'Please explain this concept step by step: ',
    accentRgb: '234,179,8',
    textRgb: '161,98,7',
  },
  {
    icon: '✅',
    title: 'Mark My Work',
    desc: 'Paste your answer, get GCSE/A-Level grade feedback',
    prompt: 'Please mark my answer and give GCSE/A-Level grade feedback: ',
    accentRgb: '16,185,129',
    textRgb: '4,120,87',
  },
]

export default function StudyModes() {
  const router = useRouter()

  function handleMode(prompt: string) {
    try {
      sessionStorage.setItem('tutiq_starter_prompt', prompt)
    } catch {
      // ignore if storage unavailable
    }
    router.push('/onboard')
  }

  return (
    <section className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-black text-slate-900">Study Mode</h2>
        <p className="text-sm text-slate-500 mt-1">Choose how you want to practise</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MODES.map(mode => (
          <button
            key={mode.title}
            onClick={() => handleMode(mode.prompt)}
            className="group text-left rounded-2xl border p-5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95"
            style={{
              borderColor: `rgba(${mode.accentRgb},0.25)`,
            }}
          >
            <span
              className="text-2xl mb-3 block w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `rgba(${mode.accentRgb},0.12)` }}
            >
              {mode.icon}
            </span>
            <h3
              className="font-bold text-sm mb-1"
              style={{ color: `rgba(${mode.textRgb},1)` }}
            >
              {mode.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">{mode.desc}</p>
            <div
              className="mt-3 text-[11px] font-bold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ color: `rgba(${mode.textRgb},1)` }}
            >
              Start →
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
