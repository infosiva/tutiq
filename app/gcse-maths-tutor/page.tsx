import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GCSE Maths AI Tutor | Free Practice Questions & Explanations',
  description: 'Free AI tutor for GCSE Maths. Get instant explanations for Algebra, Geometry, Statistics and more. Adapts to AQA, Edexcel and OCR exam boards. No worksheets — just conversation.',
  alternates: { canonical: '/gcse-maths-tutor' },
}

const TOPICS = [
  'Algebra', 'Quadratic Equations', 'Geometry', 'Trigonometry',
  'Statistics', 'Probability', 'Ratios & Proportions', 'Number Theory',
  'Functions & Graphs', 'Simultaneous Equations', 'Vectors', 'Calculus (Higher)',
]

export default function GCSEMathsTutorPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-white">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}>
          GCSE · Maths · AI Tutor
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
        GCSE Maths AI Tutor —{' '}
        <span style={{
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Free Practice Questions
        </span>
      </h1>

      <div className="space-y-4 text-white/65 leading-relaxed mb-10">
        <p>
          Struggling with GCSE Maths? Tutiq is an AI tutor that actually explains — not just tests you with
          flashcards. Ask it why you got a question wrong, and it walks you through the working step by step,
          adapting to your AQA, Edexcel, or OCR exam board.
        </p>
        <p>
          Whether it&apos;s quadratic equations, geometry proofs, or probability trees, Tutiq breaks every topic
          into plain English, then checks your understanding with targeted practice questions. No tutors to
          schedule. No worksheets to print. Just ask and it teaches.
        </p>
        <p>
          Free to start — 3 sessions per day with no account required. Upgrade to Pro for unlimited sessions,
          progress tracking, and mock exam mode with mark schemes.
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
      <Link href="/onboard?exam=GCSE&subject=Maths"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:brightness-110 hover:scale-105 active:scale-95"
        style={{ background: 'rgba(5,150,105,1)', color: '#fff' }}>
        Start free AI tutoring →
      </Link>
    </main>
  )
}
