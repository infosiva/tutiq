'use client'
// components/FeaturesGrid.tsx — tutiq: achievement + subject bento grid
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, STAGGER_CONTAINER, CARD_HOVER, SPRING_CINEMATIC, useMotionVariants } from '@/lib/motion'
import Link from 'next/link'

// Subject showcase cards — tutiq specific
const SUBJECT_CARDS = [
  { icon: '📐', label: 'Maths',    tag: 'GCSE · 11+',      desc: 'Algebra, fractions, geometry — step-by-step with worked examples',  color: 'rgba(16,185,129,0.18)', border: 'rgba(16,185,129,0.32)' },
  { icon: '🔬', label: 'Science',  tag: 'Biology · Chem · Physics', desc: 'Triple science with exam tips for every AQA/Edexcel unit', color: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.22)' },
  { icon: '✍️', label: 'English',  tag: 'Language · Lit',   desc: 'Analysis skills, essay writing, and unseen text techniques',         color: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.22)' },
  { icon: '💻', label: 'Coding',   tag: 'Python · Web',     desc: 'From variables to projects — beginner friendly, job-ready',         color: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.22)' },
  { icon: '💼', label: 'Interviews', tag: 'STAR · Tech · NHS', desc: 'Real scenarios, model answers, and FAANG-level prep',             color: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.22)' },
]

export default function FeaturesGrid() {
  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.1))
  const itemVars      = useMotionVariants(FADE_UP)

  return (
    <section id="features" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      {/* Section header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white mb-2">Everything you need to level up</h2>
        <p className="text-white/40 text-sm">Built for students who want to understand, not just pass</p>
      </div>

      {/* Feature bento */}
      <motion.div
        variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4 mb-10"
      >
        {siteConfig.features.map((f) => {
          const isLarge = f.size === 'large'
          const isWide  = f.size === 'wide'
          return (
            <motion.div
              key={f.title}
              variants={itemVars as Parameters<typeof motion.div>[0]['variants']}
              {...CARD_HOVER}
              transition={SPRING_CINEMATIC}
              className={`rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 flex flex-col gap-3 cursor-default
                ${isLarge ? 'md:col-span-1 md:row-span-2' : ''}
                ${isWide  ? 'sm:col-span-2 md:col-span-2' : ''}
              `}
            >
              <span className={`${isLarge ? 'text-4xl' : 'text-3xl'}`}>{f.icon}</span>
              <div className={`font-bold text-white ${isLarge ? 'text-lg' : 'text-sm'}`}>{f.title}</div>
              <div className={`text-white/45 leading-relaxed ${isLarge ? 'text-sm' : 'text-xs'}`}>{f.desc}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Subjects section */}
      <div className="mb-5">
        <h3 className="text-lg font-black text-white mb-1">Subjects covered</h3>
        <p className="text-white/40 text-xs mb-5">Tap a subject to start your personalised path</p>

        <motion.div
          variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
        >
          {SUBJECT_CARDS.map((s) => (
            <motion.div
              key={s.label}
              variants={itemVars as Parameters<typeof motion.div>[0]['variants']}
              {...CARD_HOVER}
              transition={SPRING_CINEMATIC}
            >
              <Link href={`/onboard?subject=${s.label.toLowerCase()}`} className="block">
                <div
                  className="rounded-2xl border p-4 flex flex-col gap-2 cursor-pointer transition-all duration-200 hover:brightness-110"
                  style={{ background: s.color, borderColor: s.border }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{s.label}</div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider"
                        style={{ color: s.border }}>
                        {s.tag}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed">{s.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* "All subjects" card */}
          <motion.div variants={itemVars as Parameters<typeof motion.div>[0]['variants']}>
            <Link href="/onboard" className="block">
              <div className="rounded-2xl border border-dashed border-white/[0.12] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer h-full min-h-[90px] transition-all hover:border-emerald-500/30 hover:bg-white/[0.03]">
                <span className="text-2xl">➕</span>
                <p className="text-xs font-bold text-white/45 text-center">+ 15 more subjects</p>
                <p className="text-[10px] text-white/30 text-center">History, Languages, Finance & more</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
