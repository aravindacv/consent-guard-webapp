# ConsentGuard — Web App

A calm, privacy-first self-check tool for people who suspect their phone
is being monitored without consent, built directly on the findings of the
[consent-monitoring-trust-benchmark](https://github.com/aravindacv/consent-monitoring-trust-benchmark)
research project.

## What's here (Phase 1)
- **Landing page** — clear entry point, no alarming imagery
- **Checklist** (`/check`) — calm, one-question-at-a-time self-assessment,
  cross-referenced against the researched app signature database
- **Talk it through** (`/talk`) — AI-assisted intake chat, grounded ONLY in
  the research corpus (no outside/trained knowledge about specific apps),
  served via a Cloudflare Pages Function so the API key never reaches the browser
- **Quick exit** — persistent safety feature (Escape key or button), borrowed
  from domestic-violence resource site conventions

## Not yet built (Phase 2)
- Public research dashboard (`/research` is currently a placeholder)

## Local development
```bash
npm install
npm run dev
```

## Deploying (Cloudflare Pages — free tier)
1. Push this repo to GitHub
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**
3. Select this repo. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Under **Settings → Environment variables**, add a **secret** named
   `ANTHROPIC_API_KEY` (do NOT add it as a plain variable — must be a secret)
5. Deploy. The `/api/intake` route is picked up automatically from the
   `functions/` directory by Cloudflare Pages Functions.

## Design system
See `src/index.css` for the full token set. Palette: "Fog & Ledger" —
mist/paper backgrounds, moss/amber/rust status colors, IBM Plex Sans/Mono
for UI and data, Fraunces used sparingly for the one signature moment per
screen. Full rationale in code comments throughout `src/components/`.
