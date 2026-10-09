# tutiq learning-science notes (2026-10-09)
Verified = quote read in raw text. Unverified = secondary/blog, re-check before relying.

## Verified
- Dunlosky et al. 2013 (Psych Sci Public Interest, 10.1177/1529100612453266; PDF whz.de copy): "Practice testing and distributed practice received high utility assessments"; elaborative interrogation, self-explanation, interleaved practice moderate; summarization, highlighting, keyword mnemonic, imagery, rereading LOW.
- Bastani et al. "Generative AI Can Harm Learning" (SSRN 4895486; PNAS 2025 version): unguarded GPT-4 +48% on practice, -17% on unassisted exam; guarded tutor +127% practice, harm largely removed, no exam gain.

## Unverified (secondary, fetch primary before citing)
- EEF Toolkit metacognition/self-regulation ~ +8 months (site 403'd; search snippet only). EEF: teach strategies inside subject content.
- Kestin et al. 2025 Sci Rep: AI tutor built on pedagogy beat in-class active learning (Harvard physics, one course; effect may be setting-specific).
- FSRS ~20-30% fewer reviews than SM-2 at equal retention: simulation, blog-repeated. Primary = open-spaced-repetition benchmark repo. Under ~1000 reviews FSRS ~ SM-2 (defaults). Leitner: no per-item adaptation.

## Design implications
1. Memorise + practice = retrieval (answer before reveal) and spacing. Never "reread" or "highlight" modes.
2. Mix topics in papers/practice (interleaving, moderate) - blueprint sections already mix.
3. AI help must be guarded: lesson/hints never give the answer before an attempt; marker shows mark-scheme points after attempt. Measure unassisted performance, not practice score.
4. Report shows unassisted paper results by topic/AO, not engagement.
5. Scheduler: ts-fsrs (installed, MIT, free) with default params; Leitner stays only as fallback. Optimise params offline once >1000 reviews/user cohort.
6. NotebookLM-style source-grounded study = ai-core RAG (upload -> grounded cards/quiz). No unofficial NotebookLM client (Google ToS/auth risk).
