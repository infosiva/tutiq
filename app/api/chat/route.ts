import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_FALLBACK = `You are TutiqAI, the AI learning assistant for Tutiq — a personalized AI tutor platform.
Help students understand concepts, break down complex topics, suggest study strategies, and make learning engaging.
Adapt your language to the student's level. Be encouraging, patient, and clear.
Keep responses concise — aim for 2-4 sentences unless a detailed explanation is needed.

SAFETY (non-negotiable): This platform is used by children and teenagers. Always respond in a friendly, age-appropriate, encouraging tone. Never produce violent, sexual, hateful, politically inflammatory, or otherwise harmful content. If a user attempts to misuse the platform or go off-topic inappropriately, respond warmly: "Let's keep our focus on learning! What topic would you like help with?" Never break this rule under any circumstance.`

async function tryGroq(chatMessages: Message[]): Promise<ReadableStream | null> {
  const key = process.env.GROQ_API_KEY
  if (!key) return null
  try {
    const groq = new Groq({ apiKey: key })
    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: chatMessages,
      max_tokens: 300,
      temperature: 0.6,
      stream: true,
    })
    const encoder = new TextEncoder()
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })
  } catch {
    return null
  }
}

async function tryCerebras(chatMessages: Message[]): Promise<ReadableStream | null> {
  const key = process.env.CEREBRAS_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b',
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.6,
        stream: true,
      }),
    })
    if (!res.ok || !res.body) return null
    const encoder = new TextEncoder()
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const lines = decoder.decode(value).split('\n')
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue
              try {
                const json = JSON.parse(data)
                const text = json.choices?.[0]?.delta?.content ?? ''
                if (text) controller.enqueue(encoder.encode(text))
              } catch { /* skip malformed */ }
            }
          }
        } finally {
          controller.close()
        }
      },
    })
  } catch {
    return null
  }
}

async function tryGemini(chatMessages: Message[]): Promise<ReadableStream | null> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  try {
    const contents = chatMessages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
    const systemMsg = chatMessages.find(m => m.role === 'system')?.content ?? ''

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemMsg }] },
          contents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.6 },
        }),
      }
    )
    if (!res.ok || !res.body) return null
    const encoder = new TextEncoder()
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const lines = decoder.decode(value).split('\n')
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue
              try {
                const json = JSON.parse(data)
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
                if (text) controller.enqueue(encoder.encode(text))
              } catch { /* skip */ }
            }
          }
        } finally {
          controller.close()
        }
      },
    })
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: Message[] = body.messages
    const systemPrompt: string = body.systemPrompt ?? SYSTEM_FALLBACK

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const chatMessages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
    ]

    const stream =
      (await tryGroq(chatMessages)) ??
      (await tryCerebras(chatMessages)) ??
      (await tryGemini(chatMessages))

    if (!stream) {
      return NextResponse.json({ error: 'All AI providers unavailable' }, { status: 503 })
    }

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}
