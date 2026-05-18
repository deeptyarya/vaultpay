# VaultPay Test Plan — Send Money

## SEND MONEY

## Send-TC-001: Send Money — Happy Path via Contact Chip (With Note)
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in as demo user. Navigate to `nav-send`.
**Steps**:
1. Click `contact-C-001` (Sarah K.)
2. Fill `send-amount` with `100`
3. Fill `send-note` with `Lunch split`
4. Click `send-submit`
5. Observe modal content
6. Click `modal-confirm`
7. Wait up to 2,500ms

**Expected Results**:
- After step 4: modal appears; `modal-overlay` and `modal` are visible
- Modal text contains "Send $100.00 to Sarah K.?" and `Note: "Lunch split"`
- After confirm: `toast-message` visible with text "Transfer sent successfully!"
- Form resets: amount is empty, contact chip is deselected, note is empty

**Business Rule**: Send Money flow — contact chip, modal, 1,500ms delay, success toast, form reset (business-rules.md § Send Money Flow)  
**Suggested Layer**: E2E

## Send-TC-002: Send Money — Happy Path via Manual Email (No Note)
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Fill `recipient-email` with `friend@test.com`
2. Fill `send-amount` with `50`
3. Click `send-submit`
4. Click `modal-confirm`
5. Wait for completion

**Expected Results**:
- Modal text reads "Send $50.00 to friend@test.com?" with no Note line
- Success toast appears
- Form resets

**Business Rule**: Note omitted from modal text when note field is empty ([Code behavior: App.jsx:469 — note ? ` Note: "${note}"` : ""])  
**Suggested Layer**: E2E

## Send-TC-003: Send Money — Selecting Contact Chip Clears Manual Email
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Send Money page. `recipient-email` has been filled with `someone@test.com`.
**Steps**:
1. Click `contact-C-002` (James W.)

**Expected Results**:
- `contact-C-002` chip has class `selected`
- `recipient-email` input is now empty
- `contact-C-001`, `contact-C-003`, `contact-C-004` are not selected

**Business Rule**: Recipient exclusivity — selecting contact sets customEmail to "" ([Code behavior: App.jsx:437])  
**Suggested Layer**: Component

## Send-TC-004: Send Money — Typing Email Deselects Contact Chip
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Send Money page. `contact-C-001` is currently selected.
**Steps**:
1. Type `a` in `recipient-email`

**Expected Results**:
- `contact-C-001` chip no longer has class `selected`
- All chips are unselected

**Business Rule**: Recipient exclusivity — typing in email sets selected contact to null ([Code behavior: App.jsx:444])  
**Suggested Layer**: Component

## Send-TC-005: Send Money — No Recipient Selected
**Category**: Negative
**Priority**: P1
**Preconditions**: Logged in. On Send Money page. No contact selected, recipient email empty.
**Steps**:
1. Fill `send-amount` with `100`
2. Click `send-submit`

**Expected Results**:
- `recipient-error` visible with text "Select a contact or enter email"
- No modal appears

**Business Rule**: Recipient required — "Select a contact or enter email" (business-rules.md § Send Money Validation)  
**Suggested Layer**: E2E

## Send-TC-006: Send Money — Invalid Manual Email Format
**Category**: Negative
**Priority**: P1
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Fill `recipient-email` with `notanemail`
2. Fill `send-amount` with `100`
3. Click `send-submit`

**Expected Results**:
- `recipient-error` visible with text "Invalid email"
- No modal appears

**Business Rule**: Custom email format must match regex — "Invalid email" (business-rules.md § Send Money Validation)  
**Suggested Layer**: E2E

## Send-TC-007: Send Money — Amount of Zero
**Category**: Negative
**Priority**: P1
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Click `contact-C-001`
2. Fill `send-amount` with `0`
3. Click `send-submit`

**Expected Results**:
- `amount-error` visible with text "Enter a valid amount"
- No modal appears

**Business Rule**: Amount must be > 0 — "Enter a valid amount" (business-rules.md § Send Money Validation)  
**Suggested Layer**: E2E

