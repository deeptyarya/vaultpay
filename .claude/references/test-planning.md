# VaultPay — Test Planning Guide

Every test plan must follow this structure. Used by the `/test-plan` skill and by anyone writing test plans manually.

---

## Scenario Category Buckets

| Category | When to use |
|---|---|
| **Happy Path** | The expected flow when everything is valid and the user does the right thing |
| **Business Rule** | A specific rule is enforced — isolate exactly one rule per scenario |
| **Negative** | Invalid input, wrong credentials, missing required fields |
| **Edge Case** | Boundary values, empty states, extreme inputs, known app limitations |
| **Security** | XSS-like inputs, SQL injection patterns, attempting to exceed limits |
| **UI State** | Visual changes: toggles, frozen cards, loading buttons, badge colors |

---

## Priority Levels

| Priority | Definition |
|---|---|
| **P0** | Blocks core user value — app is unusable without these working |
| **P1** | Key feature correctness — user-visible bugs, validation, critical actions |
| **P2** | Secondary flows — edge cases, non-critical toggles, optional fields |
| **P3** | Polish and defensive — UI consistency, static data accuracy, no-op buttons |

---

## Layer Assignment

| Layer | When |
|---|---|
| **E2E** | Multi-step flows with navigation, real browser interactions, or timing (delays, toasts) |
| **Component** | Isolated rendering: password strength meter, modal, toast auto-dismiss |
| **Unit** | Pure logic: validation functions, filter logic, strength score calculation |
| **API** | Not applicable — VaultPay has no backend |

---

## Coverage Checklist

Use this to ensure no scenario type is missed per feature area.

### Auth
- Sign in: happy path, wrong credentials, blank fields, short password, invalid email format
- Sign in: password visibility toggle, loading state, navigate to sign-up
- Sign up: happy path, each validation field individually, passwords mismatch, terms unchecked
- Sign up: password strength meter at each level (0–4)

### Navigation
- All 6 sidebar items navigate to correct page and set active class
- Page title updates on navigation
- Quick actions on Dashboard navigate correctly
- View All Transactions navigates
- Logout clears auth state

### Dashboard
- All 4 stat cards show correct values for demo user
- Recent transactions: exactly 5 rows (TXN-001 to TXN-005)
- All 3 quick action buttons present

### Transactions
- All 12 records render
- Search by description (case-insensitive) and by transaction ID
- Search with no match → empty state
- Filter by type: credit (3), debit (9)
- Filter by status: pending (1 — TXN-006), completed (11)
- Filter by each category
- Combined filters
- Credit/debit color coding; pending/completed badge styling

### Send Money
- Happy path via contact chip and via manual email
- Contact chip ↔ manual email mutual exclusion
- Validation: no recipient, invalid email, zero amount, amount > balance
- Modal content (with note, without note)
- Cancel: modal closes, form preserved
- Confirm: 1,500ms delay → success toast → form reset
- Known limitation: balance not deducted

### Cards
- Both cards render with correct details
- Freeze/Unfreeze: visual change, toast, button label change
- Lock: danger modal, confirm → error toast, cancel → no toast
- Known limitation: lock does not update card UI

### Budget
- Stat cards: total ($1,400), spent ($930.95), remaining ($469.05)
- All 6 category cards visible with correct values
- Progress bar turns red at ≥ 90% (Shopping at 88.3% is NOT red)

### Settings
- Profile fields pre-filled; save → toast
- Security toggles (2FA default ON, biometric default OFF): toggle each, verify toast
- Notification toggles (push/email ON, SMS OFF): verify defaults
- Delete account: danger modal, confirm → error toast, cancel → no toast
- Known limitation: delete does not log user out

### Toast & Modal (cross-cutting)
- Toast: success (green), error (red), auto-dismiss at 3s, overwrite behavior
- Modal: overlay click cancels, inside click doesn't, danger vs normal styling

---

## TC ID Convention

Each feature file uses its own prefix, with numbering starting at 001:

| Feature file | Prefix | Example |
|---|---|---|
| `auth.md` | `Auth` | `Auth-TC-001` |
| `navigation.md` | `Nav` | `Nav-TC-001` |
| `dashboard.md` | `Dashboard` | `Dashboard-TC-001` |
| `transactions.md` | `Trans` | `Trans-TC-001` |
| `send-money.md` | `Send` | `Send-TC-001` |
| `cards.md` | `Cards` | `Cards-TC-001` |
| `budget.md` | `Budget` | `Budget-TC-001` |
| `settings.md` | `Settings` | `Settings-TC-001` |
| `toast-modal.md` | `Toast` | `Toast-TC-001` |
| `security.md` | `Sec` | `Sec-TC-001` |

---

## Required TC Format

Every test case must have all fields:

```
## {Prefix}-TC-<NNN>: <Title>
**Category**: <Happy Path | Business Rule | Security | Negative | Edge Case | UI State>
**Priority**: <P0 | P1 | P2 | P3>
**Preconditions**: <what must be true before the test starts>
**Steps**:
1. <human-readable action — e.g. "Fill email field with invalid format", "Click Send button", "Observe the balance stat card">
   Do NOT reference selector names or data-testid values here — those belong in the spec code.
2. …

**Expected Results**:
- <concrete, verifiable assertion — name the selector and the expected value>

**Business Rule**: <exact quote from business-rules.md or [Code behavior: App.jsx:<line>]>  
**Suggested Layer**: <E2E | Component | Unit>
```

---

## Output Rule

Save to `docs/test-plans/{feature}.md` — one file per feature area. Do not write scenarios into the skills or references directories.

---

## Anti-Patterns

- Do not combine multiple independent validations into one scenario
- Do not write vague expected results — name the selector and the exact string
- Do not assign API layer — VaultPay has no backend
- Do not assume state persists across page refreshes
- Do not skip loading/delay states — they are testable behavior
- Do not write scenarios for features that don't exist (e.g., actual password change)
