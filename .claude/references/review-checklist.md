# VaultPay — Test Review Checklist

Work through every item for each test file under review.

---

## Auth & Login Pattern

- [ ] Every test needing auth imports and calls `login(page)` from `./fixtures`
- [ ] `login()` waits for `dashboard-page` with `waitFor({ state: 'visible' })` — not `waitForTimeout(1200)`
- [ ] Credentials use exported constants (`DEMO_EMAIL`, `DEMO_PASSWORD`) — not inline strings
- [ ] No test skips login and directly navigates to an authenticated page

## Selectors

- [ ] All selectors use `page.getByTestId('...')` — flag any `getByText()`, CSS locator, `.nth()`, or XPath
- [ ] Every `data-testid` value exactly matches `references/ui-selectors.md` (case-sensitive: `freeze-CARD-001` not `freeze-card-001`, `toggle-twoFactor` not `toggle-twofactor`)
- [ ] Row counts use `page.locator('[data-testid^="txn-row-"]')` + `.toHaveCount(N)`

## Async Delay Handling

- [ ] Sign-in: after `signin-submit` click → waits for `dashboard-page` visible, not `waitForTimeout(1200)` — `[CRITICAL]`
- [ ] Sign-up: after `signup-submit` click → waits for `dashboard-page` visible, not `waitForTimeout(1200)` — `[CRITICAL]`
- [ ] Send money confirm: after `modal-confirm` click → waits for `toast-message` visible, not `waitForTimeout(1500)` — `[CRITICAL]`
- [ ] Any `page.waitForTimeout(N)` anywhere — `[CRITICAL]`

## Assertions

- [ ] Every toast message matches `references/business-rules.md` exactly (common traps: `"two Factor disabled"` not `"Two Factor disabled"`, `"biometric enabled"` lowercase)
- [ ] Every validation error matches `business-rules.md` exactly (`"Password must be at least 6 characters"` not `"at least 6 chars"`)
- [ ] CSS class assertions use `toHaveClass(/on/)` (regex), not `toHaveClass('on')` (exact match)
- [ ] Every click has a follow-up assertion

## Architecture Rules

- [ ] No `page.route()` calls — VaultPay has no API — `[CRITICAL]`
- [ ] No `waitUntil: 'networkidle'` — `[IMPORTANT]`
- [ ] No assertion that balance decreased after send money — `[CRITICAL]`
- [ ] Known limitation TCs (`Send-TC-013`, `Cards-TC-012`, `Settings-TC-014`, `Sec-TC-010`) assert the limitation IS present, not that it is fixed

## Test Structure

- [ ] Tests grouped with `test.describe()` by feature
- [ ] Each describe block has `test.beforeEach` with `login()` + navigate (if applicable)
- [ ] Tests are self-contained — no test depends on prior test state
- [ ] Multi-step tests (>3 actions) use `// Step N:` comments
- [ ] `test.only()` not present — `[CRITICAL]`
- [ ] No hardcoded transaction IDs that don't exist in domain.md (`MOCK_TRANSACTIONS`)

---

## Common Issues Reference

| Issue | Severity | Pattern | Fix |
|---|---|---|---|
| Hard wait for login | CRITICAL | `waitForTimeout(1200)` | `dashboard-page` waitFor visible |
| Hard wait for send delay | CRITICAL | `waitForTimeout(1500)` | `toast-message` waitFor visible |
| Hard wait for toast | CRITICAL | `waitForTimeout(3000)` | Just assert toast appeared |
| API route mock | CRITICAL | `page.route(...)` | Remove entirely |
| Wrong toast text | CRITICAL | `"Two Factor disabled"` | `"two Factor disabled"` (lowercase 'two') |
| Wrong selector case | CRITICAL | `"toggle-TwoFactor"` | `"toggle-twoFactor"` |
| Balance deduction asserted | CRITICAL | `expect(stat-balance).not.toContainText('$24,850.75')` | Invert — balance stays same |
| `getByText` instead of `getByTestId` | IMPORTANT | `page.getByText('Sign In')` | `page.getByTestId('signin-submit')` |
| Exact class match | IMPORTANT | `toHaveClass('on')` | `toHaveClass(/on/)` |
| Missing assertion after action | IMPORTANT | `click()` with no `expect` | Add `toBeVisible()` or equivalent |
| `waitUntil: networkidle` | IMPORTANT | `goto(url, { waitUntil: 'networkidle' })` | Just `goto(url)` |
| No login before authenticated page | IMPORTANT | Direct `nav-cards.click()` without auth | Call `login(page)` first |
| No `KNOWN LIMITATION` comment | SUGGESTION | Send-TC-013/Cards-TC-012/Settings-TC-014 without comment | Add `// KNOWN LIMITATION` |
| No step comments | SUGGESTION | Complex test with no `// Step N:` | Add step comments |

---

## Issue Tag Format

```
[CRITICAL] Line 42 — Wrong wait strategy
  Current:  await page.waitForTimeout(1200);
  Fix:      await page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
  Rule:     test-spec-template.md — Async Delay Patterns
```
