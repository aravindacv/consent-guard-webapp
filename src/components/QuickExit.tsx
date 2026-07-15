/**
 * QuickExit — a real safety feature, not decoration.
 *
 * Convention borrowed from domestic-violence resource sites (thehotline.org,
 * womensaid.org.uk): a persistent, unmistakable exit that immediately
 * replaces the current page with a neutral one, so a person who is not
 * safe to be seen using this tool can leave instantly. Triggered either by
 * clicking the button or by pressing Escape at any time, anywhere in the app.
 *
 * Implementation notes:
 * - Uses location.replace(), not location.href, so the exited page does
 *   NOT appear in browser history — pressing "back" afterwards will not
 *   return here.
 * - No confirmation dialog. A confirmation step is itself a safety risk
 *   (delay, and a dialog box someone else could see).
 */
import { useEffect } from 'react'

const NEUTRAL_DESTINATION = 'https://www.weather.com'

function exitNow() {
  window.location.replace(NEUTRAL_DESTINATION)
}

export function useQuickExitShortcut() {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') exitNow()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])
}

export function QuickExitButton() {
  return (
    <button
      onClick={exitNow}
      className="fixed top-4 right-4 z-50 rounded-full bg-ink px-4 py-2
                 text-sm font-medium text-paper shadow-lg transition-colors
                 hover:bg-ink-soft focus-visible:outline-2
                 focus-visible:outline-offset-2 focus-visible:outline-paper"
      aria-label="Quick exit — leave this site immediately"
    >
      Quick exit
    </button>
  )
}
