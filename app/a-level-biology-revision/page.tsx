import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'A-Level Biology Revision | AI Tutor & Free Practice Questions',
  description: 'Free AI tutor for A-Level Biology revision. Get instant explanations for Cell Biology, Genetics, Ecology and more. Covers AQA, Edexcel and OCR A specifications. Ask why — it actually explains.',
  alternates: { canonical: '/a-level-biology-revision' },
}

const TOPICS = [
  'Cell Biology', 'Cell Division & Mitosis', 'Genetics & Inheritance',
  'DNA & Protein Synthesis', 'Enzymes & Metabolism', 'Photosynthesis',
  'Respiration', 'Ecology & Ecosystems', 'Homeostasis', 'Biodiversity',
  'Evolution & Natural Selection', 'Immunity & Disease',
]

export default function ALevelBiologyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-white">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}>
          A-Level · Biology · AI Tutor
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
        A-Level Biology Revision —{' '}
        <span style={{
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          AI Tutor
        </span>
      </h1>

      <div className="space-y-4 text-white/65 leading-relaxed mb-10">
        <p>
          A-Level Biology demands deep understanding, not just memorisation. Tutiq is an AI tutor that explains
          complex concepts conversationally — whether you&apos;re confused about meiosis vs mitosis, struggling
          with enzyme kinetics, or trying to understand how the immune system responds to pathogens.
        </p>
        <p>
          Tutiq covers all major A-Level Biology specifications including AQA, Edexcel and OCR A. Ask it any
          question mid-revision and it responds immediately — no waiting for a teacher, no sifting through
          textbook chapters. It then asks you a follow-up question to check your understanding.
        </p>
        <p>
          Revision sessions are free to start with no account needed. The AI adapts to your specification and
          the topics where your past papers show you are weakest.
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
      <Link href="/onboard?exam=A-Level&subject=Biology"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:brightness-110 hover:scale-105 active:scale-95"
        style={{ background: 'rgba(5,150,105,1)', color: '#fff' }}>
        Start free AI tutoring →
      </Link>
    </main>
  )
}
