import { VerificationSeal } from '../components/VerificationSeal'
import leaderboardData from '../data/leaderboard.json'
import taxonomyData from '../data/taxonomy.json'
import rubricData from '../data/trust_rubric.json'

type CategoryColor = 'moss' | 'denim' | 'amber' | 'rust' | 'violet'

const COLOR_CLASSES: Record<CategoryColor, { bg: string; text: string; bar: string; border: string }> = {
  moss: { bg: 'bg-moss-soft', text: 'text-moss', bar: 'bg-moss', border: 'border-moss' },
  denim: { bg: 'bg-denim-soft', text: 'text-denim', bar: 'bg-denim', border: 'border-denim' },
  amber: { bg: 'bg-amber-soft', text: 'text-amber', bar: 'bg-amber', border: 'border-amber' },
  rust: { bg: 'bg-rust-soft', text: 'text-rust', bar: 'bg-rust', border: 'border-rust' },
  violet: { bg: 'bg-violet-soft', text: 'text-violet', bar: 'bg-violet', border: 'border-violet' },
}

const taxonomy = taxonomyData as Record<string, {
  label: string; description: string; example_class: string[]; color: CategoryColor
}>
const rubric = rubricData as Record<string, {
  question: string; scale: string; added_mid_study?: boolean; revision_note?: string
}>
const sortedResults = [...leaderboardData.results].sort((a, b) => b.total_score - a.total_score)

export function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-denim/15 blur-2xl" />
            <VerificationSeal label="Publicly sourced research" tone="slate" size={64} />
          </div>
        </div>
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
          The research this tool is built on
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          A taxonomy, threat model, and trust benchmark for {leaderboardData.corpus_size} contact-monitoring
          platforms — scored only from public privacy policies, marketing pages, and regulatory
          filings. No accounts created, no real phone numbers used, no live monitoring performed.
        </p>
        <a
          href="https://github.com/aravindacv/consent-monitoring-trust-benchmark"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium
                     text-paper transition-colors hover:bg-ink-soft"
        >
          Full data, audit trail &amp; methodology on GitHub &rarr;
        </a>
      </div>

      {/* Taxonomy */}
      <section className="mb-16">
        <h2 className="font-display text-2xl text-ink">Five categories, not one</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
          Most prior work treats "monitoring software" as a single category. Building this
          corpus surfaced a meaningful split in mechanism and threat model.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(taxonomy).map(([key, cat]) => {
            const c = COLOR_CLASSES[cat.color]
            return (
              <div key={key} className={`rounded-xl border ${c.border}/25 ${c.bg} p-5`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${c.bar}`} />
                  <h3 className="font-medium text-ink">{cat.label}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{cat.description}</p>
                <p className="mt-3 font-mono text-xs text-slate">
                  {cat.example_class.join(' · ')}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mb-16">
        <h2 className="font-display text-2xl text-ink">Trust benchmark leaderboard</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
          Scored 0&ndash;14 across seven pre-registered dimensions (below). Higher = more
          consent-respecting. Validated against known regulatory outcomes.
        </p>

        <div className="mt-6 space-y-2.5">
          {sortedResults.map((r) => {
            const cat = taxonomy[r.taxonomy_category]
            const c = COLOR_CLASSES[cat.color]
            const pct = (r.total_score / 14) * 100
            return (
              <div key={r.app_id} className="flex items-center gap-3">
                <div className="w-40 shrink-0 truncate text-sm font-medium text-ink sm:w-48">
                  {r.name}
                </div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-mist">
                  <div
                    className={`h-full rounded-full ${c.bar} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex w-24 shrink-0 items-center justify-end gap-1.5">
                  <span className="font-mono text-sm text-ink-soft">{r.total_score}/14</span>
                </div>
                <div className="hidden w-32 shrink-0 items-center gap-1 sm:flex">
                  {r.has_enforcement_record && (
                    <span className="rounded-full bg-rust-soft px-2 py-0.5 text-[10px] font-medium text-rust">
                      regulatory record
                    </span>
                  )}
                  {r.has_sanity_flag && !r.has_enforcement_record && (
                    <span className="rounded-full bg-amber-soft px-2 py-0.5 text-[10px] font-medium text-amber">
                      sanity flag
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate">
          {Object.entries(taxonomy).map(([key, cat]) => {
            const c = COLOR_CLASSES[cat.color]
            return (
              <span key={key} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${c.bar}`} /> {cat.label}
              </span>
            )
          })}
        </div>
        {leaderboardData.excluded.length > 0 && (
          <p className="mt-4 text-xs text-slate">
            Excluded from scoring: {leaderboardData.excluded.join(', ')}.
          </p>
        )}
      </section>

      {/* Rubric */}
      <section className="mb-8">
        <h2 className="font-display text-2xl text-ink">The seven-dimension rubric</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
          Pre-registered before scoring began, to guard against fitting the rubric to a
          desired outcome. One dimension was added mid-study — disclosed below, not hidden.
        </p>
        <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-paper">
          {Object.entries(rubric).map(([key, dim]) => (
            <div key={key} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-sm font-medium text-ink">
                  {key.replace(/_/g, ' ')}
                </h3>
                {dim.added_mid_study && (
                  <span className="rounded-full bg-amber-soft px-2 py-0.5 text-[10px] font-medium text-amber">
                    added mid-study
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{dim.question}</p>
              <p className="mt-1.5 font-mono text-xs text-slate">{dim.scale}</p>
              {dim.revision_note && (
                <p className="mt-2 rounded-lg bg-amber-soft p-3 text-xs leading-relaxed text-ink-soft">
                  {dim.revision_note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
