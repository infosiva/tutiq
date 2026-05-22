// lib/sessionHistory.ts — persistent tutoring session history + stats via localStorage
// Written at session end, read by dashboard. Works without any backend.

export interface SessionResult {
  id:          string
  completedAt: string            // ISO
  subject:     string
  topicsStudied: string[]
  questionsAnswered: number
  correctAnswers:    number
  durationSec: number
  learnerName: string
  level:       string
}

const KEY = 'tutiq_history'
const MAX = 50                   // keep last 50 sessions

export function saveSessionResult(result: Omit<SessionResult, 'id' | 'completedAt'>): void {
  if (typeof window === 'undefined') return
  const history = loadHistory()
  const entry: SessionResult = {
    ...result,
    id:          Math.random().toString(36).slice(2) + Date.now().toString(36),
    completedAt: new Date().toISOString(),
  }
  const updated = [entry, ...history].slice(0, MAX)
  try { localStorage.setItem(KEY, JSON.stringify(updated)) } catch {}
}

export function loadHistory(): SessionResult[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

export interface DashboardStats {
  totalSessions:    number
  totalQuestions:   number
  avgScore:         number        // 0-100
  topSubjects:      Array<{ subject: string; count: number }>
  recentSessions:   SessionResult[]
  currentStreak:    number        // days in a row with at least 1 session
  totalTopics:      number        // unique topics studied
}

export function computeStats(): DashboardStats {
  const history = loadHistory()

  if (history.length === 0) {
    return { totalSessions: 0, totalQuestions: 0, avgScore: 0, topSubjects: [], recentSessions: [], currentStreak: 0, totalTopics: 0 }
  }

  let totalQ = 0, totalCorrect = 0
  const subjectCount: Record<string, number> = {}
  const allTopics = new Set<string>()

  for (const s of history) {
    totalQ       += s.questionsAnswered
    totalCorrect += s.correctAnswers
    subjectCount[s.subject] = (subjectCount[s.subject] ?? 0) + 1
    s.topicsStudied.forEach(t => allTopics.add(t))
  }

  const topSubjects = Object.entries(subjectCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([subject, count]) => ({ subject, count }))

  // Daily streak — count consecutive days (from today backwards) with ≥1 session
  const daySet = new Set(history.map(s => s.completedAt.slice(0, 10)))
  let currentStreak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (daySet.has(key)) currentStreak++
    else break
  }

  return {
    totalSessions:  history.length,
    totalQuestions: totalQ,
    avgScore:       totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
    topSubjects,
    recentSessions: history.slice(0, 5),
    currentStreak,
    totalTopics:    allTopics.size,
  }
}
