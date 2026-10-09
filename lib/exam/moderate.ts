// Safety wrapper for a child-facing product. Cheap deterministic screen on learner input
// and on generated output. No text is logged; callers log only the verdict.
const BLOCK = [
  /\b(suicid|kill myself|self[- ]?harm|cut myself)\b/i,
  /\b(porn|nude|sex(ual)?|nsfw)\b/i,
  /\b(bomb[- ]?making|how to (make|build) (a )?(bomb|weapon))\b/i,
  /\b(my (address|phone|password)|\d{10,})\b/i, // personal data a child may type
]

export type Verdict = { ok: true } | { ok: false; reason: 'unsafe' | 'personal-data' | 'too-long' }

export function moderate(text: string, maxLen = 4000): Verdict {
  if (text.length > maxLen) return { ok: false, reason: 'too-long' }
  for (const re of BLOCK) {
    if (re.test(text)) return { ok: false, reason: re.source.includes('address') ? 'personal-data' : 'unsafe' }
  }
  return { ok: true }
}

export function moderateDemo() {
  console.assert(moderate('What is 3/4 + 1/8?').ok, 'maths passes')
  console.assert(!moderate('call me 07123456789').ok, 'phone blocked')
  console.assert(!moderate('x'.repeat(5000)).ok, 'long blocked')
}
