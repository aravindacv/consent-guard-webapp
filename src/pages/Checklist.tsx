import { useState } from 'react'
import { Link } from 'react-router-dom'
import { VerificationSeal } from '../components/VerificationSeal'
import knownSignatures from '../data/known_signatures.json'

type Answer = 'yes' | 'no' | 'unsure'

interface Question {
  id: string
  prompt: string
  helper?: string
  weight: number
  icon: 'battery' | 'data' | 'access' | 'knowledge'
}

const QUESTIONS: Question[] = [
  {
    id: 'battery',
    prompt: 'Has your battery been draining faster than usual lately?',
    helper: 'Monitoring software often runs constantly in the background.',
    weight: 10,
    icon: 'battery',
  },
  {
    id: 'data',
    prompt: "Has your data usage gone up without a clear reason?",
    helper: 'Uploading calls, messages, or location uses data continuously.',
    weight: 10,
    icon: 'data',
  },
  {
    id: 'access',
    prompt: 'In the last few weeks, has anyone had your phone to themselves for a few minutes or more — borrowed it, "fixed" something on it, or set it up for you?',
    helper: 'Most monitoring apps we researched need a few minutes of direct access to install.',
    weight: 25,
    icon: 'access',
  },
  {
    id: 'knowledge',
    prompt: "Does someone seem to know things about your day, conversations, or whereabouts that you didn't tell them?",
    helper: "This is often the clearest sign, even before anything technical.",
    weight: 30,
    icon: 'knowledge',
  },
]

const APP_NAME_STEP = 'apps'

export function Checklist() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [appsUnfamiliar, setAppsUnfamiliar] = useState<Answer | null>(null)
  const [appName, setAppName] = useState('')
  const [done, setDone] = useState(false)

  const totalSteps = QUESTIONS.length + 1 // +1 for the apps question
  const currentIsAppsStep = step === QUESTIONS.length

  function answerQuestion(id: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setStep((s) => s + 1)
  }

  function answerAppsStep(value: Answer) {
    setAppsUnfamiliar(value)
    if (value === 'no') {
      setDone(true)
    } else {
      // fall through to the name-entry sub-step, rendered conditionally below
    }
  }

  function finishAppsStep() {
    setDone(true)
  }

  // --- scoring ---
  let score = 0
  for (const q of QUESTIONS) {
    if (answers[q.id] === 'yes') score += q.weight
    if (answers[q.id] === 'unsure') score += q.weight * 0.4
  }
  if (appsUnfamiliar === 'yes') score += 25

  const matchedApp = knownSignatures.signatures.find((s) =>
    appName.trim().length > 2 &&
    s.display_name.toLowerCase().includes(appName.trim().toLowerCase())
  )

  let tier: 'low' | 'some' | 'high' = 'low'
  if (matchedApp || score >= 55) tier = 'high'
  else if (score >= 25) tier = 'some'

  if (done) {
    return <ChecklistResult tier={tier} matchedApp={matchedApp} />
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 sm:py-24">
      <div className="mb-10 h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-moss transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {!currentIsAppsStep && (
        <QuestionCard
          question={QUESTIONS[step]}
          onAnswer={(v) => answerQuestion(QUESTIONS[step].id, v)}
        />
      )}

      {currentIsAppsStep && appsUnfamiliar === null && (
        <QuestionCard
          question={{
            id: APP_NAME_STEP,
            prompt: 'Do you recognize every app installed on your phone?',
            helper: 'Look for anything named generically — "System Update," "Sync," "Wi-Fi Service" — that you don\'t remember installing yourself.',
            weight: 0,
            icon: 'access',
          }}
          yesLabel="Yes, all familiar"
          noLabel="No, something's off"
          onAnswer={(v) => answerAppsStep(v === 'yes' ? 'no' : 'yes')}
          hideUnsure
        />
      )}

      {currentIsAppsStep && appsUnfamiliar === 'yes' && (
        <div className="animate-[fadeIn_0.4s_ease]">
          <p className="font-display text-2xl text-ink">
            What's it called, if you remember?
          </p>
          <p className="mt-2 text-sm text-slate">
            Optional — we'll check it against known monitoring-app names.
          </p>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. mSpy, Eyezy, or a name you're not sure of"
            className="mt-4 w-full rounded-lg border border-line bg-paper px-4 py-3
                       text-ink placeholder:text-slate/60 focus:border-ink focus:outline-none"
          />
          <button
            onClick={finishAppsStep}
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium
                       text-paper transition-colors hover:bg-ink-soft"
          >
            See what this means &rarr;
          </button>
        </div>
      )}
    </div>
  )
}

