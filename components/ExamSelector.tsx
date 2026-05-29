'use client'
// components/ExamSelector.tsx
// Exam level + subject pill selector. Persists choice to localStorage.
// onSelect fires when both exam and subject are chosen.

import { useState, useEffect } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

type ExamLevel = '11+' | 'GCSE' | 'A-Level'

const EXAM_LEVELS: ExamLevel[] = ['11+', 'GCSE', 'A-Level']

const SUBJECTS: Record<ExamLevel, string[]> = {
  '11+':     ['Maths', 'English', 'Verbal Reasoning', 'Non-Verbal Reasoning'],
  'GCSE':    ['Maths', 'English', 'Science', 'History', 'Geography', 'French'],
  'A-Level': ['Maths', 'Biology', 'Chemistry', 'Physics', 'English Lit', 'Economics'],
}

const TOPIC_CHIPS: Record<string, Record<string, string[]>> = {
  'GCSE': {
    'Maths':   ['Algebra', 'Geometry', 'Statistics', 'Ratios', 'Probability', 'Trigonometry'],
    'English': ['Analysis', 'Essay Writing', 'Unseen Poetry', 'Language Paper 1', 'Language Paper 2'],
    'Science': ['Cell Biology', 'Atomic Structure', 'Forces', 'Ecosystems', 'Inheritance'],
    'History': ['WWI Causes', 'Weimar Germany', 'Cold War', 'Medicine', 'American West'],
    'Geography': ['Urban Issues', 'Natural Hazards', 'Rivers', 'Coasts', 'Development'],
    'French':  ['Speaking', 'Listening', 'Reading', 'Writing', 'Grammar'],
  },
  'A-Level': {
    'Maths':       ['Pure 1', 'Pure 2', 'Statistics', 'Mechanics', 'Proof'],
    'Biology':     ['Cell Biology', 'Genetics', 'Ecology', 'Biochemistry', 'Physiology'],
    'Chemistry':   ['Physical', 'Inorganic', 'Organic', 'Bonding', 'Energetics'],
    'Physics':     ['Mechanics', 'Electricity', 'Waves', 'Quantum', 'Fields'],
    'English Lit': ['Poetry', 'Prose', 'Drama', 'Comparative Essays', 'Unseen'],
    'Economics':   ['Microeconomics', 'Macroeconomics', 'Markets', 'Monetary Policy', 'Trade'],
  },
  '11+': {
    'Maths':              ['Number', 'Fractions', 'Speed', 'Sequences', 'Word Problems'],
    'English':            ['Comprehension', 'Vocabulary', 'Grammar', 'Spelling', 'Creative Writing'],
    'Verbal Reasoning':   ['Word Codes', 'Analogies', 'Odd One Out', 'Word Order', 'Hidden Words'],
    'Non-Verbal Reasoning': ['Sequences', 'Matrices', 'Rotations', 'Reflections', 'Odd One Out'],
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onSelect: (exam: string, subject: string) => void
}

export default function ExamSelector({ onSelect }: Props) {
  const [exam, setExam] = useState<ExamLevel | null>(null)
  const [subject, setSubject] = useState<string | null>(null)

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tutiq_exam_selection')
      if (saved) {
        const { exam: e, subject: s } = JSON.parse(saved) as { exam: ExamLevel; subject: string }
        if (EXAM_LEVELS.includes(e)) {
          setExam(e)
          if (s && SUBJECTS[e]?.includes(s)) setSubject(s)
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  function handleExam(level: ExamLevel) {
    setExam(level)
    setSubject(null)
    try { localStorage.setItem('tutiq_exam_selection', JSON.stringify({ exam: level, subject: null })) } catch { /* ignore */ }
  }

  function handleSubject(sub: string) {
    setSubject(sub)
    if (exam) {
      try { localStorage.setItem('tutiq_exam_selection', JSON.stringify({ exam, subject: sub })) } catch { /* ignore */ }
      onSelect(exam, sub)
    }
  }

  function handleTopic(topic: string) {
    if (exam && subject) {
      onSelect(exam, `${subject} — ${topic}`)
    }
  }

  const topicChips = exam && subject ? (TOPIC_CHIPS[exam]?.[subject] ?? []) : []

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1 — Exam level */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] text-white/35 font-semibold shrink-0">Exam:</span>
        {EXAM_LEVELS.map(level => (
          <button
            key={level}
            onClick={() => handleExam(level)}
            className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 active:scale-95"
            style={
              exam === level
                ? {
                    background: 'rgba(99,102,241,0.28)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.55)',
                    boxShadow: '0 0 10px rgba(99,102,241,0.20)',
                  }
                : {
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }
            }
          >
            {level}
          </button>
        ))}
      </div>

      {/* Row 2 — Subject (appears after exam selected) */}
      {exam && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] text-white/35 font-semibold shrink-0">Subject:</span>
          {SUBJECTS[exam].map(sub => (
            <button
              key={sub}
              onClick={() => handleSubject(sub)}
              className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 active:scale-95"
              style={
                subject === sub
                  ? {
                      background: 'rgba(139,92,246,0.28)',
                      color: '#c4b5fd',
                      border: '1px solid rgba(139,92,246,0.55)',
                      boxShadow: '0 0 10px rgba(139,92,246,0.20)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.55)',
                      border: '1px solid rgba(255,255,255,0.09)',
                    }
              }
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Row 3 — Topic chips (appears after subject selected) */}
      {topicChips.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] text-white/35 font-semibold shrink-0">Topic:</span>
          {topicChips.map(topic => (
            <button
              key={topic}
              onClick={() => handleTopic(topic)}
              className="text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: 'rgba(99,102,241,0.10)',
                color: 'rgba(165,180,252,0.75)',
                border: '1px solid rgba(99,102,241,0.20)',
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
