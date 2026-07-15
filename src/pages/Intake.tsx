import { useRef, useState, useEffect } from 'react'
import { VerificationSeal } from '../components/VerificationSeal'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const OPENING: Message = {
  role: 'assistant',
  content:
    "Tell me what you're noticing — an app you don't remember installing, your battery acting strange, someone knowing things they shouldn't. Take your time, and share only what feels okay to share.",
}

export function Intake() {
  const [messages, setMessages] = useState<Message[]>([OPENING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const nextMessages = [...messages, { role: 'user' as const, content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setError(
        "That didn't go through. Nothing was saved — you can try again, or use the checklist instead."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-6 py-10 sm:py-14" style={{ minHeight: '70vh' }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-violet/20 blur-xl" />
          <VerificationSeal label="Grounded in research" tone="slate" size={44} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Talk it through</h1>
          <p className="text-sm text-slate">
            Answers are checked against real, sourced research — not guesses.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-line bg-paper p-5 shadow-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-ink text-paper'
                  : 'bg-violet-soft text-ink-soft'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-violet-soft px-4 py-2.5 text-sm text-ink-soft">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet" />
              </span>
            </div>
          </div>
        )}
        {error && (
          <p className="rounded-lg bg-rust-soft px-4 py-2.5 text-sm text-rust">{error}</p>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          rows={1}
          placeholder="Type what you're noticing..."
          className="flex-1 resize-none rounded-full border border-line bg-paper
                     px-5 py-3 text-sm text-ink placeholder:text-slate/60
                     focus:border-ink focus:outline-none"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper
                     transition-colors hover:bg-ink-soft disabled:opacity-40"
        >
          Send
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-slate">
        Nothing typed here is stored after you close this tab.
      </p>
    </div>
  )
}
