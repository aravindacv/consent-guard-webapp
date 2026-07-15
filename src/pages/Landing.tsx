import { Link } from 'react-router-dom'
import { VerificationSeal } from '../components/VerificationSeal'

function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16v11H9l-4 4v-4H4V5z" stroke="currentColor" strokeWidth="1.6"
        strokeLinejoin="round" />
      <circle cx="9" cy="10.5" r="0.9" fill="currentColor" />
      <circle cx="12" cy="10.5" r="0.9" fill="currentColor" />
      <circle cx="15" cy="10.5" r="0.9" fill="currentColor" />
    </svg>
  )
}

export function Landing() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-moss-bright/20 blur-2xl" />
          <VerificationSeal label="Built on verified research" tone="moss" size={72} />
        </div>
      </div>

      <h1 className="text-center font-display text-4xl font-semibold leading-[1.15] text-ink sm:text-6xl">
        Is someone reading your messages
        <br className="hidden sm:block" />{' '}
        <span className="text-moss">without you knowing?</span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-ink-soft">
        This tool helps you check, calmly and privately. Nothing you do here
        is saved, tracked, or visible in your browsing history unless you
        choose to share it.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <Link
          to="/check"
          className="group relative overflow-hidden rounded-2xl border border-line
                     bg-paper p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-moss" />
          <div className="flex h-11 w-11 items-center justify-center rounded-xl
                          bg-moss-soft text-moss">
            <ShieldIcon />
          </div>
          <span className="mt-4 block font-mono text-xs uppercase tracking-wider text-moss">
            Two minutes
          </span>
          <h2 className="mt-1 font-display text-2xl font-medium text-ink">Check your phone</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            A short, plain-language walkthrough of what to look for —
            battery drain, unfamiliar apps, permissions that don't add up.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-moss
                            transition-transform group-hover:translate-x-1">
            Start the check &rarr;
          </span>
        </Link>

        <Link
          to="/talk"
          className="group relative overflow-hidden rounded-2xl border border-line
                     bg-paper p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-violet" />
          <div className="flex h-11 w-11 items-center justify-center rounded-xl
                          bg-violet-soft text-violet">
            <ChatIcon />
          </div>
          <span className="mt-4 block font-mono text-xs uppercase tracking-wider text-violet">
            Describe it in your own words
          </span>
          <h2 className="mt-1 font-display text-2xl font-medium text-ink">Talk it through</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            Tell us what you're noticing — an app you don't remember
            installing, odd texts, anything — and get a plain-language read.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet
                            transition-transform group-hover:translate-x-1">
            Start talking &rarr;
          </span>
        </Link>
      </div>

      <div className="mt-16 rounded-xl border border-amber/25 bg-amber-soft p-5 text-sm text-ink-soft">
        <strong className="font-semibold text-ink">If you're in immediate danger,</strong>{' '}
        contact local emergency services first. This tool is informational and
        cannot replace them. Press <kbd className="rounded border border-line
        bg-paper px-1.5 py-0.5 font-mono text-xs">Esc</kbd> at any time, or the
        Quick exit button, to leave this site instantly.
      </div>

      <p className="mt-10 text-center text-sm text-slate">
        Built from a{' '}
        <Link to="/research" className="font-medium text-ink underline decoration-moss decoration-2 underline-offset-4 hover:text-moss">
          21-platform, publicly sourced research benchmark
        </Link>{' '}
        — not guesswork.
      </p>
    </div>
  )
}
