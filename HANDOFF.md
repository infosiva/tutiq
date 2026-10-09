# HANDOFF — tutiq 11+ and GCSE: teach, then examine like the real papers
**Date:** 2026-10-09  **Status:** IN PROGRESS (planning done, no code yet)
**Goal:** 11+ (GL and CEM) and GCSE (Maths, English Language, Science, History/Geography) lessons, then mock exams in real paper format, marked, with a per-topic report.

## Owner decisions (2026-10-09)
- Scope: 11+ and GCSE only. Years 1-6 teaching and A-level are out of scope for now.
- 11+ boards: GL and CEM both, as separate templates.
- GCSE subjects: Maths, English Language, Combined/Triple Science, History/Geography.
- Questions DYNAMICALLY DRIVEN (owner, mid-session): generated per request from a blueprint (board, tier, topic, difficulty, AO, marks), not a hand-written fixed list. Each generated question is validated (answer/mark-scheme check, dedupe) and stored so the same item can be re-marked and reported on. Step 4 changes from "reviewed static bank" to "blueprint-driven generator + validator + store".
- FULL COVERAGE (owner): 11+ and GCSE must cover the whole syllabus per subject/paper (every topic in the curriculum map gets a lesson + questions), not a sample. Coverage matrix (topic x lesson x question types) is a success criterion.
- Papers viewable + downloadable (owner): generated mock papers render as a printable paper (questions, marks, mark scheme/answers) with PDF/print download. Original generated papers only. Real board past papers (AQA/Edexcel/OCR, GL/CEM) are copyright: LINK OUT to the official board pages, do not host copies. Owner-blocked: any licence to host real papers.
- MEMORISE module (owner): word and fact memorisation with spaced repetition (flashcards, recall tests, due-today queue). 11+: VR word lists (synonyms, antonyms, odd-one-out, word meanings, spelling, NVR rule/pattern vocabulary), English vocab. GCSE: Maths formulae and definitions, Science key terms and equations, History dates/terms, Geography terms, English Lang techniques and quotes vocab. Cards generated dynamically per topic, progress stored.
- DESIGN SOURCE (owner): use the production-gate design and the dashboard component already designed in Claude (beta design) with Motion. Reuse via `ds-source` (agents/design-system) before building anything new; find the dashboard component there first. Motion = framer-motion, allowed only for springs/gestures/layout transitions, rest CSS, honour reduced-motion. Open: locate the specific dashboard component/file (owner to point if not in design-system).
- ALL SKILLS AND TOOLS (owner): run the full stack, no skips: ds-source, frontend-design, impeccable, ui-ux-pro-max, taste-skill, emil-design-eng, animate, fixing-accessibility, apple-audit, karpathy-guidelines, orchestrator for offloadable sub-steps, Jev for bounded picks, agency-agents per phase, Playwright, security gate.
- DEFAULT UI/MOTION STACK (owner, mid-session): `ui-ux-pro-max`, `taste-skill`, `emil-design-eng`, `animate`, `ui-animation`/`review-animations`, framer-motion (Motion), `fixing-accessibility` run by default on every UI step of this project, no reminder needed. Loaded 2026-10-09.
- PIPELINES (owner: "agentic pipeline or data pipeline"): build as an explicit staged DATA PIPELINE with an AGENTIC repair loop where it earns its place. Stages: 1 blueprint -> 2 generate -> 3 validate (second model + rule checks: answer present, marks sum, no duplicates, reading level) -> 4 repair loop (agent: critic rewrites failed items, max 2 retries, then drop) -> 5 store -> 6 serve paper -> 7 mark -> 8 report -> 9 eval feedback (marker vs hand-marked set). Jev chose plain pipeline for retrieval (0.95); the agentic part is limited to stage 4 and calibration, not retrieval. Each stage logs counts (generated, passed, repaired, dropped) for observability.
- Dashboard: DEFERRED (owner: "dashboard later on"). Build only the end-of-paper report now; no learner/parent dashboard, no trend views.
- END-TO-END FOR ANYONE (owner): "this time the site should give anyone start to end from teaching and validating in a sensible way". One unbroken journey: pick exam/subject -> diagnostic -> robo-taught lesson -> practice -> timed paper -> marked report -> what to learn next. No dead ends; every step has Back + Continue.
- ROBO TEACHER (owner): "even the teaching we can try some robo teaching the lesson like a real class room teaching". Step 5 is an AI-led classroom lesson: objective -> board explanation -> worked example -> guided practice with hint ladder -> check questions with live responses -> recap -> exit ticket. Lesson is generated from the curriculum topic + blueprint, validated like questions, stored, then replayed.
- MODERNISATION (owner: "see what modernisation we can build here using modern AI tools"). Candidates, all free tier, all through ai-core / browser APIs, nothing paid:
  1. Streaming tutor turns (AI SDK style SSE on Node runtime) so the teacher "speaks" as it generates.
  2. Structured outputs (JSON schema) for lessons/questions/mark schemes: no free-text parsing.
  3. Voice: browser SpeechSynthesis (teacher talks) + SpeechRecognition (learner answers aloud); reuse `lib/useVoiceFeedback.ts`, `lib/useVoiceInput.ts`. Fallback to text.
  4. Socratic hint ladder (nudge -> clue -> worked step -> answer) instead of instant answers.
  5. Adaptive difficulty + mastery tracking (Elo/Leitner per topic; plain maths, NOT an LLM) to pick the next question.
  6. Vision marking of photographed working (Gemini free vision) for GCSE Maths: PROPOSAL only, labelled, calibration first.
  7. LLM-as-judge validator with a different model + rule checks (already in pipeline).
  8. CHILD-SAFETY MODERATION (the other reading of "moderisation"): input + output moderation on every learner-facing AI turn (free classifier: Llama Guard via Groq free tier or similar, plus a topic allow-list so the teacher stays on syllabus), block PII in prompts, log blocks without text. Needed because learners are 10-16.
  9. Evals in CI: golden set for validator pass-rate and marker agreement.
  Not adopting: paid TTS/avatar video, fal.ai, any pay-per-use API.
