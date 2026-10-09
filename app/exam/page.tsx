'use client'
// Exam journey: pick -> lesson (tone tutor + cards) -> topic quiz -> so-far quiz -> mock paper -> report.
// Anonymous per-device state only (no PII). Items arrive as sealed tickets; marking is server-side.
import { useEffect, useMemo, useRef, useState } from 'react'
import { SUBJECTS, type ExamStage, type Subject } from '@/lib/curriculum'
import { BLUEPRINTS } from '@/lib/exam/blueprints'
import { planQuiz, type Scope, type Slot } from '@/lib/exam/quizPlan'
import { TONES, type Tone } from '@/lib/exam/tutor'

type Pub = { id: string; type: 'mcq' | 'short' | 'extended'; topic: string; ao: string; marks: number; stem: string; options?: string[] }
type Marked = { awarded: number; of: number; proposed: boolean; feedback: string }
type Result = { topic: string; ao: string; awarded: number; of: number; proposed: boolean }
type Card = { front: string; back: string }
type Step = 'pick' | 'learn' | 'quiz' | 'report'

const post = async <T,>(url: string, body: unknown): Promise<T | null> => {
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    return r.ok ? ((await r.json()) as T) : null
  } catch { return null }
}
const KEY = 'tutiq-exam-v1'
const btn = 'min-h-11 rounded-xl px-4 text-sm font-semibold transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] disabled:opacity-50'
const primary = `${btn} bg-[#0284c7] text-white hover:bg-[#0369a1]`
const ghost = `${btn} border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f0f9ff]`

export default function ExamPage() {
  const [step, setStep] = useState<Step>('pick')
  const [stage, setStage] = useState<ExamStage>('11plus')
  const [subject, setSubject] = useState<Subject | null>(null)
  const [topicId, setTopicId] = useState('')
  const [tone, setTone] = useState<Tone>('friendly')
  const [covered, setCovered] = useState<string[]>([])
  const [scope, setScope] = useState<Scope>('topic')
  const [results, setResults] = useState<Result[]>([])

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) ?? '{}'); if (Array.isArray(s.covered)) setCovered(s.covered); if (s.tone) setTone(s.tone) } catch {}
  }, [])
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ covered, tone })) } catch {} }, [covered, tone])

  const bp = useMemo(() => BLUEPRINTS.find(b => b.subjectId === subject?.id), [subject])
  const topic = subject?.topics.find(t => t.id === topicId)
  const age = stage === '11plus' ? '11' : '15'

  return (
    <main className="mx-auto flex h-[calc(100dvh-72px)] max-w-5xl flex-col gap-3 bg-[#f0f9ff] px-4 py-3 text-[#0f172a]">
      <style>{`
        @media (prefers-reduced-motion: no-preference){
          .step{animation:stepIn .18s cubic-bezier(.16,1,.3,1)}
          .flip{transition:transform .35s cubic-bezier(.16,1,.3,1);transform-style:preserve-3d}
          .grow{transition:width .3s cubic-bezier(.16,1,.3,1)}
        }
        @keyframes stepIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .face{backface-visibility:hidden}
        @media print{.noprint{display:none!important}main{height:auto!important}}
      `}</style>
      <header className="noprint flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold">Tutiq exam practice</h1>
        <label className="flex items-center gap-2 text-sm text-[#64748b]">
          Tutor tone
          <select value={tone} onChange={e => setTone(e.target.value as Tone)} className="min-h-11 rounded-xl border border-[#e2e8f0] bg-white px-2 text-[#0f172a]">
            {TONES.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
      </header>

      <section key={step} className="step min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#e2e8f0] bg-white p-4">
        {step === 'pick' && (
          <Pick stage={stage} setStage={setStage} subject={subject} setSubject={setSubject} topicId={topicId} setTopicId={setTopicId}
            onGo={() => setStep('learn')} />
        )}
        {step === 'learn' && subject && topic && (
          <Learn subject={subject} topicId={topic.id} title={topic.title} memorise={!!topic.memorise} tone={tone} age={age}
            onBack={() => setStep('pick')} onQuiz={() => { setScope('topic'); setStep('quiz') }} />
        )}
        {step === 'quiz' && bp && (
          <Quiz key={scope + topicId} scope={scope} blueprintId={bp.id} minutes={scope === 'mock' ? bp.minutes : 0}
            topics={scope === 'topic' ? [topicId] : covered.length ? covered : [topicId]}
            onBack={() => setStep('learn')}
            onDone={r => { setResults(r); if (scope === 'topic') setCovered(c => (c.includes(topicId) ? c : [...c, topicId])); setStep('report') }} />
        )}
        {step === 'report' && subject && (
          <Report results={results} subject={subject} scope={scope} covered={covered}
            onNext={s => { setScope(s); setStep(s === 'topic' ? 'learn' : 'quiz') }} onHome={() => setStep('pick')} />
        )}
        {step !== 'pick' && !bp && <p>No paper blueprint for this subject yet. <button className={ghost} onClick={() => setStep('pick')}>Back</button></p>}
      </section>
    </main>
  )
}

