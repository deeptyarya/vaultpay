# VaultPay Test Plan — Security & Edge Cases

## SECURITY & EDGE CASES

## Sec-TC-001: Security — XSS-Like Input in Send Money Note Field
**Category**: Security
**Priority**: P1
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Click `contact-C-001`
2. Fill `send-amount` with `50`
3. Fill `send-note` with `<script>alert("xss")</script>`
4. Click `send-submit`
5. Observe modal content

**Expected Results**:
- Modal renders the note as plain text, not executed HTML
- No JavaScript alert fires
- App remains functional

**Business Rule**: React escapes JSX interpolation by default — string content is not evaluated as HTML ([Code behavior: App.jsx:469 — note rendered in template literal inside JSX])  
**Suggested Layer**: E2E

## Sec-TC-002: Security — XSS-Like Input in Transactions Search
**Category**: Security
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Fill `txn-search` with `<img src=x onerror=alert(1)>`

**Expected Results**:
- No JavaScript executes
- Empty state or no results shown
- App remains stable

**Business Rule**: React renders search value as text, not HTML; no dangerous innerHTML usage ([Code behavior: App.jsx:349])  
**Suggested Layer**: E2E

## Sec-TC-003: Security — Attempt to Sign In With SQL Injection Pattern
**Category**: Security
**Priority**: P2
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Fill `signin-email` with `' OR 1=1 --`
2. Fill `signin-password` with `anything`
3. Click `signin-submit`

**Expected Results**:
- `email-error` shows "Invalid email format" (fails regex before any credential check)
- No bypass of auth occurs

**Business Rule**: Email regex validation rejects injection strings before credential check — purely client-side array lookup anyway ([Code behavior: App.jsx:109])  
**Suggested Layer**: Unit

## Sec-TC-004: Edge Case — Very Large Amount Input in Send Money
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Click `contact-C-001`
2. Fill `send-amount` with `999999999999`
3. Click `send-submit`

**Expected Results**:
- `amount-error` shows "Insufficient balance"
- No modal appears

**Business Rule**: Any amount > $24,850.75 triggers insufficient balance check (business-rules.md § Send Money Validation)  
**Suggested Layer**: E2E

## Sec-TC-005: Edge Case — Negative Amount Input in Send Money
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Click `contact-C-001`
2. Fill `send-amount` with `-100`
3. Click `send-submit`

**Expected Results**:
- `amount-error` shows "Enter a valid amount" (parseFloat(-100) <= 0 is false — actually -100 < 0 ≤ 0 is true... wait, the rule is `parseFloat(amount) <= 0`)
- Modal does NOT appear

**Business Rule**: Amount validation: `parseFloat(amount) <= 0` — negative values fail this check ([Code behavior: App.jsx:407])  
**Suggested Layer**: Unit

## Sec-TC-006: Edge Case — State Resets After Page Refresh
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in as demo user on Dashboard.
**Steps**:
1. Navigate to Cards page, freeze CARD-001
2. Navigate to Settings, toggle biometric on
3. Refresh the browser page (F5 / Cmd+R)

**Expected Results**:
- App returns to Sign In page (no persistent auth)
- After logging in again: CARD-001 is active (not frozen)
- Biometric toggle is OFF (default state)

**Business Rule**: No data persistence — all state resets on page refresh (user-flows.md § Known Limitations)  
**Suggested Layer**: E2E

## Sec-TC-007: Edge Case — Sending to All Four Contacts Works
**Category**: Happy Path
**Priority**: P2
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Click each contact chip one at a time (C-002, C-003, C-004) to confirm each can be selected
2. For each: fill amount `10`, click `send-submit`, confirm modal

**Expected Results**:
- Each contact chip can be individually selected
- Transfer flow completes for each contact
- No errors for valid contacts

**Business Rule**: All 4 CONTACTS entries are selectable recipients (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Sec-TC-008: Edge Case — Decimal Amount in Send Money
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Click `contact-C-001`
2. Fill `send-amount` with `24.99`
3. Click `send-submit`

**Expected Results**:
- Modal shows "Send $24.99 to Sarah K.?"
- Amount formatted to 2 decimal places in modal

**Business Rule**: Amount uses `parseFloat(amount).toFixed(2)` in modal text ([Code behavior: App.jsx:469])  
**Suggested Layer**: E2E

## Sec-TC-009: Edge Case — Budget Page Percentage Display Rounding
**Category**: Edge Case
**Priority**: P3
**Preconditions**: Logged in. On Budget page.
**Steps**:
1. Observe `budget-groceries` percentage label

**Expected Results**:
- Displays "72% used" (71.8575...% rounded to 0 decimal places via `toFixed(0)`)

**Business Rule**: `pct.toFixed(0)` — rounds to nearest integer ([Code behavior: App.jsx:592])  
**Suggested Layer**: Unit

## Sec-TC-010: Security — No-Op Buttons Are Present But Harmless
**Category**: Security
**Priority**: P3
**Preconditions**: Logged in. Navigate to relevant pages.
**Steps**:
1. On Cards page: click `details-CARD-001` and `details-CARD-002`
2. On header: observe `global-search` and `notifications-btn`
3. On Sign In: click `forgot-password`
4. On Settings: click `change-password`

**Expected Results**:
- No navigation, no toast, no modal, no JavaScript error for any of these
- App remains stable and interactive after clicking

**Business Rule**: No-op buttons — present but unimplemented (user-flows.md § Known Limitations)  
**Suggested Layer**: E2E

## Sec-TC-011: Edge Case — Rapid Toggle Clicks on Settings
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in. On Settings page.
**Steps**:
1. Click `toggle-twoFactor` rapidly 4 times in quick succession

**Expected Results**:
- Final state reflects an even number of clicks (back to ON after 4 clicks)
- App does not crash or enter an inconsistent state
- Toast may fire multiple times (once per click)

**Business Rule**: Each click calls toggle(), which reads current state and flips it — React batching may coalesce rapid state updates ([Code behavior: App.jsx:605])  
**Suggested Layer**: Component

## Sec-TC-012: Security — Sign In Credentials Are Not Exposed in DOM
**Category**: Security
**Priority**: P1
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Fill `signin-password` with `Demo@1234`
2. Without toggling visibility, inspect the input element in browser DevTools

**Expected Results**:
- Input type attribute is "password"
- Characters are masked in the viewport
- The DOM attribute `type` is "password" (not "text")

**Business Rule**: Password input defaults to type="password"; showPw must be explicitly toggled ([Code behavior: App.jsx:145])  
**Suggested Layer**: E2E

---

<!-- End of VaultPay Test Scenario Suite | TC-001 — TC-135 -->

