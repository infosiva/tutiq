'use client'
import { useEffect, useState, type ReactNode } from 'react'

export interface Crumb { label: string; href?: string; go?: () => void }

/** Frozen context bar for every project: glass, sticky, breadcrumb + slot + scroll-progress hairline.
 *  Colours come from CSS vars (--crumb-bg/ink/muted/accent/line) so each site keeps its own palette; AA defaults. */
export function StickyCrumb({ crumbs, homeHref = '/', scrollRef, children }: {
  crumbs: Crumb[]; homeHref?: string; scrollRef?: React.RefObject<HTMLElement | null>; children?: ReactNode
}) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = scrollRef?.current ?? null
    const on = () => {
      const t = el ?? document.documentElement
      const max = t.scrollHeight - t.clientHeight
      setP(max > 0 ? Math.min(1, (el ? el.scrollTop : window.scrollY) / max) : 0)
    }
    const tgt: HTMLElement | Window = el ?? window
    tgt.addEventListener('scroll', on, { passive: true }); on()
    return () => tgt.removeEventListener('scroll', on)
  }, [scrollRef])
  const link = 'rounded px-1 py-2 hover:text-[var(--crumb-accent,#0369a1)] focus-visible:outline-2 focus-visible:outline-[var(--crumb-accent,#0369a1)]'
  return (
    <header className="noprint sticky top-0 z-10 flex flex-col gap-2 overflow-hidden rounded-2xl border px-3 py-2 backdrop-blur"
      style={{ background: 'var(--crumb-bg, rgba(255,255,255,.85))', borderColor: 'var(--crumb-line, #e2e8f0)' }}>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-1 text-sm" style={{ color: 'var(--crumb-muted, #64748b)' }}>
          <li><a href={homeHref} className={link}>Home</a></li>
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1
            return (
              <li key={c.label} className="flex items-center gap-1">
                <span aria-hidden style={{ opacity: 1 }}>/</span>
                {last ? <span aria-current="page" className="px-1 font-semibold" style={{ color: 'var(--crumb-ink, #0f172a)' }}>{c.label}</span>
                  : c.go ? <button onClick={c.go} className={link}>{c.label}</button>
                  : <a href={c.href ?? '#'} className={link}>{c.label}</a>}
              </li>
            )
          })}
        </ol>
      </nav>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left motion-reduce:hidden"
        style={{ background: 'var(--crumb-accent, #0369a1)', transform: `scaleX(${p})`, transition: 'transform .12s linear' }} />
    </header>
  )
}
