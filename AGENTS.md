# AGENTS.md

> Instructions for AI coding agents working in this repo.

## Project
Retirement Planner — a full-stack demo (Node.js + Angular + TypeScript) that projects retirement savings growth, computes sustainable income (4% rule), and reports on-track status. Demo, not production — the point is clean REST design, typed shared contracts, automated tests, Docker, and CI. Structure: `server/` (Express + TypeScript), `client/` (Angular 22 SPA), `e2e/` (Playwright).

## Commands
- server install: `cd server && npm install`
- server dev:    `cd server && npm run dev`      # http://localhost:4000
- server test:   `cd server && npm test`          # Vitest
- server build:  `cd server && npm run build`     # tsc → dist/
- client install:`cd client && npm install`
- client dev:    `cd client && npm start`         # http://localhost:4200 (proxies /api → :4000)
- client build:  `cd client && npm run build`     # ng build
- e2e:           `cd e2e && npm test`             # Playwright (BASE_URL=http://localhost:8080)
- full stack:    `docker compose up --build`      # UI :8080, API :4000

## Conventions
- TypeScript contracts are the source of truth at the client/server boundary — keep `server/src/types.ts` and `client/src/app/models/` in sync.
- Projection math lives only in `server/src/services/` (pure, unit-testable). The UI never reimplements it.
- Style is enforced by Angular/TS defaults; prose guide: `docs/style-guide.md`. (No lint step configured.)

## Boundaries (non-negotiable)
- Never read or write `.env` or any secret.
- Don't add dependencies without asking.
- Don't change architecture — propose an ADR first (`docs/adr/`).
- Run tests + build before finishing.

## Review gates
Every change must pass: architecture fit · correctness · security · test coverage · readability. See `docs/ai-assisted-development.md`.
