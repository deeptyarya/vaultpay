# VaultPay — Playwright Test Spec Template

Standard structure for all VaultPay E2E test files. Every spec must follow this pattern.

---

## Standard Test File

```typescript
import { test, expect } from '@playwright/test';
import { login, navigateTo } from './fixtures';

test.describe('<FeatureName>', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Navigate to feature page if all tests share it:
    // await navigateTo(page, 'cards');
  });

  test('{Prefix}-TC-NNN: <concise descriptive title>', async ({ page }) => {
    // Step 1: Navigate
    await navigateTo(page, '<feature>');

    // Step 2: Interact
    await page.getByTestId('<selector>').click();

    // Step 3: Assert
    await expect(page.getByTestId('<outcome>')).toBeVisible();
    await expect(page.getByTestId('<outcome>')).toContainText('<expected text>');
  });
});
```

**Auth tests only:** No `login()` in `beforeEach`. Import `BASE_URL, DEMO_EMAIL, DEMO_PASSWORD` from `./fixtures` and call `page.goto(BASE_URL)` directly — the tests are exercising the login flow itself.

---

## Async Delay Patterns

| Operation | Delay | Wait Pattern |
|---|---|---|
| Sign-in submit | 1,200ms | `dashboard-page` waitFor visible |
| Sign-up submit | 1,200ms | `dashboard-page` waitFor visible |
| Send money confirm | 1,500ms | `toast-message` waitFor visible |
| Toast auto-dismiss | 3,000ms | Do NOT wait — just assert appeared |
| Toast dismiss test only (Toast-TC-003) | — | `waitFor({ state: 'hidden', timeout: 4000 })` |

---

## Common Assertion Patterns

```typescript
// Visibility
await expect(page.getByTestId('dashboard-page')).toBeVisible();
await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

// Text (prefer toContainText over toHaveText for partial matches)
await expect(page.getByTestId('stat-balance')).toContainText('$24,850.75');
await expect(page.getByTestId('form-error')).toHaveText('Invalid credentials. Try demo@vaultpay.com / Demo@1234');

// CSS class (use regex — element may have multiple classes)
await expect(page.getByTestId('toggle-twoFactor')).toHaveClass(/on/);
await expect(page.getByTestId('nav-dashboard')).toHaveClass(/active/);

// Row count
const rows = page.locator('[data-testid^="txn-row-"]');
await expect(rows).toHaveCount(12);

// Input value
await expect(page.getByTestId('settings-name')).toHaveValue('Alex Morgan');

// Button state
await expect(page.getByTestId('signin-submit')).toBeDisabled();
```

---

## Known Limitation Tests

Add `// KNOWN LIMITATION` comment for TCs that assert an app limitation is present:

```typescript
test('Send-TC-013: balance not deducted after transfer', async ({ page }) => {
  // KNOWN LIMITATION: balance never decreases after send money
  await expect(page.getByTestId('stat-balance')).toContainText('$24,850.75');
});
```

Known limitation TCs: `Send-TC-013` (balance), `Cards-TC-012` (lock card UI), `Settings-TC-014` (delete account logout), `Sec-TC-010` (no-op buttons).

---

## Anti-Patterns

| NEVER | Do instead |
|---|---|
| `page.waitForTimeout(1200)` | `waitFor({ state: 'visible' })` on outcome element |
| `page.waitForTimeout(3000)` for toast | Assert toast appeared, then proceed |
| `page.route('**/api/**', ...)` | Remove — VaultPay has zero API calls |
| `waitUntil: 'networkidle'` | Just `page.goto(url)` |
| `page.getByText('Sign In')` | `page.getByTestId('signin-submit')` |
| `.nth(0)` / `.first()` without filter | Use specific `data-testid` |
| `test.only()` left in code | Remove before commit |
| No assertion after action | Always assert the outcome |
| Asserting balance decreased after send | Assert it stayed at `$24,850.75` |