function Pick(p: { stage: ExamStage; setStage: (s: ExamStage) => void; subject: Subject | null; setSubject: (s: Subject) => void; topicId: string; setTopicId: (t: string) => void; onGo: () => void }) {
  const list = SUBJECTS.filter(s => s.stage === p.stage)
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <div className="flex flex-col gap-2">
        <div role="tablist" className="flex gap-2">
          {(['11plus', 'gcse'] as const).map(s => (
            <button key={s} role="tab" aria-selected={p.stage === s} onClick={() => p.setStage(s)} className={`${p.stage === s ? primary : ghost} flex-1`}>{s === '11plus' ? '11+' : 'GCSE'}</button>
          ))}
        </div>
        <ul className="flex max-h-[40dvh] flex-col gap-1 overflow-y-auto md:max-h-none">
          {list.map(s => (
            <li key={s.id}><button onClick={() => { p.setSubject(s); p.setTopicId('') }} aria-pressed={p.subject?.id === s.id} className={`${btn} w-full text-left ${p.subject?.id === s.id ? 'bg-[#e0f2fe] text-[#0369a1]' : 'hover:bg-[#f0f9ff]'}`}>{s.title}</button></li>
          ))}
        </ul>
      </div>
      <div>
        {!p.subject ? <p className="text-[#64748b]">Pick a subject to see its topics. Each topic: short lesson, a quick quiz, then a mixed quiz and a mock paper.</p> : (
          <>
            <h2 className="mb-2 font-semibold">{p.subject.title} topics</h2>
            <ul className="grid max-h-[50dvh] gap-1 overflow-y-auto sm:grid-cols-2">
              {p.subject.topics.map(t => (
                <li key={t.id}><button onClick={() => p.setTopicId(t.id)} aria-pressed={p.topicId === t.id} className={`${btn} w-full text-left ${p.topicId === t.id ? 'bg-[#0284c7] text-white' : 'border border-[#e2e8f0] hover:bg-[#f0f9ff]'}`}>{t.title}</button></li>
              ))}
            </ul>
            <button disabled={!p.topicId} onClick={p.onGo} className={`${primary} mt-3`}>Start lesson</button>
          </>
        )}
      </div>
    </div>
  )
}

