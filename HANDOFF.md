# HANDOFF — tutiq competitor research: live demo + streak + SEO pages
**Date:** 2026-05-29  **Status:** IN PROGRESS
**Goal:** Update hero copy, animated conversation demo, streak pill, 3 SEO landing pages

## Files to touch
- `site.config.ts` — headline, subheadline, chatbot welcomeMessage
- `components/HeroClient.tsx` — animated conversation demo panel (desktop right side)
- `components/StreakPill.tsx` — new: localStorage streak counter pill
- `components/Navbar.tsx` — wire StreakPill between nav links and CTA
- `app/gcse-maths-tutor/page.tsx` — new SEO page
- `app/11-plus-preparation/page.tsx` — new SEO page
- `app/a-level-biology-revision/page.tsx` — new SEO page
- `app/sitemap.ts` — add 3 new routes

## Steps
- [ ] 1. Update site.config.ts
- [ ] 2. Add demo panel to HeroClient.tsx
- [ ] 3. Create StreakPill.tsx
- [ ] 4. Wire StreakPill into Navbar.tsx
- [ ] 5. Create 3 SEO landing pages
- [ ] 6. Update sitemap.ts
- [ ] 7. npm run build — fix TS errors
- [ ] 8. Commit

## Success criteria
- npm run build passes
- Hero shows updated copy + animated demo on desktop
- Navbar shows streak pill
- 3 SEO pages with keyword metadata exist
- Sitemap includes 3 new routes

## Resume from here if interrupted
Starting step 1.
