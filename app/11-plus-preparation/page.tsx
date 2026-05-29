import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '11 Plus Preparation | AI Practice Questions & Tutor',
  description: 'Free AI tutor for 11+ preparation. Practice Verbal Reasoning, Non-Verbal Reasoning, Maths and English with instant AI explanations. No tutors, no worksheets — just conversation.',
  alternates: { canonical: '/11-plus-preparation' },
}

const TOPICS = [
  'Verbal Reasoning', 'Non-Verbal Reasoning', 'Maths', 'English',
  'Comprehension', 'Spelling & Grammar', 'Sequences & Patterns',
  'Spatial Reasoning', 'Vocabulary Building', 'Creative Writing',
  'Problem Solving', 'Mixed Practice Tests',
]

export default function ElevenPlusPrepPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-white">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}>
          11+ · Preparation · AI Tutor
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
        11 Plus Preparation —{' '}
        <span style={{
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          AI Practice Questions
        </span>
      </h1>

      <div className="space-y-4 text-white/65 leading-relaxed mb-10">
        <p>
          11+ preparation can feel overwhelming. Tutiq is an AI tutor designed for primary school pupils
          working towards selective secondary school entrance exams. It explains verbal reasoning, non-verbal
          patterns, and maths concepts in language a child can actually understand.
        </p>
        <p>
          Unlike revision apps that just show flashcards, Tutiq lets your child ask &quot;why?&quot; after every
          question. It responds like a patient tutor — breaking down the logic, giving worked examples, then
          trying again with a slightly harder question when they&apos;re ready.
        </p>
        <p>
          Start free today with no account needed. Tutiq adapts to your child&apos;s pace and the specific
          format used by GL Assessment, CEM, or your target school.
        </p>
      </div>

      {/* Topic chips */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-white/40 mb-3 uppercase tracking-wider">Topics covered</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(topic => (
            <span key={topic}
              className="text-sm px-4 py-2 rounded-full font-medium"
              style={{ background: 'rgba(16,185,129,0.10)', color: 'rgba(110,231,183,0.80)', border: '1px solid rgba(16,185,129,0.18)' }}>
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link href="/onboard?exam=11%2B&subject=Verbal+Reasoning"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:brightness-110 hover:scale-105 active:scale-95"
        style={{ background: 'rgba(5,150,105,1)', color: '#fff' }}>
        Start free AI tutoring →
      </Link>
    </main>
  )
}
