/**
 * VerificationSeal — the signature visual element for this app.
 *
 * Grounded directly in the research this tool is built on: every claim in
 * the underlying benchmark is sourced, evidenced, and audited. This stamp
 * motif — an inspection-seal ring with a rotating label — is used wherever
 * the app cites a verified source, distinguishes a heuristic guess from a
 * confirmed match, or marks a step as complete. It is the one place this
 * design "spends its boldness"; everything else stays quiet.
 */

type SealTone = 'moss' | 'amber' | 'rust' | 'slate'

const toneMap: Record<SealTone, { ring: string; text: string }> = {
  moss: { ring: '#3D7A5C', text: '#3D7A5C' },
  amber: { ring: '#C1832E', text: '#C1832E' },
  rust: { ring: '#A6452E', text: '#A6452E' },
  slate: { ring: '#4A5D63', text: '#4A5D63' },
}

export function VerificationSeal({
  label,
  tone = 'moss',
  size = 72,
}: {
  label: string
  tone?: SealTone
  size?: number
}) {
  const colors = toneMap[tone]
  const id = `seal-path-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
    >
      <defs>
        <path id={id} d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="44" fill="none" stroke={colors.ring} strokeWidth="1" opacity="0.35" />
      <circle cx="50" cy="50" r="37" fill="none" stroke={colors.ring} strokeWidth="1.5" />
      <text fontSize="7.2" fontFamily="'IBM Plex Mono', monospace" letterSpacing="2" fill={colors.text}>
        <textPath href={`#${id}`} startOffset="0%">
          {label.toUpperCase()} • {label.toUpperCase()} •
        </textPath>
      </text>
      <circle cx="50" cy="50" r="18" fill={colors.ring} opacity="0.12" />
      <path
        d="M 41 50 L 47 57 L 60 43"
        stroke={colors.ring}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
