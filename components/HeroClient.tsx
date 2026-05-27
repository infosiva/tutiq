'use client'
// components/HeroClient.tsx — tutiq hero: progress-focused, subject chips, onboarding hook
import { motion } from 'framer-motion'
import { STAGGER_CONTAINER, FADE_UP, SPRING_CINEMATIC, BUTTON_PRESS, useMotionVariants } from '@/lib/motion'
import { siteConfig } from '@/site.config'
import type { ContentOverrides } from '@/lib/content'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { theme, btn } from '@/lib/theme'
import Link from 'next/link'
import { useState } from 'react'

const SUBJECT_CHIPS = [
  { label: 'Math',    icon: '📐', href: '/onboard?subject=maths' },
  { label: 'Science', icon: '🔬', href: '/onboard?subject=science' },
  { label: 'English', icon: '✍️', href: '/onboard?subject=english' },
  { label: 'History', icon: '🏛️', href: '/onboard?subject=history' },
  { label: 'Coding',  icon: '💻', href: '/onboard?subject=coding' },
]

export default function HeroClient({ overrides = {} }: { overrides?: ContentOverrides }) {
  const variants  = useMotionVariants(STAGGER_CONTAINER(0.06))
  const childVars = useMotionVariants(FADE_UP)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <motion.div
      variants={variants as Parameters<typeof motion.div>[0]['variants']}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Badge */}
      <motion.div variants={childVars as Parameters<typeof motion.div>[0]['variants']}>
        <span className="badge-glow inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI Tutor · Free to start
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={childVars as Parameters<typeof motion.h1>[0]['variants']}
        className="text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.08] tracking-tight"
      >
        <span className="block text-white">{overrides.headline ?? 'Your AI tutor'}</span>
        <span className="block"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 28px rgba(16,185,129,0.40))',
          }}>
          knows where you're stuck.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={childVars as Parameters<typeof motion.p>[0]['variants']}
        className="text-white/55 text-base leading-relaxed max-w-md"
      >
        {overrides.subheadline ?? 'Personalised learning paths. Instant explanations. Quick quizzes after every topic. Adapts to your age, pace, and level — for free.'}
      </motion.p>

      {/* Subject chips — clickable */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap gap-2"
        id="subjects"
      >
        <span className="text-xs text-white/35 self-center font-medium mr-1">Pick a subject:</span>
        {SUBJECT_CHIPS.map((chip, i) => (
          <Link key={chip.label} href={chip.href}>
            <motion.span
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
              style={
                hovered === i
                  ? { background: 'rgba(16,185,129,0.22)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.45)', transform: 'scale(1.06)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.09)' }
              }
            >
              <span>{chip.icon}</span>
              {chip.label}
            </motion.span>
          </Link>
        ))}
      </motion.div>

      {/* Onboarding hook — "where are you struggling?" */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="rounded-xl border px-4 py-3 flex items-center gap-3"
        style={{
          background: 'rgba(16,185,129,0.07)',
          borderColor: 'rgba(16,185,129,0.20)',
        }}
      >
        <span className="text-xl shrink-0">🤔</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/60 leading-snug">
            <span className="text-emerald-300 font-bold">Where are you struggling?</span>{' '}
            Tell Tutiq in one line and get a personalised plan in seconds.
          </p>
        </div>
        <Link href="/onboard"
          className="shrink-0 text-[10px] font-bold rounded-lg px-3 py-1.5 transition-all hover:brightness-110 active:scale-95"
          style={{ background: 'rgba(16,185,129,0.25)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.35)' }}>
          Try it →
        </Link>
      </motion.div>

      {/* CTAs */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-col sm:flex-row gap-3"
        id="hero-play-btn"
      >
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link href={siteConfig.ctaPrimary.href}>
            <ShimmerButton background="rgba(5,150,105,1)" shimmerColor="#a7f3d0" className="px-8 py-4 text-base font-bold min-h-[52px]">
              {overrides.cta ?? siteConfig.ctaPrimary.text}
            </ShimmerButton>
          </Link>
        </motion.div>
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link href={siteConfig.ctaSecondary.href}
            className={btn.secondary + ' text-sm px-7 py-4 font-bold min-h-[52px] flex items-center gap-2'}>
            📚 See All Subjects
          </Link>
        </motion.div>
      </motion.div>

      {/* Trust pills */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap gap-2"
      >
        {siteConfig.freeTier.pills.map(pill => (
          <span key={pill} className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.10)', color: 'rgba(110,231,183,0.80)', border: '1px solid rgba(16,185,129,0.18)' }}>
            {pill}
          </span>
        ))}
      </motion.div>
    </motion.div>
  )
}
