# ADR-0001: Stack and architecture for the Retirement Planner demo

- **Date:** 2026-10-07
- **Status:** Accepted
- **Related:** `README.md`

## Context

This is a **demonstration project** (not production software) that takes one financial-planning
feature — project retirement savings growth and check the result against a target income — from
concept to deployment. Its purpose is to show engineering practice in the Node.js + Angular +
TypeScript stack: clean REST design, typed contracts shared across the boundary, automated tests,
containerization, and CI.

## Decisions

| # | Decision | Alternatives considered | Rationale |
|---|---|---|---|
| 1 | **Angular 22 + TypeScript SPA** | React, Vue | Angular is the target stack; TypeScript gives a single typed contract across client/server. |
| 2 | **Node.js + Express + TypeScript API** | NestJS, Fastify, Java/Spring | Express is the most widely understood minimal API layer and keeps the demo readable; TypeScript for shared contracts and safety. |
| 3 | **Client-side rendering (no SSR)** | Angular SSR/hydration | The feature is an interactive calculator with no SEO or time-to-first-paint requirement; CSR simplifies build + deployment (static nginx). |
| 4 | **Stateless API; scenarios kept client-side** | Postgres persistence | No persistence keeps the demo focused and runnable anywhere; a database is the obvious next increment. |
| 5 | **Vitest for backend unit tests** | Jest | Vitest is zero-config for TypeScript and fast; its API is Jest-compatible, so switching to Jest if a team standard requires it is low-cost. |
| 6 | **Hand-rolled SVG growth chart** | Chart.js, Recharts | Zero runtime dependency; the projection math stays visible and testable. A charting library is the right call for richer visualizations later. |
| 7 | **Single monorepo (server / client / e2e)** | Separate repos, Nx | One repo makes the demo easy to clone and review; Nx adds orchestration value that isn't needed at this scale. |

## Domain assumptions

- Growth uses annual compounding: `balance = (balance + annualContribution) * (1 + rate)`.
- "Sustainable annual income" uses the **4% withdrawal rule** — a widely used rule of thumb, not
  financial advice. This is documented so the model's limits are explicit.

## Non-goals (deliberately out of scope)

- Authentication / authorization
- Persistent storage
- Real market data or inflation modeling
- Production observability (tracing, alerting)

## Consequences

- The demo is simple to run (`docker compose up`), test, and review.
- The stateless API and hand-rolled chart are easy to extend, and the deferred items above are
  natural follow-ups rather than rework.
- The REST API is client-agnostic (plain JSON, no web-specific coupling), so the same contract
  serves the Angular SPA and a native (Fidelity Mobile) client — supporting the omni-channel goal.
