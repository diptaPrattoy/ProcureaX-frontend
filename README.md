# ProcuraX Frontend

ProcuraX is the frontend for a B2B procurement platform covering supplier onboarding, RFQs, quotation evaluation, purchase orders, goods receiving, invoicing, Stripe payments, refunds, and disputes.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4
- shadcn-style component primitives with Radix UI
- Lucide icons

## Local development

1. Copy `.env.example` to `.env.local`.
2. Confirm the configured `API_BASE_URL` points to the ProcuraX backend. The example uses the deployed Render API.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

The frontend runs at [http://localhost:3000](http://localhost:3000) by default.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Architecture principles

- Pages and layouts stay as Server Components by default.
- Client Components are introduced only for interaction, browser APIs, or client state.
- Protected API access will pass through server-side boundaries so access tokens are not exposed unnecessarily.
- Search, filters, sorting, and pagination are represented in the URL.
- Shared UI primitives live in `src/components/ui`; domain components will be grouped by feature.

See [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) for the planned 20-commit delivery sequence.
