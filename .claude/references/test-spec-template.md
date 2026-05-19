# VaultPay — Playwright Test Spec Template

Standard structure for all VaultPay E2E test files. Every spec must follow this pattern.

---

## Standard Test File

```typescript
/**
 * {Feature} E2E Tests
 * Test plan: docs/test-plans/{feature}.md
 * E2E coverage: {Prefix}-TC-001, {Prefix}-TC-002, …
 * Skipped (Component): {Prefix}-TC-003 — isolated render, no browser navigation
 * Skipped (Unit): {Prefix}-TC-004 — pure logic, no DOM interaction
 */
import { test, expect } from '../fixtures/base-fixture';
import { DEMO_USER } from '../fixtures/test-users';

test.describe('<FeatureName>', () => {
  test.beforeEach(async ({ authFlow, featurePage }) => {
    await authFlow.loginAsDemo();           // absorbs the 1,200ms sign-in delay
    await featurePage.navigateViaSidebar(); // sidebar click + waits for page container
  });

  test('{Prefix}-TC-NNN: <concise descriptive title>', async ({ featurePage }) => {
    // Step 1: Act via page object method
    await featurePage.someAction();

    // Step 2: Assert via page object locator
    await expect(featurePage.someLocator).toContainText('<expected text>');
  });
});
```

**Auth spec exception** — no `authFlow` in `beforeEach` (tests exercise the login flow itself):
```typescript
test.beforeEach(async ({ loginPage }) => {
  await loginPage.navigate();
});

test('Auth-TC-001: …', async ({ page, loginPage }) => {
  await loginPage.fillAndSubmit(DEMO_USER.email, DEMO_USER.password);
  await page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
  // … assertions
});
```

---

## Async Delay Patterns

| Operation | Delay | Wait pattern |
|---|---|---|
| Sign-in / sign-up submit | 1,200ms | `loginPage.waitForDashboard()` or `authFlow.loginAsDemo()` (handles it) |
| Send money confirm | 1,500ms | `sendMoneyPage.toastMessage.waitFor({ state: 'visible' })` |
| Toast auto-dismiss | 3,000ms | Assert toast appeared; do NOT wait for it to disappear unless TC tests dismissal |
| Toast dismiss test only (Toast-TC-003) | — | `toastMessage.waitFor({ state: 'hidden', timeout: 4000 })` |

---

## Common Assertion Patterns

```typescript
// Visibility (via page object locator)
await expect(dashboardPage.dashboardPage).toBeVisible();
await expect(cardsPage.modalOverlay).not.toBeVisible();

// Text (toContainText for partial, toHaveText for exact)
await expect(dashboardPage.statBalance).toContainText(DEMO_USER.balance);
await expect(loginPage.formError).toHaveText('Invalid credentials. Try demo@vaultpay.com / Demo@1234');

// Dynamic locator (card, transaction)
await expect(cardsPage.cardContainer('CARD-001')).toContainText('FROZEN');
await expect(transactionsPage.txnRow('TXN-001')).toBeVisible();

// CSS class (use regex — element may have multiple classes)
await expect(page.getByTestId('toggle-twoFactor')).toHaveClass(/on/);
await expect(page.getByTestId('nav-dashboard')).toHaveClass(/active/);

// Row count (via page object method)
expect(await transactionsPage.getVisibleRowCount()).toBe(12);

// Input value
await expect(settingsPage.settingsName).toHaveValue('Alex Morgan');

// Button state
await expect(loginPage.submitButton).toBeDisabled();
```

---

## Known Limitation Tests

```typescript
test('{Prefix}-TC-NNN: <title>', async ({ featurePage }) => {
  // KNOWN LIMITATION: <what the app does not do>
  // … assertions that confirm the limitation is still present
});
```

Known limitation TCs: `Send-TC-013` (balance not deducted), `Cards-TC-012` (lock card UI unchanged), `Settings-TC-014` (delete account no logout), `Sec-TC-010` (no-op buttons).

---

## Anti-Patterns

| NEVER | Do instead |
|---|---|
| `import { test, expect } from '@playwright/test'` in spec | Import from `'../fixtures/base-fixture'` |
| `page.getByTestId('freeze-CARD-001').click()` inline in spec | `cardsPage.toggleFreeze('CARD-001')` |
| `page.getByTestId('nav-cards').click()` inline | `cardsPage.navigateViaSidebar()` |
| `await page.goto('http://localhost:3000')` in spec | `loginPage.navigate()` (uses baseURL) |
| `page.waitForTimeout(1200)` | `loginPage.waitForDashboard()` or `authFlow.loginAsDemo()` |
| `page.waitForTimeout(1500)` | `sendMoneyPage.toastMessage.waitFor({ state: 'visible' })` |
| `page.waitForTimeout(3000)` for toast | Assert toast appeared, then proceed |
| `page.route('**/api/**', …)` | Remove — VaultPay has zero API calls |
| `waitUntil: 'networkidle'` | Just `page.goto(url)` |
| `page.getByText('Sign In')` | Use page object locator (`loginPage.submitButton`) |
| `.nth(0)` / `.first()` without filter | Use specific `data-testid` via page object method |
| `test.only()` left in code | Remove before commit |
| Asserting balance decreased after send | Assert it stayed at `$24,850.75` (known limitation) |
| Instantiating page objects in tests: `new CardsPage(page)` | Use fixture injection: `async ({ cardsPage }) => …` |
