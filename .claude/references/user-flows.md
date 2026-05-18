# VaultPay — User Flows & Playwright Test Scenarios

## Playwright Setup Notes

- App runs at `http://localhost:3000` (Vite dev server)
- No login persistence — every test that needs an authenticated state must sign in first
- No real network calls — no need to mock APIs
- Default browser: Chromium
- Auth credentials: `demo@vaultpay.com` / `Demo@1234`
- Simulated delays: 1,200ms on login/signup submit; 1,500ms on send money confirm

Use `tests/e2e/fixtures.ts` — `login(page)` and `navigateTo(page, feature)` are already defined there.

---

## Flow 1: Sign In

### Happy path
1. Go to `http://localhost:3000`
2. `signin-page` is visible
3. Fill `signin-email` with `demo@vaultpay.com`
4. Fill `signin-password` with `Demo@1234`
5. Click `signin-submit`
6. Button text changes to "Signing in..." (disabled state)
7. After ~1,200ms, `dashboard-page` appears
8. Sidebar visible with user's first name "Alex" in page title

### Failure scenarios
| Scenario | Action | Expected error |
|---|---|---|
| Empty email | Submit blank | `email-error`: "Email is required" |
| Invalid email format | Enter "notanemail" | `email-error`: "Invalid email format" |
| Empty password | Valid email, no password | `password-error`: "Password is required" |
| Short password | Password < 6 chars | `password-error`: "Password must be at least 6 characters" |
| Wrong credentials | `wrong@email.com` / `wrongpw` | `form-error`: "Invalid credentials. Try demo@vaultpay.com / Demo@1234" |

---

## Flow 2: Sign Up

### Happy path
1. On signin page, click `goto-signup`
2. `signup-page` appears
3. Fill `signup-name` with "Jane Doe"
4. Fill `signup-email` with "jane@test.com"
5. Fill `signup-password` with "Test@1234" — strength meter shows "Strong" (score 4)
6. Fill `signup-confirm-password` with "Test@1234"
7. Check `agree-terms`
8. Click `signup-submit` — button shows "Creating account..."
9. After ~1,200ms, `dashboard-page` appears with "Jane" in title and $1,000.00 balance

### Password strength meter scenarios
| Password | Score | Label | Color |
|---|---|---|---|
| `abc` (< 8 chars) | 0 | (bar not shown) | — |
| `abcdefgh` | 1 | Weak | red |
| `Abcdefgh` | 2 | Fair | amber |
| `Abcdefg1` | 3 | Good | blue |
| `Abcdefg1!` | 4 | Strong | green |

### Failure scenarios
| Scenario | Expected error selector | Message |
|---|---|---|
| Blank name | `name-error` | "Name is required" |
| Invalid email | `email-error` | "Invalid email format" |
| Password < 8 chars | `password-error` | "At least 8 characters required" |
| Passwords don't match | `confirm-error` | "Passwords don't match" |
| Terms not checked | `terms-error` | "You must agree to terms" |

---

## Flow 3: Navigation

After login, all pages are accessible via sidebar.

| Nav selector | Expected page testid | Page title |
|---|---|---|
| `nav-dashboard` | `dashboard-page` | "Welcome back, Alex" |
| `nav-transactions` | `transactions-page` | "Transactions" |
| `nav-send` | `send-money-page` | "Send Money" |
| `nav-cards` | `cards-page` | "My Cards" |
| `nav-budget` | `budget-page` | "Budget" |
| `nav-settings` | `settings-page` | "Settings" |
| `nav-logout` | `signin-page` | (auth page) |

Quick actions on Dashboard also navigate:
- `quick-send` → send-money-page
- `quick-cards` → cards-page
- `quick-budget` → budget-page
- `view-all-txn` → transactions-page

---

## Flow 4: Transactions — Filtering

Start: navigate to `nav-transactions`.
Full table shows all 12 transactions.

### Filter by type
| Select value | Expected rows |
|---|---|
| "credit" | TXN-002, TXN-007, TXN-011 (3 rows) |
| "debit" | 9 rows |

### Filter by status
| Select value | Expected rows |
|---|---|
| "pending" | TXN-006 only (1 row) |
| "completed" | 11 rows |

### Filter by category
| Select value | Expected rows |
|---|---|
| "Entertainment" | TXN-001, TXN-012 (2 rows) |
| "Income" | TXN-002, TXN-007 (2 rows) |

### Search
| Query | Expected rows |
|---|---|
| "netflix" (case-insensitive) | TXN-001 |
| "TXN-006" | TXN-006 |
| "amazon" | TXN-006 |
| "zzznotfound" | No results — `no-results` div visible |

