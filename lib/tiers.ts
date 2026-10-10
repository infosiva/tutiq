import type { Tier } from '@/components/TierStrip'

export const TIERS: Tier[] = [
  { name: 'Guest', price: 'no sign-in', items: [{ text: '5 AI questions a day' }, { text: 'Mock papers, memorise cards, uploads', locked: true }] },
  { name: 'Code or free account', price: 'trial code', items: [{ text: 'Everything unlocked while your code lasts' }, { text: 'Progress saved once signed in' }] },
  { name: 'Pro plan', price: 'paid', items: [{ text: 'Full mock exams and reports' }, { text: 'Saved history and streaks' }] },
]
