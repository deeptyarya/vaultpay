# VaultPay — Test Review Checklist

Work through every item for each spec, page object, or flow under review.

---

## Page Object & Fixture Usage

- [ ] Spec imports `test`, `expect` from `../fixtures/base-fixture` — not `@playwright/test` directly — `[CRITICAL]`
- [ ] Spec file lives in `tests/e2e/tests/` not the `tests/e2e/` root — `[CRITICAL]`
- [ ] Authenticated tests use `authFlow.loginAsDemo()` in `beforeEach` — not inline `fill + click + waitFor` — `[IMPORTANT]`
- [ ] Navigation uses `<featurePage>.navigateViaSidebar()` — not raw `nav-X.click()` + `.waitFor()` — `[IMPORTANT]`
- [ ] User data comes from `DEMO_USER` constants (`DEMO_USER.email`, `DEMO_USER.balance`) — not inline strings — `[IMPORTANT]`
- [ ] Spec interactions call page object methods — not raw `page.getByTestId(...).click()` in test body — `[IMPORTANT]`
- [ ] Multi-step sequences (>3 PO interactions) extracted to a Flow class — `[SUGGESTION]`
- [ ] Flows call PO methods only — never `page`, `page.goto()`, or `page.getByTestId()` directly — `[CRITICAL]`
- [ ] Flows do not call `.waitFor()` or Playwright methods on PO Locator properties — use `waitForToast()`, `waitForModal()`, `confirmModal()`, `cancelModal()` instead — `[CRITICAL]`

## Auth Pattern

- [ ] Auth spec: `beforeEach` uses `loginPage.navigate()` only — no `authFlow` (tests exercise the login flow itself)
- [ ] After `loginPage.fillAndSubmit()`: waits for `loginPage.waitForDashboard()` — not `page.getByTestId(...)` directly, not `waitForTimeout` — `[CRITICAL]`
- [ ] No test skips authentication and directly navigates to an authenticated page without `authFlow.loginAsDemo()`

## Async Delay Handling

- [ ] Sign-in: after submit → `loginPage.waitForDashboard()` — not `waitForTimeout(1200)` — `[CRITICAL]`
- [ ] Sign-up: after submit → `page.getByTestId('dashboard-page').waitFor({ state: 'visible' })` — `[CRITICAL]`
- [ ] Send money confirm: after `modal-confirm` → toast `waitFor({ state: 'visible' })` — not `waitForTimeout(1500)` — `[CRITICAL]`
- [ ] No `page.waitForTimeout(N)` anywhere — `[CRITICAL]`

## Assertions

- [ ] Every toast message matches `references/business-rules.md` exactly — `[CRITICAL]`
- [ ] Every validation error matches `business-rules.md` exactly — `[CRITICAL]`
- [ ] CSS class assertions use regex: `toHaveClass(/on/)` not `toHaveClass('on')` — `[IMPORTANT]`
- [ ] Every action has a follow-up assertion — `[IMPORTANT]`

## Architecture Rules

- [ ] No `page.route()` calls — VaultPay has no API — `[CRITICAL]`
- [ ] No `waitUntil: 'networkidle'` — `[IMPORTANT]`
- [ ] No assertion that balance decreased after send money — assert it stayed at `$24,850.75` — `[CRITICAL]`
- [ ] Known limitation TCs (`Send-TC-013`, `Cards-TC-012`, `Settings-TC-014`, `Sec-TC-010`) assert the limitation IS present, not fixed

## Test Structure

- [ ] Tests grouped with `test.describe()` by feature
- [ ] Each describe block has `test.beforeEach` with login + navigate (if all tests share a starting page)
- [ ] Tests are self-contained — no test depends on state from a prior test
- [ ] Multi-step tests (>3 actions) use `// Step N:` comments
- [ ] `test.only()` not present — `[CRITICAL]`
- [ ] Known limitation tests have `// KNOWN LIMITATION: {description}` as the first line in the body

---

## Common Issues Reference

| Issue | Severity | Bad pattern | Fix |
|---|---|---|---|
| Wrong import | CRITICAL | `import { test } from '@playwright/test'` | `import { test } from '../fixtures/base-fixture'` |
| Flows access page directly | CRITICAL | `this.loginPage.page.getByTestId(...)` | Add method to PO: `loginPage.waitForDashboard()` |
| Flow calls `.waitFor()` on PO locator | CRITICAL | `this.cardsPage.toastMessage.waitFor(...)` | `this.cardsPage.waitForToast()` |
| Flow calls `.click()` on PO locator | CRITICAL | `this.sendPage.modalConfirm.click()` | `this.sendPage.confirmModal()` |
| Hard wait for login | CRITICAL | `waitForTimeout(1200)` | `authFlow.loginAsDemo()` or `loginPage.waitForDashboard()` |
| Hard wait for send delay | CRITICAL | `waitForTimeout(1500)` | Toast `waitFor({ state: 'visible' })` |
| Hard wait for toast | CRITICAL | `waitForTimeout(3000)` | Assert toast appeared; proceed |
| API route mock | CRITICAL | `page.route(...)` | Remove entirely |
| Balance deduction asserted | CRITICAL | `not.toContainText('$24,850.75')` | Invert — balance stays same |
| `test.only()` left in | CRITICAL | `test.only(...)` | Remove before commit |
| Wrong toast text | CRITICAL | `"Two Factor disabled"` | `"two Factor disabled"` (lowercase 'two') |
| Inline raw selector in spec | IMPORTANT | `page.getByTestId('freeze-CARD-001').click()` | `cardsPage.toggleFreeze('CARD-001')` |
| Inline nav in spec | IMPORTANT | `page.getByTestId('nav-cards').click()` | `cardsPage.navigateViaSidebar()` |
| Exact class match | IMPORTANT | `toHaveClass('on')` | `toHaveClass(/on/)` |
| Missing assertion after action | IMPORTANT | `click()` with no `expect` | Add `toBeVisible()` or equivalent |
| No login before authenticated page | IMPORTANT | Direct nav without auth | `authFlow.loginAsDemo()` in `beforeEach` |
| No `KNOWN LIMITATION` comment | SUGGESTION | Send-TC-013/Cards-TC-012 without comment | Add `// KNOWN LIMITATION` |
| No step comments | SUGGESTION | Complex test with no `// Step N:` | Add step comments |

---

## Issue Tag Format

```
[CRITICAL] Line 42 — Flows access page directly
  Current:  await this.loginPage.page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
  Fix:      await this.loginPage.waitForDashboard();
  Rule:     tests/e2e/CLAUDE.md — Writing New Flows
```
