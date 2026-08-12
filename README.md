# Vyaya — a personal expense ledger (stylized pass)

"Vyaya" (व्यय) is Sanskrit/Hindi for "expenditure." Built as a ledger, not
a dashboard-first fintech product — spending is *entered*, line by line,
the way an old account book works.

## Stack

- Next.js 16 (App Router, Turbopack), React 19
- Tailwind CSS v4 — theme tokens live directly in `src/app/globals.css`
  under `@theme { ... }`. No `tailwind.config.ts` needed.

## What's new in this pass

- Glow backdrops behind the hero, register, and login cards
  (`bg-glow-brass`), plus a subtle noise texture (`bg-noise`).
- Motion: cards fade/slide in on load (`animate-fade-up`, `animate-fade-in`),
  the hero ledger card gently floats (`animate-float`), buttons get a
  light "shine" sweep on hover (`.shine-wrap`), feature rows get a brass
  left-rule that grows in on hover.
- Icons on each of the 5 feature entries (inline SVG, no icon package
  needed).
- Gradient brass buttons/pills instead of flat fills, gradient bars on the
  dashboard preview, a hand-drawn underline under "entered" in the hero.
- Register page: password rules now render as a live 2x2 checklist that
  ticks green as each condition is met, instead of a single error line.
- Login page gains a "Forgot?" link and the same glass/glow treatment as
  Register.

## What's in this build

- `src/app/page.tsx` — home page
- `src/app/register/page.tsx` — registration form (client-side validated:
  username = first word of name, password needs 4+ chars with upper/lower/
  number)
- `src/app/login/page.tsx` — login form (UI only)
- `src/app/globals.css` — design tokens + keyframes (Tailwind v4 `@theme`)
- `src/app/layout.tsx` — Google Fonts (Fraunces, IBM Plex Sans, IBM Plex
  Mono)

**No backend yet** — no database, auth, expense storage, dashboard math,
cron job, or email sending. Forms validate client-side and show a local
success state only.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Verified this build compiles clean with your
exact versions (Next 16.3.0, React 19.2.8, Tailwind v4) — `next build`
succeeds and every custom utility (`bg-glow-brass`, `bg-noise`,
`animate-fade-up`, `animate-float`, gradients, etc.) is present in the
generated CSS.

## Suggested next steps

1. Add a database (users, expenses) and real auth (hash passwords with
   `bcrypt` — never store them in plain text).
2. Build `/dashboard`: category totals, month-over-month comparison, and
   a scheduled job that deletes expense rows older than 3 months.
3. Add a scheduled job that runs monthly: sums the month's spend, calls an
   LLM for the "balanced spending" suggestion, and emails it out.
