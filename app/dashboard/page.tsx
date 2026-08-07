'use client'
// app/dashboard/page.tsx — post-login tutoring dashboard
// Shows session history, stats, streak, top subjects, quick-start CTA.
// All data from localStorage — no backend required.
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Zap, Target, Play, ChevronRight, Flame } from 'lucide-react'
import { computeStats, loadHistory, type DashboardStats, type SessionResult } from '@/lib/sessionHistory'
import { getStoredUser, isLoggedIn } from '@/lib/shared/useMagicAuth'
import { isProUser } from '@/lib/pro'
import { theme, btn } from '@/lib/theme'
import { STAGGER_CONTAINER, FADE_UP, useMotionVariants } from '@/lib/motion'

function StatCard({ icon, label, value, sub, accent = false }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: boolean
}) {
  const vars = useMotionVariants(FADE_UP)
  return (
    <motion.div
      variants={vars as Parameters<typeof motion.div>[0]['variants']}
      className={`rounded-2xl border p-5 flex flex-col gap-2 ${
        accent
          ? 'border-emerald-500/40 bg-emerald-500/[0.08]'
          : 'border-white/[0.07] bg-white/[0.03]'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-emerald-500/20' : 'bg-white/[0.05]'}`}>
        {icon}
      </div>
      <div className={`text-2xl font-black ${accent ? 'text-emerald-300' : 'text-white'}`}>{value}</div>
      <div className="text-white/50 text-xs font-medium">{label}</div>
      {sub && <div className="text-white/30 text-[10px]">{sub}</div>}
    </motion.div>
  )
}

function SessionRow({ session }: { session: SessionResult }) {
  const pct = session.questionsAnswered > 0
    ? Math.round((session.correctAnswers / session.questionsAnswered) * 100)
    : 0
  const ago = (() => {
    const diff = Date.now() - new Date(session.completedAt).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1)  return 'Just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  })()

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-base shrink-0">
        📚
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-semibold truncate capitalize">{session.subject.replace(/-/g, ' ')}</div>
        <div className="text-white/40 text-xs">{session.learnerName} · {session.topicsStudied.length} topic{session.topicsStudied.length !== 1 ? 's' : ''}</div>
      </div>
      <div className="text-right shrink-0">
        <div className={`text-sm font-black ${pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-yellow-400' : 'text-white/50'}`}>{pct}%</div>
        <div className="text-white/30 text-[10px]">{ago}</div>
      </div>
    </div>
  )
}

