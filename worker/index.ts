export interface Env {
  ANTHROPIC_API_KEY: string
  ASSETS: Fetcher
}

const CORPUS_SUMMARY = `
Research corpus summary (21 platforms, publicly sourced, verified):
- Overt stalkerware (mSpy, FlexiSPY, Highster Mobile, XNSPY, Eyezy, uMobix,
  SpyBubble Pro): marketed with explicit stealth language ("100% invisible",
  "stays hidden", "won't know it's there"). Require a few minutes of physical
  access to install. Highster Mobile's parent company (ILF Mobile Apps Corp)
  is subject to a New York Attorney General enforcement action.
- Partner-trust apps (Spynger, FamiSpy): similar stealth marketing, framed
  around relationship suspicion rather than parental use.
- Parental-control baselines (Bark, Qustodio, Google Family Link, Net Nanny):
  explicitly do NOT support hiding from the monitored device.
- Mutual-safety baselines (Life360, GeoZilla, Apple Find My, Google Find My
  Device): consent-based, reciprocal; several state tracking without the
  other person's knowledge is not possible by design. Apple and Google Find
  My use end-to-end encryption -- neither company can see location data.
- Number-only lookup (Scannero, Detectico, GEOfinder): no install at all --
  sends a link that the OTHER person must click before any location is
  shared. Shows a pattern of multi-domain confusion across all three examples.
- Historical enforcement: FTC actions against SpyFone (2021) and
  Retina-X Studios (2018) both found operators failed basic data security
  and did not verify legitimate use of their software.
`.trim()

const SYSTEM_PROMPT = `
You are a calm, careful intake assistant for a tool that helps people figure
out whether they might be subject to unwanted phone monitoring. Some people
using this may be scared, in an unsafe relationship, or unsure what's normal.

Ground rules:
- Use ONLY the corpus summary below as your factual basis about specific
  monitoring apps. If someone names an app not in this list, say plainly
  that it isn't in the researched corpus rather than guessing.
- Never say "you are being monitored" or make a diagnosis. Use calibrated
  language: "that matches a pattern we researched," "worth a closer look."
- Keep responses short -- 2-4 sentences.
- Ask at most one clarifying question at a time if needed.
- If the person describes signs of immediate danger, gently suggest
  contacting local emergency services or a domestic violence helpline.
- Do not suggest confronting anyone or deleting anything suddenly.
- Never ask for or store identifying information.

${CORPUS_SUMMARY}
`.trim()

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/intake' && request.method === 'POST') {
      try {
        const { messages } = await request.json() as {
          messages: { role: 'user' | 'assistant'; content: string }[]
        }
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 })
        }

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 300,
            system: SYSTEM_PROMPT,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        if (!anthropicRes.ok) {
          const errText = await anthropicRes.text()
          return new Response(JSON.stringify({ error: 'Upstream error', detail: errText }), { status: 502 })
        }

        const data = await anthropicRes.json() as { content: { type: string; text?: string }[] }
        const reply = data.content.find((c) => c.type === 'text')?.text ?? ''

        return new Response(JSON.stringify({ reply }), {
          headers: { 'Content-Type': 'application/json' },
        })
      } catch {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
      }
    }

    // Everything else: serve the static React app
    return env.ASSETS.fetch(request)
  },
}