const TOPIC_ICONS: Record<Question['icon'], React.ReactNode> = {
  battery: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="20" y="10" width="2" height="4" rx="0.6" fill="currentColor" />
      <rect x="6" y="9.5" width="8" height="5" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  data: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9a12 12 0 0116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 13a7 7 0 019 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1.4" fill="currentColor" />
    </svg>
  ),
  access: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="3" width="12" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  knowledge: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
}

function QuestionCard({
  question,
  onAnswer,
  yesLabel = 'Yes',
  noLabel = 'No',
  hideUnsure = false,
}: {
  question: Question
  onAnswer: (v: Answer) => void
  yesLabel?: string
  noLabel?: string
  hideUnsure?: boolean
}) {
  return (
    <div key={question.id} className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-moss-soft text-moss">
        {TOPIC_ICONS[question.icon]}
      </div>
      <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
        {question.prompt}
      </p>
      {question.helper && (
        <p className="mt-3 text-sm leading-relaxed text-slate">{question.helper}</p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <AnswerButton onClick={() => onAnswer('yes')}>{yesLabel}</AnswerButton>
        <AnswerButton onClick={() => onAnswer('no')}>{noLabel}</AnswerButton>
        {!hideUnsure && (
          <AnswerButton onClick={() => onAnswer('unsure')} muted>
            Not sure
          </AnswerButton>
        )}
      </div>
    </div>
  )
}

function AnswerButton({
  children,
  onClick,
  muted = false,
}: {
  children: React.ReactNode
  onClick: () => void
  muted?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
        muted
          ? 'border-line text-slate hover:border-ink hover:text-ink'
          : 'border-ink bg-ink text-paper hover:bg-ink-soft'
      }`}
    >
      {children}
    </button>
  )
}

function ChecklistResult({
  tier,
  matchedApp,
}: {
  tier: 'low' | 'some' | 'high'
  matchedApp?: (typeof knownSignatures.signatures)[number]
}) {
  const copy = {
    low: {
      tone: 'moss' as const,
      title: "Nothing here points to monitoring software",
      body: "Based on what you told us, we don't see the signs we'd expect. That's not a guarantee — some monitoring software leaves very few traces — but it's a good sign.",
    },
    some: {
      tone: 'amber' as const,
      title: 'A couple of things are worth a closer look',
      body: "What you've described could have ordinary explanations, but it also overlaps with patterns we see in monitoring software. It may be worth talking it through in more detail.",
    },
    high: {
      tone: 'rust' as const,
      title: 'Several signs here are worth taking seriously',
      body: "What you've described matches patterns we researched closely. This doesn't confirm anything on its own, but it's worth acting on.",
    },
  }[tier]

  const toneBg = { moss: 'bg-moss-soft', amber: 'bg-amber-soft', rust: 'bg-rust-soft' }[copy.tone]
  const toneBar = { moss: 'bg-moss', amber: 'bg-amber', rust: 'bg-rust' }[copy.tone]

  return (
    <div className="mx-auto max-w-xl px-6 py-16 sm:py-24">
      <div className={`relative overflow-hidden rounded-2xl border border-line ${toneBg} p-7`}>
        <div className={`absolute inset-x-0 top-0 h-1.5 ${toneBar}`} />
        <VerificationSeal label="Assessment complete" tone={copy.tone} size={56} />
        <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{copy.body}</p>
      </div>

      {matchedApp && (
        <div className="mt-6 rounded-xl border border-rust/30 bg-rust-soft p-5">
          <p className="font-mono text-xs uppercase tracking-wide text-rust">
            Name match found
          </p>
          <p className="mt-2 text-sm text-ink">
            <strong>{matchedApp.display_name}</strong> appears in our
            researched corpus, categorized as{' '}
            <em>{matchedApp.taxonomy_category.replace(/_/g, ' ')}</em>.
            {matchedApp.covert_operation_evidence && (
              <> Its own marketing describes it as: &ldquo;{matchedApp.covert_operation_evidence}&rdquo;</>
            )}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/talk"
          className="flex-1 rounded-full bg-ink px-6 py-3 text-center text-sm
                     font-medium text-paper transition-colors hover:bg-ink-soft"
        >
          Talk it through in more detail
        </Link>
        <Link
          to="/"
          className="flex-1 rounded-full border border-line px-6 py-3 text-center
                     text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Start over
        </Link>
      </div>

      <div className="mt-10 rounded-xl border border-line bg-paper p-5 text-sm leading-relaxed text-slate">
        <strong className="text-ink">If you decide to act on this,</strong> a
        domestic violence advocate or a trusted person you can speak to in
        private can help you think through next steps safely — acting
        suddenly (like deleting the app) can sometimes escalate risk if
        someone else is watching for that. You know your situation best.
      </div>
    </div>
  )
}
