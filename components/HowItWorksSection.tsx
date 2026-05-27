'use client'
// components/HowItWorksSection.tsx — tutiq: numbered steps with visual progress feel
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, STAGGER_CONTAINER, useMotionVariants } from '@/lib/motion'

export default function HowItWorksSection() {
  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.15))
  const itemVars      = useMotionVariants(FADE_UP)

  return (
    <section id="how-it-works" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      <motion.div
        variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVars as Parameters<typeof motion.div>[0]['variants']} className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">How Tutiq works</h2>
          <p className="text-white/40 text-sm">From stuck to confident in three steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {/* Desktop connector */}
          <div className="hidden md:block absolute top-[2.6rem] left-[33%] right-[33%] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.25), rgba(16,185,129,0.05))' }}
            aria-hidden="true" />

          {siteConfig.howItWorks.map((step, idx) => (
            <motion.div
              key={step.step}
              variants={itemVars as Parameters<typeof motion.div>[0]['variants']}
              className="relative rounded-2xl border p-5 flex flex-col gap-3 group"
              style={{
                background: 'rgba(255,255,255,0.025)',
                borderColor: idx === 1 ? 'rgba(16,185,129,0.30)' : 'rgba(255,255,255,0.07)',
                boxShadow: idx === 1 ? '0 0 32px rgba(16,185,129,0.08)' : undefined,
              }}
            >
              {/* Step number chip */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0"
                  style={
                    idx === 1
                      ? { background: 'rgba(16,185,129,0.20)', border: '1.5px solid rgba(16,185,129,0.45)', color: '#6ee7b7' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.35)' }
                  }
                >
                  {step.icon}
                </div>
                <span className="text-3xl font-black tabular-nums leading-none"
                  style={{ color: idx === 1 ? 'rgba(16,185,129,0.30)' : 'rgba(255,255,255,0.07)' }}>
                  {String(step.step).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-white font-bold text-sm">{step.title}</h3>
              <p className="text-white/45 text-xs leading-relaxed">{step.desc}</p>

              {/* Highlight badge for middle step */}
              {idx === 1 && (
                <span className="absolute -top-2.5 left-4 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.85)', color: '#022c22' }}>
                  AI-powered
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Achievement teaser */}
        <motion.div
          variants={itemVars as Parameters<typeof motion.div>[0]['variants']}
          className="mt-8 rounded-xl border px-5 py-4 flex items-center gap-4"
          style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.18)' }}
        >
          <span className="text-2xl shrink-0">🏆</span>
          <div>
            <p className="text-sm font-bold text-white">Small wins every session</p>
            <p className="text-xs text-white/45 mt-0.5">
              Tutiq celebrates each concept you master — XP points, topic badges, and streak milestones keep you motivated.
            </p>
          </div>
          <div className="ml-auto flex gap-2 shrink-0">
            {['⭐', '🎯', '🔥', '📜'].map(e => (
              <span key={e} className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {e}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