const STARTER_SUBJECTS = [
  { icon: '📐', label: 'Maths (GCSE)',      subject: 'maths-gcse',   desc: 'Algebra, number, geometry & statistics — AQA/Edexcel/OCR' },
  { icon: '🔬', label: 'Combined Science',  subject: 'science-gcse', desc: 'Biology, Chemistry & Physics with worked exam answers' },
  { icon: '🎯', label: '11+ Prep',          subject: 'eleven-plus',  desc: 'Verbal reasoning, non-verbal reasoning & comprehension' },
  { icon: '💼', label: 'Job Interview',     subject: 'interview-gen',desc: 'STAR method practice with model answers' },
]

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center px-4">
      <div className="text-5xl mb-4">🎓</div>
      <h2 className="text-white font-black text-xl mb-2">No sessions yet</h2>
      <p className="text-white/40 text-sm mb-8 max-w-sm">
        Start your first tutoring session and your stats, history, and streak will appear here.
        Tutiq adapts every explanation to your exam board and level — pick a subject below or search for anything.
      </p>
      <Link href="/onboard" className={btn.primary + ' px-8 py-4 font-bold text-base mb-10'}>
        🎓 Start your first session →
      </Link>

      <div className="w-full max-w-2xl text-left">
        <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Popular starting points</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STARTER_SUBJECTS.map(s => (
            <Link
              key={s.subject}
              href={`/onboard?subject=${s.subject}`}
              className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-emerald-500/30 transition-colors"
            >
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold">{s.label}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null)
  const [user,    setUser]    = useState<{ username: string } | null>(null)
  const [isPro,   setIsPro]   = useState(false)
  const [mounted, setMounted] = useState(false)

  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.07))

  useEffect(() => {
    setMounted(true)
    const u = getStoredUser()
    setUser(u)
    setIsPro(isProUser())
    setStats(computeStats())
  }, [])

  if (!mounted || !stats) {
    return (
      <div className="min-h-screen" style={{ background: '#0b1120' }}>
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 animate-pulse">
          <div className="h-8 w-48 rounded-xl bg-white/[0.06] mb-3" />
          <div className="h-4 w-64 rounded-lg bg-white/[0.04] mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-white/[0.04]" />)}
          </div>
          <div className="h-64 rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    )
  }

  const hasSessions = stats.totalSessions > 0

  return (
    <div className="min-h-screen" style={{ background: '#0b1120' }}>
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              {stats.currentStreak > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                  <Flame size={11} /> {stats.currentStreak} day streak
                </span>
              )}
              {isPro && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white`}>
                  PRO
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {user ? `Hey ${user.username} 👋` : 'Your Dashboard'}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {hasSessions
                ? `${stats.totalSessions} session${stats.totalSessions !== 1 ? 's' : ''} completed · ${stats.totalTopics} topics studied`
                : 'Start learning to build your stats'
              }
            </p>
          </div>

          <Link href="/onboard" className={btn.primary + ' flex items-center gap-2 px-5 py-3 text-sm font-bold shrink-0'}>
            <Play size={14} /> Start Session
          </Link>
        </motion.div>

        {!hasSessions ? <EmptyState /> : (
          <>
            {/* Stats grid */}
            <motion.div
              variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
            >
              <StatCard
                icon={<BookOpen size={18} className="text-emerald-400" />}
                label="Sessions"
                value={stats.totalSessions}
                accent
              />
              <StatCard
                icon={<Target size={18} className="text-green-400" />}
                label="Avg score"
                value={`${stats.avgScore}%`}
                sub={stats.totalQuestions + ' questions'}
              />
              <StatCard
                icon={<Flame size={18} className="text-orange-400" />}
                label="Day streak"
                value={`🔥 ${stats.currentStreak}`}
                sub="days in a row"
              />
              <StatCard
                icon={<Zap size={18} className="text-emerald-400" />}
                label="Topics studied"
                value={stats.totalTopics}
                sub="unique topics"
              />
            </motion.div>

            {/* Recent sessions + Top subjects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Recent sessions — 2/3 width */}
              <motion.div
                variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
                initial="hidden"
                animate="show"
                className="md:col-span-2 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-50">Recent Sessions</h2>
                  <Link href="/history" className="text-emerald-400 text-xs font-bold hover:text-emerald-300 flex items-center gap-1">
                    All <ChevronRight size={12} />
                  </Link>
                </div>
                {stats.recentSessions.map(s => <SessionRow key={s.id} session={s} />)}
              </motion.div>

              {/* Top subjects — 1/3 width */}
              <motion.div
                variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3"
              >
                <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-50 mb-1">Top Subjects</h2>
                {stats.topSubjects.length === 0 ? (
                  <p className="text-white/30 text-xs">Study more subjects to see your favourites here.</p>
                ) : stats.topSubjects.map((t, i) => (
                  <Link
                    key={t.subject}
                    href={`/onboard?subject=${encodeURIComponent(t.subject)}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                  >
                    <span className="text-white/30 text-xs font-black w-4 tabular-nums">{i + 1}</span>
                    <span className="text-white/70 text-sm capitalize flex-1 truncate group-hover:text-white transition-colors">
                      {t.subject.replace(/-/g, ' ')}
                    </span>
                    <span className="text-white/30 text-xs shrink-0">{t.count}×</span>
                  </Link>
                ))}

                {/* Quick-start suggestions */}
                <div className="mt-4">
                  <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-50 mb-3">Study Again</h2>
                  {['Maths', 'Science', 'English'].map(subject => (
                    <Link
                      key={subject}
                      href={`/onboard?subject=${subject.toLowerCase()}`}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.05] hover:border-emerald-500/30 bg-white/[0.02] hover:bg-emerald-500/[0.06] transition-all group mb-2"
                    >
                      <Zap size={13} className="text-emerald-400" />
                      <span className="text-white/60 text-sm group-hover:text-white transition-colors">{subject}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Upgrade CTA for free users */}
            {!isPro && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="text-white font-bold mb-1">Unlock unlimited sessions with Pro</div>
                  <div className="text-white/50 text-sm">Remove the daily limit, unlock all subjects, progress tracking, PDF study guides.</div>
                </div>
                <Link href="/pricing" className={`shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm hover:opacity-90 transition-opacity`}>
                  Upgrade to Pro →
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