- Under-13 block: KEEP. OPEN CONFLICT: 11+ learners are 10-11. Until the owner changes this, 11+ is built for an adult (parent) account that selects a learner year group. No child sign-up is built.

## Evidence (research 2026-10-09, sources in the chat transcript)
- GL: four separate multiple-choice papers (English, VR, NVR, Maths), ~50-80 questions, 50-60 min. CEM: mixed question types inside each timed section, format changes yearly. Areas vary.
- GCSE Maths: 3 x 1h30 papers (1 non-calc, 2 calc), AQA/Edexcel 80 marks each, OCR 100. Foundation grades 1-5, Higher 4-9. AO1/AO2/AO3 weights.
- Extended answers (6+ marks) are levels-marked. AI is reliable on point-based marking, weak on "how good" and borderline bands. Only accuracy figure found: vendor claim, 86.6% on 12 scripts. UNPROVEN.
- Competitors: Seneca (~8-18, free parent view), Sparx (11-16, school only), Atom (Y3-6 11+). None teaches and examines 11+ and GCSE together with a parent report. Demand is a hypothesis, no buyer-side evidence yet.

## Today's gaps (file:line)
- `app/api/learn/mock-exam/route.ts` one-shot LLM prompt, 10 questions, no board/tier/blueprint, nothing stored.
- `app/learn/[topicId]/mock-exam/page.tsx:112-126` exact-match / substring marking. Open answers can score by typing a fragment.
- `mock-exam/page.tsx:147` grade claim from raw percent. Remove.
- `app/api/learn/quiz/route.ts` fresh AI quiz each time, unchecked.
- Profile in localStorage only.