function Learn(p: { subject: Subject; topicId: string; title: string; memorise: boolean; tone: Tone; age: string; onBack: () => void; onQuiz: () => void }) {
  const [msgs, setMsgs] = useState<{ role: 'bot' | 'me'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [cards, setCards] = useState<Card[] | null>(null)
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  const ask = async (message: string) => {
    setBusy(true); setMsgs(m => [...m, { role: 'me', text: message }])
    const r = await post<{ reply: string }>('/api/exam/tutor', { tone: p.tone, age: p.age, topic: `${p.subject.title}: ${p.title}`, message })
    setMsgs(m => [...m, { role: 'bot', text: r?.reply ?? 'I could not answer just now. Try again.' }]); setBusy(false)
  }
  const started = useRef(false)
  useEffect(() => { if (started.current) return; started.current = true; void ask(`Teach me ${p.title} step by step, then ask me one question to check I understood.`) /* eslint-disable-next-line */ }, [])
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [msgs])
  const loadCards = async () => setCards((await post<{ cards: Card[] }>('/api/exam/cards', { subjectId: p.subject.id, topicId: p.topicId }))?.cards ?? [])

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">{p.title}</h2>
        <div className="flex gap-2"><button onClick={p.onBack} className={ghost}>Back</button><button onClick={p.onQuiz} className={primary}>Quiz me on this</button></div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-[#f0f9ff] p-3" aria-live="polite">
        {msgs.map((m, k) => <p key={k} className={`mb-2 whitespace-pre-wrap rounded-xl p-2 text-sm ${m.role === 'bot' ? 'bg-white' : 'ml-8 bg-[#e0f2fe]'}`}>{m.text}</p>)}
        {busy && <p className="text-sm text-[#64748b]">Thinking…</p>}
        <div ref={end} />
      </div>
      <form onSubmit={e => { e.preventDefault(); if (input.trim() && !busy) { void ask(input.trim()); setInput('') } }} className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} maxLength={500} placeholder="Ask the robot a question" aria-label="Ask the robot" className="min-h-11 flex-1 rounded-xl border border-[#e2e8f0] px-3 text-sm" />
        <button disabled={busy} className={primary}>Ask</button>
      </form>
      {p.memorise && (
        <div className="rounded-xl border border-[#e2e8f0] p-3">
          {!cards ? <button onClick={loadCards} className={ghost}>Memorise cards</button> : !cards.length ? <p className="text-sm text-[#64748b]">No cards available right now.</p> : (
            <div className="flex items-center gap-2">
              <button onClick={() => setFlip(f => !f)} aria-label={flip ? 'Show front' : 'Show back'} className="flip relative h-24 flex-1 rounded-xl" style={{ transform: flip ? 'rotateY(180deg)' : undefined }}>
                <span className="face absolute inset-0 flex items-center justify-center rounded-xl bg-[#e0f2fe] p-2 text-sm font-medium">{cards[i].front}</span>
                <span className="face absolute inset-0 flex items-center justify-center rounded-xl bg-[#0284c7] p-2 text-sm font-medium text-white" style={{ transform: 'rotateY(180deg)' }}>{cards[i].back}</span>
              </button>
              <div className="flex flex-col gap-1">
                <button onClick={() => { setI(n => (n + 1) % cards.length); setFlip(false) }} className={ghost}>Again</button>
                <button onClick={() => { setI(n => (n + 1) % cards.length); setFlip(false) }} className={primary}>Got it</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Quiz(p: { scope: Scope; blueprintId: string; topics: string[]; minutes: number; onBack: () => void; onDone: (r: Result[]) => void }) {
  const plan = useMemo<Slot[]>(() => planQuiz(p.scope, p.blueprintId, p.topics), [p.scope, p.blueprintId, p.topics])
  const [n, setN] = useState(0)
  const [item, setItem] = useState<Pub | null>(null)
  const [ticket, setTicket] = useState('')
  const [answer, setAnswer] = useState('')
  const [marked, setMarked] = useState<Marked | null>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<Result[]>([])
  const [left, setLeft] = useState(p.minutes * 60)
  const done = useRef(false)

  const load = async (k: number) => {
    setItem(null); setMarked(null); setAnswer(''); setErr('')
    const r = await post<{ item: Pub; ticket: string }>('/api/exam/item', plan[k])
    if (!r) setErr('Could not build this question. Try again.'); else { setItem(r.item); setTicket(r.ticket) }
  }
  useEffect(() => { if (plan.length) void load(0) /* eslint-disable-next-line */ }, [])
  const finish = (r: Result[]) => { if (!done.current) { done.current = true; p.onDone(r) } }
  useEffect(() => {
    if (!p.minutes) return
    const t = setInterval(() => setLeft(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [p.minutes])
  useEffect(() => { if (p.minutes && left <= 0) finish(res) /* eslint-disable-next-line */ }, [left])

  const submit = async () => {
    if (!item) return
    setBusy(true)
    const r = await post<{ result: Marked }>('/api/exam/mark', { ticket, response: answer })
    setBusy(false)
    if (!r) return setErr('Marking failed. Try again.')
    setMarked(r.result); setErr('')
    setRes(x => [...x, { topic: item.topic, ao: item.ao, awarded: r.result.awarded, of: r.result.of, proposed: r.result.proposed }])
  }
  const next = () => { const k = n + 1; if (k >= plan.length) finish(res); else { setN(k); void load(k) } }

  if (!plan.length) return <p>No questions planned for this scope. <button className={ghost} onClick={p.onBack}>Back</button></p>
  const mm = String(Math.max(0, Math.floor(left / 60))), ss = String(Math.max(0, left % 60)).padStart(2, '0')
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col gap-3">
      <div className="flex items-center gap-3">
        <button onClick={p.onBack} className={ghost}>Back</button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e2e8f0]" role="progressbar" aria-valuemin={0} aria-valuemax={plan.length} aria-valuenow={n}>
          <div className="grow h-full bg-[#0284c7]" style={{ width: `${(n / plan.length) * 100}%` }} />
        </div>
        <span className="text-sm tabular-nums text-[#64748b]">{n + 1}/{plan.length}{p.minutes ? ` · ${mm}:${ss}` : ''}</span>
      </div>
      {err && <p role="alert" className="text-sm text-red-700">{err} <button onClick={() => (item ? submit() : load(n))} className={ghost}>Retry</button></p>}
      {!item && !err && <p className="text-[#64748b]">Building a question…</p>}
      {item && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="mb-1 text-xs text-[#64748b]">{item.ao} · {item.marks} mark{item.marks > 1 ? 's' : ''}</p>
          <p className="mb-3 whitespace-pre-wrap font-medium">{item.stem}</p>
          {item.type === 'mcq' ? (
            <div role="radiogroup" className="flex flex-col gap-2">
              {item.options?.map((o, k) => {
                const L = String.fromCharCode(65 + k)
                return <button key={L} role="radio" aria-checked={answer === L} disabled={!!marked} onClick={() => setAnswer(L)} className={`${btn} text-left ${answer === L ? 'bg-[#0284c7] text-white' : 'border border-[#e2e8f0] hover:bg-[#f0f9ff]'}`}>{L}. {o}</button>
              })}
            </div>
          ) : (
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} disabled={!!marked} rows={item.type === 'extended' ? 8 : 3} maxLength={4000} aria-label="Your answer" className="w-full rounded-xl border border-[#e2e8f0] p-3 text-sm" />
          )}
          {marked && (
            <p role="status" className="mt-3 rounded-xl bg-[#f0f9ff] p-3 text-sm">
              <strong>{marked.awarded}/{marked.of}</strong>{marked.proposed ? ' (proposed mark, not yet teacher-checked)' : ''}. {marked.feedback}
            </p>
          )}
        </div>
      )}
      {item && (
        <div className="flex justify-end">
          {!marked ? <button disabled={!answer.trim() || busy} onClick={submit} className={primary}>{busy ? 'Marking…' : 'Check answer'}</button>
            : <button onClick={next} className={primary}>{n + 1 >= plan.length ? 'See report' : 'Next'}</button>}
        </div>
      )}
    </div>
  )
}

function Report(p: { results: Result[]; subject: Subject; scope: Scope; covered: string[]; onNext: (s: Scope) => void; onHome: () => void }) {
  const rs = p.results
  const group = (k: 'topic' | 'ao') => {
    const m = new Map<string, [number, number]>()
    for (const r of rs) { const v = m.get(r[k]) ?? [0, 0]; m.set(r[k], [v[0] + r.awarded, v[1] + r.of]) }
    return [...m.entries()].map(([name, [a, o]]) => ({ name, a, o, pct: o ? Math.round((a / o) * 100) : 0 })).sort((x, y) => x.pct - y.pct)
  }
  const title = (id: string) => p.subject.topics.find(t => t.id === id)?.title ?? id
  const A = rs.reduce((s, r) => s + r.awarded, 0), O = rs.reduce((s, r) => s + r.of, 0)
  const byTopic = group('topic'), byAo = group('ao')
  const Bars = ({ rows, label }: { rows: ReturnType<typeof group>; label: (s: string) => string }) => (
    <ul className="flex flex-col gap-2">
      {rows.map(r => (
        <li key={r.name} className="text-sm">
          <div className="flex justify-between"><span>{label(r.name)}</span><span className="tabular-nums">{r.a}/{r.o}</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e2e8f0]"><div className="grow h-full bg-[#0284c7]" style={{ width: `${r.pct}%` }} /></div>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h2 className="text-xl font-bold">{A}/{O} marks{O ? ` · ${Math.round((A / O) * 100)}%` : ''}</h2>
      {rs.some(r => r.proposed) && <p className="text-sm text-[#64748b]">Extended answers show proposed marks until a teacher checks the marker.</p>}
      {rs.length > 0 && <div className="grid gap-4 md:grid-cols-2"><div><h3 className="mb-2 font-semibold">By topic</h3><Bars rows={byTopic} label={title} /></div><div><h3 className="mb-2 font-semibold">By skill (AO)</h3><Bars rows={byAo} label={s => s} /></div></div>}
      {byTopic[0] && <p className="rounded-xl bg-[#e0f2fe] p-3 text-sm">Learn next: <strong>{title(byTopic[0].name)}</strong> is your weakest topic here.</p>}
      <div className="noprint flex flex-wrap gap-2">
        <button onClick={() => p.onNext('topic')} className={ghost}>Back to lesson</button>
        <button onClick={() => p.onNext('sofar')} className={primary}>Quiz on what I have covered ({p.covered.length})</button>
        <button onClick={() => p.onNext('mock')} className={primary}>Full mock paper</button>
        <button onClick={() => window.print()} className={ghost}>Print report</button>
        <button onClick={p.onHome} className={ghost}>New topic</button>
      </div>
    </div>
  )
}
