# VaultPay

A frontend-only fintech demo app built with React 18 and Vite. All data is mocked — no backend, no real transactions. Built to demonstrate E2E test automation with Playwright and AI-assisted test generation using Claude Code.

---

## What It Is

VaultPay simulates a personal finance dashboard with six features:

| Feature | What it does |
|---|---|
| Dashboard | Balance, recent transactions, quick stats |
| Transactions | Full transaction history with search and filter |
| Send Money | Transfer flow with contact chips, validation, confirmation modal |
| Cards | Freeze/unfreeze cards, lock card, card limits table |
| Budget | Budget categories with progress bars |
| Settings | Profile, notifications, security, linked accounts |

**Demo credentials** — `demo@vaultpay.com` / `Demo@1234`

---

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## Running Tests

```bash
npm test                                           # all tests, headless
npx playwright test --headed                       # headed (watch the browser)
npx playwright test tests/e2e/auth.spec.ts         # single spec file
npx playwright test --reporter=line                # compact output
npx playwright show-report                         # open last HTML report
```

Test specs live in `tests/e2e/`. The dev server must be running before you run tests.

---

## AI Test Infrastructure

This repo uses two Claude Code skills to generate and maintain tests. Run them from inside Claude Code.

### Workflow

```
/test-plan cards          →  writes docs/test-plans/cards.md
/generate-tests cards     →  writes tests/e2e/cards.spec.ts, runs it, self-reviews
```

Always run `/test-plan` before `/generate-tests`. If a test plan already exists, go straight to `/generate-tests`.

### What each skill does

| Skill | Command | Output |
|---|---|---|
| test-plan | `/test-plan [feature]` | `docs/test-plans/{feature}.md` — TC scenarios with priority, layer, business rule refs |
| generate-tests | `/generate-tests [feature]` | `tests/e2e/{feature}.spec.ts` — Playwright spec, run until green, then self-reviewed |

You can also target specific TCs: `/generate-tests Cards-TC-004 Cards-TC-005`

### Repo layout

```
vaultpay-fintech/
├── src/App.jsx                    # entire app — all mock data lives here
├── tests/e2e/
│   ├── fixtures.ts                # shared login + navigateTo helpers
│   ├── auth.spec.ts               # Auth E2E tests (Auth-TC-001 …)
│   └── cards.spec.ts              # Cards E2E tests (Cards-TC-001 …)
├── docs/test-plans/               # one .md per feature — 135 TCs total
│   └── auth.md, cards.md, …
├── playwright.config.ts
└── .claude/
    ├── README.md                  # AI infrastructure detail (skills, references, rules)
    ├── skills/
    │   ├── test-plan/SKILL.md
    │   └── generate-tests/SKILL.md
    └── references/                # domain knowledge loaded by skills
        ├── domain.md              # app facts, mock data, credentials
        ├── business-rules.md      # exact validation messages and toast strings
        ├── ui-selectors.md        # all data-testid values by page
        ├── user-flows.md          # step-by-step flows, async delays, known limitations
        ├── test-planning.md       # TC format spec and coverage checklist
        ├── test-spec-template.md  # Playwright code structure and assertion patterns
        └── review-checklist.md    # quality checklist run after test generation
```

For a deeper explanation of every file and rule, see [`.claude/README.md`](.claude/README.md).

---

## Tech Stack

| Layer | Tool |
|---|---|
| UI | React 18.2, plain JSX (no TypeScript in src) |
| Build | Vite 5.4 |
| Tests | Playwright (TypeScript) |
| CI | GitHub Actions — push to main, Chromium only |