## AI-platform design block (fill BEFORE coding, per global rule)
- [x] (a) PLAIN PIPELINE (Jev 0.95): blueprint -> generate -> validate -> store -> mark. No agent loop; fixed steps.
- [x] (b) NEITHER graph nor vector yet: curriculum is a flat tree, no multi-hop questions. Revisit vector only if lesson text is retrieved from uploaded material. Golden-set proof required first.
- [ ] (c) prompt design and context budget: per-question prompt = blueprint row + AO + mark-scheme style + 2 style exemplars; no whole-syllabus stuffing. Token numbers to be measured.
- [ ] (d) model per step: generate = free chain (Groq/Gemini), validate = second different model (independent check), extended-answer marking = strongest free model + human-calibrated set. Exact IDs after calibration.
- Research status 2026-10-09 (second pass): web fetches of GL/CEM guides came back garbled. Only fragments seen: GL "50 in 50" and "80 in 60" (matches earlier), CEM "quicker pace", analogies/codes/non-verbal. Format numbers stay UNVERIFIED; blueprints must be stored as editable config, not hardcoded, and checked against each board's own page before release.
- [x] ai-core usage (owner: "from ai core"): all LLM calls (generate, validate, repair, mark) go through the ai-core gateway (`https://api.prismlane.app`, SDK `ai-core/sdk/typescript`, aliases core-chat / core-chat-2..5), server-side only, tenant key never in the browser. Replaces tutiq `lib/ai.ts` direct provider calls for exam features. Tracing via ai-core Phoenix spans (no query/answer text recorded). RAG (`rag_api`, fastembed bge-small) ONLY if lesson material is uploaded/retrieved; not needed for blueprint generation. ai-core Memory is LLM-extracted facts (14-23 s with infer=true), so it is NOT used for spaced-repetition scheduling; Leitner box state lives in tutiq's own DB table.
  - Known gaps to state, not fake: ai-core reachability from Vercel unverified; tutiq needs a tenant key (owner-blocked until issued); eval/golden-set tooling lives in `ai-core/evals`, marker calibration set must be added there; pillars 10-13 not built.
- [x] Dashboard component found: `DashboardShell` + `DashPanel` in design-system COMPONENTS.md (pilot invoicemint /profile). Reuse for the end-of-paper report layout now; full dashboard stays deferred.
- [x] Pillars (evidence due before "done"): gateway=ai-core; routing=core-chat..5 aliases; cost=free aliases only, stored items reused (generate once, serve many); RAG=exempt (plain pipeline); observability=per-stage counts + ai-core traces; evals=marker vs hand-marked set + validator pass-rate; limits=per-IP/learner limits on generate+mark routes; monitoring=stage counts logged; swappability=all calls via one `lib/exam/llm.ts` wrapper over ai-core.
- [x] ANIMATED SCOPE: (1) paper-to-report transition: framer-motion layout transition, on submit, reduced-motion = instant swap. (2) flashcard flip: CSS 3D transform, on tap/Enter, reduced-motion = crossfade. (3) timer bar + topic score bars: CSS width transition on mount, reduced-motion = static. Nothing else moves.
- [x] Agents per phase (max 3): research=Trend Researcher (done inline); plan=Software Architect; build=Backend Architect + Frontend Developer; review=Code Reviewer + Model QA Specialist (marker calibration); QA=Evidence Collector + Reality Checker; a11y=Accessibility Auditor.

