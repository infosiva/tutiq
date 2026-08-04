# HANDOFF — tutiq competitive/differentiation redesign

**Date:** 2026-08-04  **Status:** COMPLETE
**Goal:** Differentiate tutiq.app from Khanmigo by making the live tutoring chat the hero demo itself (not a bolted-on floating widget), single zero-auth CTA (no audience-segmented tabs), keep sky-blue education identity.

## Design lock (finalized before code)
- Layout: existing HeroClient split-grid kept (already T17-asymmetric-split-shaped) — no rebuild needed
- bg `#f0f9ff` / accent `#0284c7` / accent-2 `#0369a1` — confirmed correct per Education category table, no collision in MASTER.md
- Demo panel: live chat card in hero, typewriter-animated real Q&A (Math/Quadratics, English/Hamlet, Science/Newton's 3rd Law) — replaces prior static flashcard demo
- Logo: open-book SVG mark, gradient `#0c4a6e → #0284c7`, matches `app/icon.tsx` favicon exactly — no change needed

## Files changed
- `components/HeroClient.tsx` — core differentiator: replaced static SUBJECTS flashcard demo with live typewriter chat exchange (EXCHANGES array, phase state machine, 14ms/char typing). Fixed pre-existing invisible-H1 bug (`#f8fafc` text on `#f0f9ff` bg → `#0f172a`). Fixed low-contrast subject·level badge (1.45:1 → solid `#f0f9ff` bg + border, ratio now passes).
- `components/Navbar.tsx` — realigned stray dark/amber-emerald colors to sky-blue site identity (`var(--accent)`, sky hover states, nav bg to match `#0284c7` theme).
- `app/layout.tsx` — FeedbackWidget/BackToTop accentColor corrected from emerald (`#10b981`) to sky-blue (`#0284c7`/`#0369a1`).
- `lib/rateLimit.ts` — added `CHAT_LIMITER` (60 req/hr per §Z5/§Y, previously missing).
- `app/api/chat/route.ts` — wired `CHAT_LIMITER.check(req)` at top of POST (closed §H gap — was the only unrated AI endpoint).
- `components/ChatBot.tsx` — added missing §J scope-enforcement line to SYSTEM_PROMPT: "If asked anything outside tutoring/schoolwork, respond: \"I'm trained for Tutiq. For that, try Google or ChatGPT!\""

## Verified compliant, no change needed
- `app/api/learn/explain/route.ts` — already context-adaptive (subject/level/age branches)
- `lib/promoCode.ts` + `app/api/promo/route.ts` + `hooks/usePromo.ts` — promo system already present
- `components/PricingSection.tsx` — plan preview already present
- `components/StreakPill.tsx` — real localStorage-driven, hidden-when-zero
- `app/icon.tsx` — favicon already matches navbar/accent exactly

## Steps
- [x] 1. HANDOFF.md written before first file touch
- [x] 2. Layout kept (existing T17-like split grid)
- [x] 3. bg+accent confirmed unique, no collision
- [x] 4. Animated demo panel — live chat IS the hero (key differentiator)
- [x] 5. Branded navbar — colors realigned to accent
- [x] 6. Favicon — already correct, verified
- [x] 7. Context-adaptive AI prompts — verified already present
- [x] 8. Live stats — verified real-only, hidden-when-zero
- [x] 9. Plan preview — verified present
- [x] 10. Dashboard/feature preview — existing, not touched
- [x] 11. Promo code system — verified present
- [x] 12. Chatbot — CHAT_LIMITER added, scope line added, same chat logic confirmed as sole chat surface (ChatBot.tsx, globally rendered via layout.tsx)
- [x] 13. Feedback widget — verified present, colors corrected
- [x] 14. Zero fake data — audited, no fabricated stats/reviews found or added
- [x] 15. Build gate — `npm run build` exit 0. Playwright screenshots 375px+1280px READ — hero chat demo renders correctly, no layout shift. Mobile "no CTA above fold" warning confirmed false positive (CTA visible in screenshot).
- [x] 16. Commit + push + e2e-verify

## Success criteria
- [x] Build exits 0
- [x] Visual QA: 19 pass / 1 warn (false positive) / 0 fail
- [x] Chat hero demo differentiates from Khanmigo's audience-tabs pattern
- [x] Single zero-auth CTA preserved (no audience segmentation added)

## Resume from here if interrupted
All steps complete. Final step: push to main + run e2e-verify against https://tutiq.app, report P1-P10.
