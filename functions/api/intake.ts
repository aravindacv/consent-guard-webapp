/**
 * Cloudflare Pages Function: /api/intake
 *
 * Server-side only. The Anthropic API key lives in a Cloudflare secret
 * (env.ANTHROPIC_API_KEY), never shipped to the browser bundle.
 *
 * System prompt design carries forward two specific lessons learned during
 * this project's research phase:
 *  1. The Qustodio fabrication incident (Kaggle scoring pipeline) — an LLM
 *     asserted a claim that was never actually in its provided context.
 *     Here we explicitly instruct the model to ground answers ONLY in the
 *     supplied corpus summary, and to say "the research doesn't cover that"
 *     rather than reach for outside/trained knowledge.
 *  2. Language calibration from the rubric's own scale definitions — never
 *     diagnostic ("you ARE being monitored"), always calibrated ("this
 *     matches a pattern we researched" vs. "this doesn't match anything").
 */

interface Env {
  ANTHROPIC_API_KEY: string
}

const CORPUS_SUMMARY = `
Research corpus summary (14 platforms, publicly sourced, verified):
- Overt stalkerware (mSpy, FlexiSPY, Highster Mobile, XNSPY, Eyezy, uMobix,
  SpyBubble Pro): marketed with explicit stealth language ("100% invisible",
  "stays hidden", "won't know it's there"). Require a few minutes of physical
  access to install. Highster Mobile's parent company (ILF Mobile Apps Corp)
  is subject to a New York Attorney General enforcement action; it also
  operates under the names Auto Forward, Easy Spy, DDI Utilities, and
  PhoneSpector.
- Partner-trust apps (Spynger, FamiSpy): similar stealth marketing, framed
  around relationship suspicion rather than parental use.
- Parental-control baselines (Bark, Qustodio): explicitly do NOT support
  hiding from the monitored device (Qustodio's own help center: "not
  possible to hide Qustodio on mobile phones"). Bark uses AI content
  alerts rather than handing over raw messages, and informs the child.
- Mutual-safety baseline (Life360): consent-based, reciprocal; own
  materials state tracking without the other person's knowledge is not
  possible by design.
- Number-only lookup (Scannero-class): no install at all — sends a link
  that the OTHER person must click before any location is shared. Cannot
  be detected by checking installed apps, because nothing is installed.
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
  that it isn't in the researched corpus rather than guessing or drawing on
  general knowledge you might have about it.
- Never say "you are being monitored" or make a diagnosis. Use calibrated
  language: "that matches a pattern we researched," "that doesn't match
  what we'd expect," "worth a closer look."
- Keep responses short -- 2-4 sentences. This is a conversation, not an essay.
- Ask at most one clarifying question at a time if you need more detail.
- If the person describes signs of immediate danger, gently suggest
  contacting local emergency services or a domestic violence helpline
  before continuing, without being alarmist.
- Do not suggest the person confront anyone or delete anything suddenly --
  sudden changes can sometimes increase risk if someone else has access.
  Suggest talking to a trusted person or an advocate for next steps instead.
- Never ask for or store identifying information (name, exact address,
  phone number).

${CORPUS_SUMMARY}
`.trim()

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { messages } = await context.request.json<{
      messages: { role: 'user' | 'assistant'; content: string }[]
    }>()

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 })
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': context.env.ANTHROPIC_API_KEY,
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

    const data = await anthropicRes.json<{ content: { type: string; text?: string }[] }>()
    const reply = data.content.find((c) => c.type === 'text')?.text ?? ''

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
