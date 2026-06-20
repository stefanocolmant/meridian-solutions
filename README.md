# Meridian Solutions

Marketing site for **Meridian Solutions** — institutional algorithmic-trading systems licensed to traders. Built with **Next.js 16 (App Router) · React 19 · Tailwind v4 · GSAP + Lenis**.

Editorial dark design system: condensed-caps display type, mono labels, cream interludes, a burnt-orange signal accent, celestial imagery, and a re-authored Lenis + GSAP motion engine (masked line reveals, scroll-reversing marquees, parallax, animated counters).

## The offer

Three validated NQ E-mini futures algorithms, licensed directly to traders. Every signal ships with entry, stop and target pre-defined — deploy at a prop firm or on personal capital, always with full account control.

| System | Tier | Configs | Net P&L (15mo) | Profit factor |
|---|---|---|---|---|
| **Compass** | Entry | 4 | +$106,600 | 1.787 |
| **Sextant** | Core | 7 | +$225,264 | 1.806 |
| **Polaris** | Complete | 9 | +$262,437 | 1.846 |

Run all nine configurations together for the smoothest aggregate equity curve.

## Pages

`/` home · `/algorithms` · `/performance` (stats, calendar, equity curves, validation) · `/methodology` · `/process` · `/pricing` · `/calculator` (investment projector) · `/faq` · `/apply` (book a demo / opt-in) · `/login` · `/privacy` · `/terms`

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes prerender static)
```

## Architecture

- `src/content/site.ts` — brand, nav, footer, contact (single source of truth — change `BRAND` to re-skin)
- `src/content/data.ts` — algorithms, statistics, monthly P&L, FAQ, testimonials, process, comparison, pricing, disclosures
- `src/components/` — Nav (mobile drawer), Footer (animated wordmark), Hero, PageHero, Calculator, Faq, ApplyForm, Counter, SmoothScroll (motion engine), Logo
- `src/components/sections/` — composable page sections
- `src/app/*/page.tsx` — routes

All performance shown is **hypothetical and educational**. Meridian provides software and education only — not a broker, adviser, or account-management service.
