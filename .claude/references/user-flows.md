# VaultPay — User Flows Reference

## Playwright Setup

- App: `http://localhost:3000` (Vite dev server, baseURL in `playwright.config.ts`)
- No login persistence — every test needing auth must call `authFlow.loginAsDemo()`
- No real API calls — never use `page.route()` or `waitUntil: 'networkidle'`
- Credentials: see `domain.md`
- Default browser: Chromium

## Simulated Async Delays

| Action | Delay | Wait pattern |
|---|---|---|
| Sign-in submit | 1,200ms | `loginPage.waitForDashboard()` (waits for `dashboard-page` visible) |
| Sign-up submit | 1,200ms | `page.getByTestId('dashboard-page').waitFor({ state: 'visible' })` |
| Send money confirm | 1,500ms | `page.getByTestId('toast-message').waitFor({ state: 'visible' })` |
| Toast auto-dismiss | 3,000ms | Assert toast appeared; do NOT wait for disappear unless TC tests dismissal |

## Flow Implementations

Step-by-step logic lives in the flow classes — read the source for implementation detail:

| User journey | Implementation |
|---|---|
| Sign in as demo user | `AuthFlow.loginAsDemo()` in `tests/e2e/flows/AuthFlow.ts` |
| Freeze / unfreeze a card | `CardFlow.freezeCard(id)` in `tests/e2e/flows/CardFlow.ts` |
| Lock a card (with modal confirm) | `CardFlow.lockCard(id)` in `tests/e2e/flows/CardFlow.ts` |
| Send money to a contact | `SendMoneyFlow.sendToContact(contactId, amount, note)` in `tests/e2e/flows/SendMoneyFlow.ts` |
| Filter transactions | `TransactionFlow.filterByType/Status/Category()` in `tests/e2e/flows/TransactionFlow.ts` |

## Navigation Map (post-login)

| Nav testid | Page container testid | Page title | Notes |
|---|---|---|---|
| `nav-dashboard` | `dashboard-page` | "Welcome back, Alex" | |
| `nav-transactions` | `transactions-page` | "Transactions" | |
| `nav-send` | `send-money-page` | "Send Money" | Nav testid ≠ page root (asymmetric by design) |
| `nav-cards` | `cards-page` | "My Cards" | |
| `nav-budget` | `budget-page` | "Budget" | |
| `nav-settings` | `settings-page` | "Settings" | |
| `nav-logout` | `signin-page` | (auth page) | Clears user state |

Quick actions on dashboard also navigate:
`quick-send` → send-money-page · `quick-cards` → cards-page · `quick-budget` → budget-page · `view-all-txn` → transactions-page

## Validation Error Tables

Exact error strings — verify against `business-rules.md` before asserting.

### Sign In
| Scenario | Selector | Message |
|---|---|---|
| Empty email | `email-error` | "Email is required" |
| Invalid email format | `email-error` | "Invalid email format" |
| Empty password | `password-error` | "Password is required" |
| Password < 6 chars | `password-error` | "Password must be at least 6 characters" |
| Wrong credentials | `form-error` | "Invalid credentials. Try demo@vaultpay.com / Demo@1234" |

### Send Money
| Scenario | Selector | Message |
|---|---|---|
| No recipient | `recipient-error` | "Select a contact or enter email" |
| Invalid manual email | `recipient-error` | "Invalid email" |
| Amount = 0 | `amount-error` | "Enter a valid amount" |
| Amount > balance | `amount-error` | "Insufficient balance" |

### Sign Up
| Scenario | Selector | Message |
|---|---|---|
| Blank name | `name-error` | "Name is required" |
| Invalid email | `email-error` | "Invalid email format" |
| Password < 8 chars | `password-error` | "At least 8 characters required" |
| Passwords don't match | `confirm-error` | "Passwords don't match" |
| Terms not checked | `terms-error` | "You must agree to terms" |

## Known Limitations (Documented App Behavior)

These TCs assert that the limitation IS present — do not assert it is fixed.

| TC ID | Behavior | Detail |
|---|---|---|
| Send-TC-013 | Balance not deducted after transfer | `stat-balance` stays `$24,850.75` after send |
| Cards-TC-012 | Lock card doesn't update card UI | Card shows no FROZEN badge, freeze button still reads "Freeze" |
| Settings-TC-014 | Delete account doesn't log user out | `dashboard-page` remains visible after "Account deletion requested" toast |
| Sec-TC-010 | No-op buttons present | Change Password, Details (card), Global Search, Notifications bell — all no-op |
