# VaultPay E2E Test Conventions

Auto-applied when editing any file in `tests/e2e/`. These rules override general conventions for test code.

---

## Imports

- Import `login`, `navigateTo`, `BASE_URL`, `DEMO_EMAIL`, `DEMO_PASSWORD` from `./fixtures`.
- Never redefine credentials or base URL inline inside a spec file.
- **Auth specs only:** no `login()` in `beforeEach` — the tests exercise the login flow itself. Import `BASE_URL, DEMO_EMAIL, DEMO_PASSWORD` and call `page.goto(BASE_URL)` directly.

## Locators

- `page.getByTestId('...')` only. Never `getByText`, CSS class, or XPath.
- Case-sensitive — verify every value against `.claude/references/ui-selectors.md` before use.
- Common traps: `toggle-twoFactor` (not `toggle-TwoFactor`), `freeze-CARD-001` (not `freeze-card-001`).

## Navigation

- Use `navigateTo(page, feature)` for all post-login sidebar navigation.
- Valid values: `dashboard`, `transactions`, `send`, `cards`, `budget`, `settings`.
- Special case: `'send'` clicks `nav-send` but waits for `send-money-page` (testids don't share the same root).

## Async Patterns

- Never `page.waitForTimeout(N)` — wait on the outcome element instead.
- Sign-in / sign-up submit (1,200ms delay) → `waitFor({ state: 'visible' })` on `dashboard-page`.
- Send money confirm (1,500ms delay) → `waitFor({ state: 'visible' })` on `toast-message`.
- Toast auto-dismiss (3,000ms) → assert the toast appeared; do not wait for it to disappear unless the TC specifically tests dismissal (Toast-TC-003).

## TC Naming

- Test title must begin with the TC ID: `'Cards-TC-004: freeze Visa card shows FROZEN badge'`.
- TC IDs live in `docs/test-plans/{feature}.md`. Prefixes: `Auth`, `Nav`, `Dashboard`, `Trans`, `Send`, `Cards`, `Budget`, `Settings`, `Toast`, `Sec`.

## Method Documentation

**Spec file header** — every spec file must open with a JSDoc block:
```typescript
/**
 * {Feature} E2E Tests
 * Test plan: docs/test-plans/{feature}.md
 * E2E coverage: {TC-IDs listed}
 * Skipped ({Layer}): {TC-IDs} — {reason e.g. "isolated component render"}
 */
```

**Fixtures** — every exported function in `fixtures.ts` must have a JSDoc comment describing its behaviour and any non-obvious parameters.

**Multi-step tests** — any test with more than 3 actions must use `// Step N:` inline comments.

**Known limitation TCs** — first line inside the test body must be `// KNOWN LIMITATION: {what the app does not do}`.

## Test Structure

- Wrap each feature in `test.describe('FeatureName', ...)`.
- `test.beforeEach`: call `login(page)` + `navigateTo(page, feature)` when all tests in the block share a starting page.
- Each test is self-contained — no test relies on state left by a prior test.
- `test.only()` is banned — causes the rest of the suite to be silently skipped.

## Known Limitation TC IDs

`Send-TC-013` (balance not deducted), `Cards-TC-012` (lock card UI unchanged), `Settings-TC-014` (delete account no logout), `Sec-TC-010` (no-op buttons).
