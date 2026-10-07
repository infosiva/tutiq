# DESIGN.md - TutIQ

Source of truth: `agents/design-system` (MASTER.md, `ds-source` skill). Reuse from there before building; new reusable pieces go there first.

## Identity
- Product: TutIQ (AI tutor)
- Accent: `#0284c7` (unique in the portfolio per `design-system/scripts/check-palettes.mjs`; kept from the existing design)
- Base background: `#f0f9ff`
- Logo: `components/Logo.tsx` (glyph + wordmark, key word in `var(--accent)`), used in the header; favicon is `app/icon.svg` (no `icon.tsx`).
- Background: `components/AnimatedBg.tsx` mounted in `app/layout.tsx`; style comes from the hub (`layout.bgAnimation`, `bgSpeed`), default `mesh`.

## Hub override
Hub (Edge Config `theme_tutiq.design`) customises dials, brief, palette, GA4 and flags with no code change; hub values win over this file. Theme is loaded via `lib/theme-loader.ts` in `app/layout.tsx`.

## AI platform (ai-core)
GAP, not yet on ai-core: study material upload (app/api/study/upload) and tutor answers use the app's own lib/ai.ts chain. Per the AI platform standard this should move to ai-core (upload-token + RAG, api.prismlane.app); tracked as an open item, not faked.
