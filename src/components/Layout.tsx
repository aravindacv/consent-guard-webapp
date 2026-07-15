import { Link } from 'react-router-dom'
import { QuickExitButton, useQuickExitShortcut } from './QuickExit'

export function Layout({ children }: { children: React.ReactNode }) {
  useQuickExitShortcut()

  return (
    <div className="min-h-screen flex flex-col">
      <QuickExitButton />
      <header className="border-b border-line bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 pr-28 sm:pr-36">
          <Link to="/" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="#1C2B2A" strokeWidth="1.6" />
              <path d="M8 12.5l2.5 2.5L16 9" stroke="#3D7A5C" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-lg tracking-tight">ConsentGuard</span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-ink-soft lg:flex">
            <Link to="/check" className="hover:text-ink transition-colors">Check your phone</Link>
            <Link to="/talk" className="hover:text-ink transition-colors">Talk it through</Link>
            <Link to="/research" className="hover:text-ink transition-colors">The research</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line px-6 py-8 text-center text-xs text-slate">
        <p>
          Nothing you enter here is saved or sent anywhere unless you choose to
          report anonymously. This tool cannot see your phone's screen or leave
          your device unless you say so.
        </p>
      </footer>
    </div>
  )
}
