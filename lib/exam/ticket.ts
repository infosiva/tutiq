// Stateless item persistence: the full item (incl. answer + mark scheme) travels to the client as an AES-GCM
// ticket it cannot read or alter, so marking works on any serverless instance. Key: EXAM_TICKET_SECRET.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import type { Item } from './generator'

let devKey: Buffer | undefined
function key(): Buffer {
  const s = process.env.EXAM_TICKET_SECRET
  if (s) return createHash('sha256').update(s).digest()
  if (process.env.NODE_ENV === 'production') throw new Error('EXAM_TICKET_SECRET not set')
  return (devKey ??= randomBytes(32)) // dev only: tickets die with the process
}

export function sealItem(item: Item): string {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', key(), iv)
  const enc = Buffer.concat([c.update(JSON.stringify(item), 'utf8'), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64url')
}

export function openItem(ticket: string): Item | null {
  try {
    const b = Buffer.from(ticket, 'base64url')
    const d = createDecipheriv('aes-256-gcm', key(), b.subarray(0, 12))
    d.setAuthTag(b.subarray(12, 28))
    return JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8')) as Item
  } catch { return null }
}

export function ticketDemo() {
  const it = { id: 'x', type: 'mcq', topic: 't', ao: 'AO1', marks: 1, stem: 's', answer: 'B', markScheme: [], difficulty: 1 } as Item
  const t = sealItem(it)
  console.assert(openItem(t)?.answer === 'B', 'roundtrip')
  console.assert(openItem(t.slice(0, -4) + 'AAAA') === null, 'tamper rejected')
}
