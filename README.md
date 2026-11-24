# Christian Muhirwa — Engineering Portfolio Hub

Standalone public portfolio and interactive architecture showcase for **Christian Muhirwa** (University of Saskatchewan), featuring **IkiLang / KinyaVoice** — real-time speech-to-text translation infrastructure designed for low-resource languages, starting with Kinyarwanda (`+1.02 s` live replay caption delay, `0.10 ms` p95 quality-guardrail overhead, `451` automated tests passing across backend and frontend).

Built as a lightweight, zero-tracking static React + TypeScript + Vite site ready for GitHub Pages (`https://chrisberg2.github.io/`).

## Modular Project Registry

This repository is structured as a modular portfolio hub so new projects can be registered cleanly without entangling unrelated codebases:

- `src/data/profile.ts` — Public builder profile, focus areas, and optional contact links (empty optional links stay hidden automatically).
- `src/data/projects.ts` — Top-level registry of public projects shown on the overview hub (flagship interactive case studies and lightweight external GitHub links).
- `src/projects/<slug>/` — Self-contained case study module (`types.ts`, `data.ts`, interactive components, and module-scoped styles).
- `src/components/` & `src/styles/` — Shared accessible shell, responsive navigation, light/dark color-scheme system, and design tokens.

## Updating IkiLang Milestones

All public milestones, maturity statuses, simulation frames, preview scenarios, roadmap phases, and changelog entries live in one typed module:

- `src/projects/ikilang/data.ts` (typed by `src/projects/ikilang/types.ts`)

Every capability is explicitly tagged under one of three honest maturity tiers:

- **`proven` ("Proven Today")** — Verified in automated tests or controlled captures.
- **`validating` ("Active Validation")** — Actively tested under real-world field conditions.
- **`gated` ("Deliberately Gated")** — Intentionally disarmed or deferred until prerequisite exit gates pass (for example, audience audio streaming remains disarmed during captions-only live trials).

Interactive previews in the showcase use strictly synthetic illustrative text and timing models — never live API calls, never autoplay audio, and never private session transcripts.

## Automated Public Disclosure Guard

`tests/disclosure-guard.test.ts` runs automatically inside `npm test` and in GitHub Actions (`.github/workflows/deploy-pages.yml`) before every production build. It recursively scans `src/`, `public/`, `index.html`, and `README.md` to ensure:

- Proprietary speech pipeline internals, exact model identifiers, internal algorithm formulas, private prompt/glossary artifacts, unit-economics numbers, and private repository names never appear in public builds.
- Public capability statuses preserve honest maturity boundaries and retain explicit simulation-provenance and black-box disclosure notices.
- Biographical descriptions stay strictly accurate and never introduce unverified personal origin claims.

## Local Development

```bash
npm install
npm run dev       # Local dev server at http://127.0.0.1:5173
npm test          # Runs behavioral, accessibility, and disclosure-guard tests
npm run build     # Strict TypeScript check + Vite production bundle in dist/
npm run preview   # Preview built dist/ locally at http://127.0.0.1:4173
```

## Accessibility & Privacy Standards

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), skip link, keyboard-reachable interactive controls, visible `:focus-visible` outlines, 48px minimum touch targets, non-color-only active states, `forced-colors` support, and `prefers-reduced-motion` compliance.
- Adaptive light and dark color schemes powered by `<meta name="color-scheme" content="light dark">`, CSS `color-scheme` + `light-dark()`, and a no-flash theme initializer.
- Zero third-party analytics, tracking pixels, cookies, or external font requests.