## Steps
- [x] 1. Design lock + the block above (c)/(d) settled: per-item prompt = blueprint row + AO + mark-scheme style + 2 exemplars; generate=core-chat, validate=core-chat-2 (different model), marking=core-chat + calibration
- [x] 2. Curriculum map: stage -> subject -> topic (11+ and GCSE)
- [x] 3. Paper blueprints: `lib/exam/blueprints.ts` (29 blueprints, all `verified:false`), `lib/exam/blueprints.check.ts` passes
- [ ] 4. Dynamic question generator driven by blueprint + validator (answer check, mark scheme, dedupe) + store of generated items (topic, difficulty, AO, marks)
- [ ] 4b. Paper view + print/PDF download (paper + mark scheme); official past-paper link-outs per board
- [ ] 4c. Memorise module: card generator, spaced-repetition scheduler (Leitner boxes), recall test, due queue, per-subject word/fact sets (11+ VR/NVR/English, GCSE subjects)
- [ ] 4d. Coverage matrix: every curriculum topic has lesson, questions, memorise set
- [ ] 4e. Safety moderation wrapper `lib/exam/moderate.ts` (input + output, topic allow-list, no PII), used by every learner-facing AI call
- [ ] 5. ROBO TEACHER lesson per topic: generated structured lesson script (objective, board steps, worked example, guided practice w/ hint ladder, check questions w/ responses, recap, exit ticket); streamed + optional voice; flows straight into practice then the timed paper
- [ ] 5b. Adaptive next-question picker (Elo/Leitner, no LLM) + diagnostic to place the learner
- [ ] 5c. Journey wiring: pick -> diagnostic -> lesson -> practice -> paper -> report -> next topic; Back/Continue everywhere
- ANIMATED SCOPE (lesson, added): (4) board reveal: each board step fades/translates in (opacity + translateY 8px, 180ms ease-out, 50ms stagger) when the teacher reaches it; reduced-motion = instant. (5) "teacher speaking" indicator: opacity pulse only while audio plays; reduced-motion = static dot. Nothing else moves.
- [x] 6. (code done 2026-10-09, lib/exam/marker.ts + app/api/exam/mark; untested live, extended = proposed only) Marker: MCQ exact; short answer rubric points; extended = proposed band + "what's missing", labelled a proposal
- [ ] 7. Calibrate marker on hand-marked answers before showing any band
- [ ] 8. Persist profile + attempts (not localStorage)
- [ ] 9. End-of-paper report only (by topic and AO, time, what to learn next); no raw-percent grade claims. Dashboard + parent report + trends DEFERRED.
- [ ] 10. UI skill stack, 375 + 1280, fit-in-viewport
- [ ] 11. E2E click-test of full journey on live URL, Continue and Back at each step
- [ ] 12. Prod gate, security gate, then push (only after all todos done or owner-blocked)

## Success criteria
- A learner picks 11+ (GL or CEM) or a GCSE subject/board/tier, is taught a topic, sits a timed paper matching the blueprint, and gets a marked report by topic and AO. Values read back in the UI and the saved record.
- Marker agreement with hand-marked set measured and recorded.

## Owner-blocked / open
- Under-13 access (see above).
- Rights to use real past-paper content: default is original questions only.
- UK GDPR / Children's Code review before any child data is stored.

## Resume from here if interrupted
Steps 1, 3 done (curriculum drafted, specs unverified). Next: read `node_modules/next/dist/docs/` for route handler/streaming rules, then step 4 `lib/exam/llm.ts` (ai-core wrapper) + `moderate.ts` + generator/validator/repair/store. Wake-up cron: ef94696c.

## Resume (2026-10-09 later)
Done: lib/exam/llm.ts (ai-core via AI_CORE_URL/AI_CORE_KEY, fallback lib/ai.ts; api.prismlane.app/v1/models = 404 and no tenant key in tutiq env => OWNER-BLOCKED: expose /v1/chat/completions + issue tenant key), lib/exam/moderate.ts (4e partial). tsc clean on lib/exam.
Also done: marker.ts + /api/exam/mark (step 6 code). Also done: lib/exam/generator.ts (generate->validate->repair once, in-memory cache), app/api/exam/item/route.ts (answer withheld, rate limited, blueprint-checked). tsc clean; NOT yet run against a live model (no key reachable). Next: paper assembly + print (4b), memorise (4c), curriculum map (2), persistence (8), then UI 10-12. Owner: continue autonomously, review at end, wake-up cron ef94696c.

## Resume (autocompact-thrash checkpoint 2026-10-09)
Done: steps 1, 3 (29 blueprints, check passes), owner reqs recorded (end-to-end journey, robo teacher, modernisation + safety moderation).
Next: (1) read node_modules/next/dist/docs/ route-handler + streaming ONLY (Read offset/limit <=150, no ls dump); (2) step 4: lib/exam/llm.ts, moderate.ts, generator/validator/repair/store.
Context hygiene: do NOT re-read curriculum.ts/blueprints.ts in full (summarised in this file); do not reload skills; redirect big output to scratchpad and grep it.
Wake-up cron: ef94696c (session-only; re-create if gone).

