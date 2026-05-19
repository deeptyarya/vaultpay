# VaultPay E2E Test Conventions

Auto-applied when editing any file in `tests/e2e/`. These rules override general conventions for test code.

---

## Imports

- Import `test`, `expect` from `../fixtures/base-fixture`. Never import from `@playwright/test` directly in spec files.
- Import `DEMO_USER` from `../fixtures/test-users` when credentials or user data are needed in assertions.
- Never redefine credentials or base URL inline inside a spec file.
- **Auth specs only:** no `authFlow` in `beforeEach` — the tests exercise the login flow itself. Use `loginPage` fixture and call `loginPage.navigate()` directly.

## Locators

- `page.getByTestId('...')` only. Never `getByText`, CSS class, or XPath.
- Case-sensitive — verify every value against the page object constructor in `tests/e2e/pages/*.ts`.
- Common traps: `toggle-twoFactor` (not `toggle-TwoFactor`), `freeze-CARD-001` (not `freeze-card-001`).

## Navigation

- Use each page object's `navigateViaSidebar()` method for post-login sidebar navigation (e.g. `cardsPage.navigateViaSidebar()`).
- For the login page, use `loginPage.navigate()` which calls `page.goto('/')`.
- Special case: `sendMoneyPage.navigateViaSidebar()` clicks `nav-send` but waits for `send-money-page` (testids don't share the same root — handled internally by the page object).

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

**Page objects** — every public method on a page object or flow class must have a JSDoc comment when its behaviour or parameters are non-obvious.

**Multi-step tests** — any test with more than 3 actions must use `// Step N:` inline comments.

**Known limitation TCs** — first line inside the test body must be `// KNOWN LIMITATION: {what the app does not do}`.

## Test Structure

- Wrap each feature in `test.describe('FeatureName', ...)`.
- `test.beforeEach`: use `authFlow.loginAsDemo()` + `<featurePage>.navigateViaSidebar()` when all tests in the block share a starting page.
- Each test is self-contained — no test relies on state left by a prior test.
- `test.only()` is banned — causes the rest of the suite to be silently skipped.

## Known Limitation TC IDs

`Send-TC-013` (balance not deducted), `Cards-TC-012` (lock card UI unchanged), `Settings-TC-014` (delete account no logout), `Sec-TC-010` (no-op buttons).

---

## Writing New Page Objects

When adding a page object for a new feature:

- Extend `BasePage`. Define `path` as `readonly`. Define `requiredElements` as a **getter** (not a readonly property).
- **Sidebar-only pages** (no direct URL): set `path = ''`, override `navigate()` to throw an error, expose `navigateViaSidebar()` as a public method.
- **Dynamic locators** (parameterized by ID, e.g. card or transaction ID): implement as methods returning `Locator`, not pre-bound class properties.
- `page` is **`protected`** — never access it from a flow. If a flow needs to wait for an element, add a dedicated method to the page object (e.g., `loginPage.waitForDashboard()`).
- All locators set in the constructor via `page.getByTestId('...')`.
- Register the new page object in `tests/e2e/fixtures/base-fixture.ts`.

```typescript
export class MyFeaturePage extends BasePage {
  readonly path = '';                                          // sidebar-only
  readonly myFeaturePage: Locator;

  constructor(page: Page) {
    super(page);
    this.myFeaturePage = page.getByTestId('my-feature-page');
  }

  get requiredElements(): Locator[] { return [this.myFeaturePage]; }

  override navigate(): Promise<void> {
    throw new Error('MyFeaturePage has no direct URL — use navigateViaSidebar()');
  }

  async navigateViaSidebar(): Promise<void> {
    await super.navigateViaSidebar('nav-my-feature', 'my-feature-page');
  }

  itemById(id: string): Locator { return this.page.getByTestId(`item-${id}`); }
}
```

## Writing New Flows

When adding a flow for a new feature:

- Constructor takes **one page object** only.
- Flows call **page object methods exclusively** — never `page`, `page.goto()`, or `page.getByTestId()` directly.
- Action flows return `Promise<void>`; full-journey flows with an observable outcome return `Promise<boolean>`.
- If a flow needs an interaction that doesn't have a page object method yet, add the method to the page object first.
- Register the new flow in `tests/e2e/fixtures/base-fixture.ts`.

```typescript
export class MyFeatureFlow {
  constructor(private myPage: MyFeaturePage) {}

  async doSomething(id: string): Promise<void> {
    await this.myPage.someAction(id);
    await this.myPage.toastMessage.waitFor({ state: 'visible' });
  }
}
```
