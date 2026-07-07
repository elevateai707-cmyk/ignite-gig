# Ignite GIG

**Know what to set aside. Every payout.**

A local-first tax tracker for gig workers — rideshare, delivery, freelance, trades. Log income, expenses, and mileage; see your tax set-aside in real time. **Canada 🇨🇦 + USA 🇺🇸.**

Live: the web app is linked from [buildwithdb.ca/ignite-gig](https://buildwithdb.ca/ignite-gig).

## Why it's different

- **Private by architecture** — everything lives in `localStorage` on your device. No accounts, no server, no analytics. Nothing is uploaded, ever.
- **Works offline** — installable PWA. On iPhone: Safari → Share → Add to Home Screen. On Android: Chrome → Add to Home screen.
- **Real tax math** — progressive federal + provincial/state brackets for tax year 2025:
  - 🇨🇦 CRA T2125 framing, all 13 provinces/territories, CPP self-employed contributions, tiered CRA per-km rate (72¢ / 66¢)
  - 🇺🇸 IRS Schedule C framing, federal + 50 states + DC, self-employment tax (Social Security + Medicare), 70¢/mile standard rate
- **Accountant-ready** — one-tap CSV export for income, expenses, and mileage.

The tax engine is a TypeScript port of the [Ignite GIG Android app](https://github.com/elevateai707-cmyk)'s Kotlin `TaxEngine`, with the same bundled bracket schedules (`lib/tax/schedules/*.json`).

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · Vitest. No backend.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # tax engine tests
npm run build
```

Schedules regenerate their import index with `bash scripts/gen-schedule-index.sh`.

## Disclaimer

Estimates only — Ignite GIG is not a replacement for a licensed tax professional.
