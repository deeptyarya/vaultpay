# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server at http://localhost:3000
npm run build        # Production build
npm test             # Run all Playwright tests (headless)
npx playwright test tests/e2e/auth.spec.ts   # Run a single test file
npx playwright test --headed                 # Run with browser visible
npx playwright show-report                   # Open last HTML report
```

## Architecture

**VaultPay** is a single-page React app (Vite + React 18) with Playwright E2E tests. There is no backend — all data is hardcoded in `src/App.jsx`.

### App (`src/App.jsx`)
The entire application lives in one file. It contains:
- `MOCK_USERS` — hardcoded user credentials and account data (demo user: `demo@vaultpay.com` / `Demo@1234`)
- All UI views (sign-in form, dashboard, sidebar) rendered conditionally based on `isAuthenticated` state
- A simulated 1,200ms async sign-in delay via `setTimeout`
- All `data-testid` attributes used by Playwright tests are defined here

### Playwright Tests (`tests/e2e/`)
Tests run against the live dev server (`http://localhost:3000`). The `webServer` block in `playwright.config.ts` auto-starts the dev server in CI. All selectors use `data-testid` attributes — never CSS classes or text.

### CI/CD (`.github/workflows/playwright.yml`)
Triggers on push to `main`. Installs deps, installs Chromium only, runs `npm test`, and uploads `playwright-report/` as a GitHub Actions artifact (retained 30 days). The `if: always()` on the upload step ensures the report is saved even when tests fail.

---

## Rules for AI Agents

1. **Test plans first** — Before generating any E2E spec, verify `docs/test-plans/{feature}.md` exists. If missing, run `/test-plan {feature}` first.
2. **Locators** — Always use `getByTestId` as the primary locator. Fallback to `getByRole`. Never CSS selectors, text content, or XPath.
3. **Fixtures** — Import `login` and `navigateTo` from `tests/e2e/fixtures.ts`. Do not inline auth logic in test files.
4. **File organization** — One spec file per feature: Auth → `auth.spec.ts`, Send Money → `send-money.spec.ts`, Cards → `cards.spec.ts`, etc.