## Resume (2026-10-09 research+tooling pass)
- [x] Step 2 curriculum: lib/curriculum.ts covers all 29 blueprint topics (script check: 0 missing, 9 subjects).
- [x] Research: docs/learning-science.md (Dunlosky + Bastani verified from raw PDF text; EEF/Kestin/FSRS-gain marked unverified). Implication: retrieval+spacing, guarded AI, report on unassisted results.
- [x] 5b core: lib/exam/adaptive.ts now FSRS via ts-fsrs (installed, MIT, free) + Elo topic picker; self-check passes.
- [x] Step 7 harness: ai-core/evals/exam_marker_calibration.py (QWK>=0.7, n>=30 gate, selftest ok). OWNER-BLOCKED: hand-marked answer set (>=30 rows).
- Tooling decision (Jev 0.83): python scripts in ai-core/evals, NO FastAPI service for tutiq. Agent SDK: not needed (plain pipeline decided). NotebookLM: no official API; unofficial client rejected (ToS/auth); source-grounded study = ai-core RAG.
- Next: 4b paper+print view, 4c card generator + flashcard flip, 4d coverage matrix, 4e wire moderation on learner input, 5 lesson script, 8 persistence, 9 report, 10-12 UI/QA/gates.

## Owner additions (2026-10-09, mid-session)
- Journey: topic explanation -> topic quiz -> "so far" quiz (interleaved over covered topics) -> full 11+ mock exam-style paper. Plan code: `lib/exam/quizPlan.ts` (`planQuiz('topic'|'sofar'|'mock')`), done as code, untested live.
- Robo teaching assistant, learner-selectable tone (friendly/calm/playful/strict/concise): `lib/exam/tutor.ts`. Tone changes voice only; guard rules (hint first, attempt first, no answers to live test questions) stay fixed. Still TODO: chat route + UI tone picker (step 5/10).
- Coverage 4d DONE (LESSON_ONLY in coverage.check.ts, extended writing unmarked until calibration): 4 topics have no blueprint questions (gcse-english-language reading-nonfiction, transactional-writing, spag-gcse; gcse-history key-dates-terms). Still to decide: add to blueprint sections or mark lesson/memorise-only.

## Resume (2026-10-09 cron pass 2)
- [x] quizPlan + tutor selfchecks pass; `app/api/exam/tutor/route.ts` added (tone, moderated, guarded; untested live).
- Resume at: 4d decision (4 uncovered topics), 4b paper/print, 8 persistence, 9 report, 10 UI (tone picker, quiz steps), 11 click-test.
- [x] 4d done: coverage now 0 gaps (26 memorise topics). 4e covered (item route allowlists blueprint/topic; marker + tutor moderate learner text).
- Resume at: 4b paper/print view, 8 persistence (needs store pick: Supabase vs ai-core), 9 report, 10 UI (tone picker, topic/sofar/mock quiz steps, flashcard flip), 11 click-test. Cron ef94696c stays on.

## Decisions + scope (2026-10-09, cron pass 3)
- Persistence: sealed AES-GCM ticket (lib/exam/ticket.ts) carries item+answer to the client; mark route opens it. Needs env `EXAM_TICKET_SECRET` on Vercel (owner).
- Learner profile: anonymous per-device client state only (no PII). Server-side child data is blocked on UK GDPR / Children's Code review. Deviation from "not localStorage": flagged for owner.
- Push authorised by owner AT THE END, after all todos done or owner-blocked.
- ai-core: exempt for now (tenant key + public /v1/chat/completions owner-blocked); lib/exam/llm.ts falls back to lib/ai.ts.
- Agents per phase: research=deep-research skill; build=inline; review=ecc:typescript-reviewer; QA=Playwright; a11y=fixing-accessibility.
- ANIMATED SCOPE: (1) step transitions: 180ms fade/translate on step change, trigger = step change; (2) flashcard flip: CSS 3D rotateY 350ms, trigger = tap/Enter; (3) progress bar width ease 300ms, trigger = answer marked; (4) report bars grow once on mount. Why: orient the learner, show cause/effect. Reduced-motion: all transforms/transitions off, instant swap, flip becomes front/back toggle.

## Progress (cron pass 4)
- [x] app/exam/page.tsx written (pick/learn/quiz/report, tone picker, flashcards, print CSS); filtered tsc clean.
- Resume: run dev, click-test /exam at 375+1280 (needs live model for items), then gates, commit by name, push, e2e-verify, CronDelete ef94696c, owner TODO list.