## Send-TC-008: Send Money — Amount Exceeds Balance (Insufficient Funds)
**Category**: Business Rule
**Priority**: P0
**Preconditions**: Logged in as demo user (balance $24,850.75). On Send Money page.
**Steps**:
1. Click `contact-C-001`
2. Fill `send-amount` with `99999`
3. Click `send-submit`

**Expected Results**:
- `amount-error` visible with text "Insufficient balance"
- No modal appears

**Business Rule**: Amount > user.balance triggers "Insufficient balance" (business-rules.md § Send Money Validation)  
**Suggested Layer**: E2E

## Send-TC-009: Send Money — Amount Exactly Equal to Balance (Boundary)
**Category**: Edge Case
**Priority**: P1
**Preconditions**: Logged in as demo user (balance $24,850.75). On Send Money page.
**Steps**:
1. Click `contact-C-001`
2. Fill `send-amount` with `24850.75`
3. Click `send-submit`

**Expected Results**:
- Modal appears (amount is NOT greater than balance, so validation passes)
- No `amount-error` shown

**Business Rule**: Validation is `amount > user.balance` — equal-to-balance passes ([Code behavior: App.jsx:408])  
**Suggested Layer**: Unit

## Send-TC-010: Send Money — Cancel via Cancel Button (Form Preserved)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Send Money page. `contact-C-003` selected, amount `200`, note "Test note". Modal is open.
**Steps**:
1. Click `modal-cancel`

**Expected Results**:
- `modal-overlay` is no longer visible
- `send-amount` still shows `200`
- `send-note` still shows "Test note"
- `contact-C-003` chip is still selected

**Business Rule**: Cancel closes modal, form state is preserved ([Code behavior: App.jsx:474 — onCancel sets showConfirm false, form state unchanged])  
**Suggested Layer**: E2E

## Send-TC-011: Send Money — Cancel via Overlay Click (Form Preserved)
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Send Money page. Modal is open.
**Steps**:
1. Click `modal-overlay` (outside the modal box)

**Expected Results**:
- Modal closes
- Form data is preserved (same as Send-TC-010)

**Business Rule**: Modal overlay click calls onCancel (business-rules.md § Modal Component)  
**Suggested Layer**: E2E

## Send-TC-012: Send Money — Confirm Loading State During Transfer
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. On Send Money page. Modal is open after valid send.
**Steps**:
1. Click `modal-confirm`
2. Immediately observe button state

**Expected Results**:
- `modal-confirm` button text changes to "Sending..."
- Modal remains open during the ~1,500ms delay

**Business Rule**: 1,500ms simulated delay during confirm; button shows "Sending..." ([Code behavior: App.jsx:419–424])  
**Suggested Layer**: E2E

## Send-TC-013: Send Money — Balance Not Deducted After Transfer (Known Limitation)
**Category**: Edge Case
**Priority**: P3
**Preconditions**: Logged in. Successfully completed a send money transfer.
**Steps**:
1. Observe `stat-balance` on Dashboard before transfer (TC-039 baseline: $24,850.75)
2. Navigate to Send Money, send $100
3. Navigate back to Dashboard
4. Observe `stat-balance`

**Expected Results**:
- `stat-balance` still shows $24,850.75 (unchanged)
- No deduction has occurred

**Business Rule**: Transfer does NOT deduct from user.balance — UI-only action (user-flows.md § Known Limitations)  
**Suggested Layer**: E2E

## Send-TC-014: Send Money — Note Is Fully Optional
**Category**: Happy Path
**Priority**: P2
**Preconditions**: Logged in. On Send Money page.
**Steps**:
1. Click `contact-C-004`
2. Fill `send-amount` with `25`
3. Leave `send-note` empty
4. Click `send-submit`

**Expected Results**:
- Modal appears without any note content in message
- Modal confirm succeeds normally

**Business Rule**: Note is optional — "max not enforced" (business-rules.md § Send Money Validation)  
**Suggested Layer**: E2E

---

