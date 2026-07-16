import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'

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

let _groq: Groq | null = null
function getGroq() {
  if (!process.env.GROQ_API_KEY) return null
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return _groq
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

    const encoder = new TextEncoder()
    const groq = getGroq()

    let groqStream: Awaited<ReturnType<Groq['chat']['completions']['create']>> | null = null
    if (groq) {
      try {
        groqStream = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: chatMessages,
          max_tokens: 300,
          temperature: 0.6,
          stream: true,
        })
      } catch (err) {
        console.warn('[/api/chat] Groq failed, falling back to cascade', err)
        groqStream = null
      }
    }

    if (groqStream) {
      const stream = groqStream
      const readable = new ReadableStream({
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
      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      })
    }

    // Groq unavailable — fall back to full Groq→Gemini→Claude cascade (non-streaming)
    const text = await aiChat(
      messages
        .filter((m): m is Message & { role: 'user' | 'assistant' } => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content })),
      systemPrompt,
      300,
    )
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      },
    })
    return new NextResponse(readable, {
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
