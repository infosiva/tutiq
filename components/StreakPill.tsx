'use client'
// components/StreakPill.tsx — reads tutiq_streak from localStorage
// Shows "🔥 {n} day streak" or faint prompt to start one

import { useEffect, useState } from 'react'

export default function StreakPill() {
  const [streak, setStreak] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tutiq_streak')
      setStreak(raw !== null ? Number(raw) : 0)
    } catch {
      setStreak(0)
    }
  }, [])

  // Don't render until hydrated (avoids SSR mismatch)
  if (streak === null) return null

  if (streak > 0) {
    return (
      <span
        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
        style={{
          background: 'rgba(249,115,22,0.18)',
          color: '#fb923c',
          border: '1px solid rgba(249,115,22,0.30)',
        }}
      >
        🔥 {streak} day streak
      </span>
    )
  }

  return (
    <span className="hidden md:inline text-xs text-white/25 font-medium">
      Start your streak →
    </span>
  )
}
