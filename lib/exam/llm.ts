// Single entry point for every exam-feature LLM call (generate, validate, repair, mark).
// Server-side only. Prefers ai-core (OpenAI-compatible, alias per step); falls back to lib/ai.ts
// when AI_CORE_URL / AI_CORE_KEY are unset (tenant key is owner-blocked, see HANDOFF.md).
import { callAI } from '@/lib/ai'

export type ExamStep = 'generate' | 'validate' | 'repair' | 'mark'

// Different alias for validate so the independent check is a different model than generate.
const ALIAS: Record<ExamStep, string> = {
  generate: 'core-chat',
  validate: 'core-chat-2',
  repair: 'core-chat',
  mark: 'core-chat',
}

export interface LlmResult { text: string; via: 'ai-core' | 'fallback-chain'; model: string }

export async function examLlm(step: ExamStep, system: string, user: string, maxTokens = 900): Promise<LlmResult> {
  const base = process.env.AI_CORE_URL
  const key = process.env.AI_CORE_KEY
  if (base && key) {
    try {
      const res = await fetch(`${base.replace(/\/$/, '')}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: ALIAS[step],
          max_tokens: maxTokens,
          temperature: step === 'mark' || step === 'validate' ? 0 : 0.7,
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        }),
        signal: AbortSignal.timeout(30_000),
      })
      if (res.ok) {
        const j = await res.json() as { choices?: Array<{ message?: { content?: string } }>; model?: string }
        const text = j.choices?.[0]?.message?.content ?? ''
        if (text) return { text, via: 'ai-core', model: j.model ?? ALIAS[step] }
      }
      console.warn(`[exam-llm] ai-core ${step} status ${res.status}, falling back`)
    } catch (e) {
      console.warn(`[exam-llm] ai-core ${step} error, falling back: ${(e as Error).message.slice(0, 80)}`)
    }
  }
  // ponytail: fallback cannot pin a different model for validate; ai-core path does. Remove once the tenant key lands.
  const r = await callAI(system, [{ role: 'user', content: user }], maxTokens, step === 'mark' ? 'best' : 'balanced', step === 'mark' ? 'reasoning' : 'chat')
  return { text: r.text, via: 'fallback-chain', model: `${r.provider}/${r.model}` }
}