### Combined filters
- Type: credit + Category: Income → TXN-002, TXN-007
- Status: pending + Type: debit → TXN-006

---

## Flow 5: Send Money

### Happy path (contact chip)
1. Navigate to `nav-send`
2. Click `contact-C-001` (Sarah K.) — chip gets `selected` class
3. Enter `100` in `send-amount`
4. Enter "Lunch split" in `send-note`
5. Click `send-submit`
6. Modal appears: "Send $100.00 to Sarah K.? Note: "Lunch split""
7. Click `modal-confirm`
8. Modal stays open, confirm button text "Sending..." for ~1,500ms
9. Toast appears: "Transfer sent successfully!"
10. Form resets — amount cleared, contact deselected, note cleared

### Happy path (manual email)
1. Navigate to `nav-send`
2. Type "friend@test.com" in `recipient-email`
3. Enter `50` in `send-amount`
4. Click `send-submit` → Modal: "Send $50.00 to friend@test.com?"
5. Confirm → success toast

### Validation scenarios
| Scenario | Expected error |
|---|---|
| No recipient, click send | `recipient-error`: "Select a contact or enter email" |
| Invalid manual email | `recipient-error`: "Invalid email" |
| Amount = 0 | `amount-error`: "Enter a valid amount" |
| Amount > balance ($24,850.75) | `amount-error`: "Insufficient balance" |

### Cancel flow
1. Fill valid data, click `send-submit`
2. Modal appears
3. Click `modal-cancel` OR click `modal-overlay`
4. Modal closes, form data preserved

---

## Flow 6: Cards — Freeze/Unfreeze

### Freeze a card
1. Navigate to `nav-cards`
2. `card-CARD-001` shows Visa with "Freeze" button
3. Click `freeze-CARD-001`
4. Card visual: background #374151, opacity 0.7, "FROZEN" badge visible
5. Button label changes to "Unfreeze"
6. Toast: "Card frozen"

### Unfreeze a card
1. With card frozen, click `freeze-CARD-001` again
2. Card returns to original color/opacity, "FROZEN" badge gone
3. Button label reverts to "Freeze"
4. Toast: "Card unfrozen"

### Lock card (danger action)
1. Click `lock-CARD-001`
2. Modal appears with danger styling (red confirm button)
3. Modal text confirms permanent lock
4. Click `modal-confirm`
5. Toast: "Card locked permanently" (error/red)
6. Note: card status does NOT change in UI (limitation)

### Lock cancel
1. Click `lock-CARD-001` → modal appears
2. Click `modal-cancel` → modal closes, no toast

---

## Flow 7: Budget

### Page load assertions
- `total-budget` shows $1,400
- `total-spent` shows $930.95
- `remaining-budget` shows $469.05 in green
- 6 category cards visible
- Shopping bar (`budget-shopping`) is at 88.3% — fill is still category color (< 90%)

### Near-limit assertion
Shopping: $264.99 / $300 = 88.3% → bar color is #ef4444 (shopping category color)
Note: bar turns red only at ≥ 90%, Shopping at 88.3% is not yet red.

---

## Flow 8: Settings

### Profile update
1. Navigate to `nav-settings`
2. Clear `settings-name` and type "New Name"
3. Click `save-profile`
4. Toast: "Profile updated"

### Toggle 2FA off
1. `toggle-twoFactor` has class `on` (default)
2. Click it
3. Class `on` removed
4. Toast: "two Factor disabled"

### Toggle biometric on
1. `toggle-biometric` does NOT have class `on` (default)
2. Click it
3. Class `on` added
4. Toast: "biometric enabled"

### Delete account flow
1. Click `delete-account`
2. Modal appears (danger)
3. Confirm → Toast: "Account deletion requested" (error/red)
4. Note: user is NOT actually logged out (limitation)

---

## Flow 9: Logout

1. Click `nav-logout`
2. `signin-page` appears
3. User state cleared — navigating back shows sign-in, not app

---

## Edge Cases & Known Limitations

| Behavior | Detail |
|---|---|
| No data persistence | All state resets on page refresh |
| Send Money balance | Transfer does not deduct from displayed balance |
| Lock card | UI does not update card status after locking |
| Delete account | User is not redirected/logged out |
| Change password | Button is present but no-op |
| Details button on cards | Button is present but no-op |
| Global search | Input is present but no-op |
| Notifications bell | Button is present but no-op |
| Forgot password | Link is present but no-op |
| Card limits table | "Used Today: $347.00" is static for both cards |
