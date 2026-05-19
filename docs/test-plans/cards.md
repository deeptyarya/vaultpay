# VaultPay Test Plan — Cards

## CARDS

## Cards-TC-001: Cards — Both Cards Render With Correct Details
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. Navigate to `nav-cards`.
**Steps**:
1. Observe `card-CARD-001`
2. Observe `card-CARD-002`

**Expected Results**:
- CARD-001: type "Visa", last4 "4821", expiry "09/28", holder "Alex Morgan"
- CARD-002: type "Mastercard", last4 "7733", expiry "03/27", holder "Alex Morgan"

**Business Rule**: MOCK_CARDS data (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Cards-TC-002: Cards — Visa Card Has Dark Background When Active
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Cards page. Visa card is active (not frozen).
**Steps**:
1. Observe the visual style of `card-CARD-001`

**Expected Results**:
- Card background color is #0f172a (dark navy)
- Opacity is 1 (full)
- No "FROZEN" badge visible

**Business Rule**: Active card uses its color property at full opacity (business-rules.md § Card States)  
**Suggested Layer**: Component

## Cards-TC-003: Cards — Mastercard Has Purple Background When Active
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Cards page. Mastercard is active.
**Steps**:
1. Observe the visual style of `card-CARD-002`

**Expected Results**:
- Card background color is #7c3aed (purple)
- Opacity is 1

**Business Rule**: CARD-002 color is #7c3aed (domain.md § Mock Data)  
**Suggested Layer**: Component

## Cards-TC-004: Cards — Freeze Visa Card — Visual Change
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. On Cards page. Visa card is active.
**Steps**:
1. Click `freeze-CARD-001`

**Expected Results**:
- Card background changes to #374151 (gray)
- Card opacity changes to 0.7
- "FROZEN" badge appears on card

**Business Rule**: Frozen card visual — background #374151, opacity 0.7, FROZEN badge (business-rules.md § Card States)  
**Suggested Layer**: E2E

## Cards-TC-005: Cards — Freeze Visa Card — Toast Notification
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Cards page. Visa card is active.
**Steps**:
1. Click `freeze-CARD-001`

**Expected Results**:
- `toast-message` appears with text "Card frozen"
- Toast type is success (green)

**Business Rule**: Freeze success toast — "Card frozen" (business-rules.md § Cards Actions)  
**Suggested Layer**: E2E

## Cards-TC-006: Cards — Freeze Button Label Changes to Unfreeze
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. On Cards page. Visa card is active.
**Steps**:
1. Observe `freeze-CARD-001` label before: "Freeze"
2. Click `freeze-CARD-001`

**Expected Results**:
- `freeze-CARD-001` label changes to "Unfreeze"

**Business Rule**: Button label reflects current card status — toggles between "Freeze" and "Unfreeze" ([Code behavior: App.jsx:509])  
**Suggested Layer**: Component

## Cards-TC-007: Cards — Unfreeze Visa Card — Visual Restored
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. On Cards page. Visa card is frozen (Cards-TC-004 completed).
**Steps**:
1. Click `freeze-CARD-001` (now labeled "Unfreeze")

**Expected Results**:
- Card background restores to #0f172a
- Card opacity restores to 1
- "FROZEN" badge disappears
- `freeze-CARD-001` label reverts to "Freeze"
- `toast-message` shows "Card unfrozen" (success, green)

**Business Rule**: Unfreeze restores active state; toast "Card unfrozen" (business-rules.md § Cards Actions)  
**Suggested Layer**: E2E

## Cards-TC-008: Cards — Freeze Mastercard Independently
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Cards page. Both cards active.
**Steps**:
1. Click `freeze-CARD-002`

**Expected Results**:
- `card-CARD-002` becomes gray/frozen
- `card-CARD-001` remains unchanged (active)
- Toast: "Card frozen"

**Business Rule**: Each card's state is independent — toggling one does not affect the other ([Code behavior: App.jsx:484])  
**Suggested Layer**: E2E

## Cards-TC-009: Cards — Lock Card Opens Danger Modal
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Cards page.
**Steps**:
1. Click `lock-CARD-001`

**Expected Results**:
- `modal-overlay` is visible
- `modal` is visible
- Modal title reads "Lock Card"
- Modal text reads "This will permanently lock the card. You'll need to request a replacement. Are you sure?"

**Business Rule**: Lock Card opens danger modal with permanent lock warning (business-rules.md § Cards Actions)  
**Suggested Layer**: E2E

## Cards-TC-010: Cards — Lock Card Modal Has Danger Styling
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Cards page. Lock Card modal is open.
**Steps**:
1. Observe `modal-confirm` button

**Expected Results**:
- `modal-confirm` has class `btn-danger` (red button)
- `modal-cancel` has class `btn-secondary` (gray button)

**Business Rule**: danger=true → confirm button uses `.btn-danger` (business-rules.md § Modal Component)  
**Suggested Layer**: Component

## Cards-TC-011: Cards — Lock Card Confirm Shows Error Toast
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Cards page. Lock Card modal is open.
**Steps**:
1. Click `modal-confirm`

**Expected Results**:
- `toast-message` is visible with text "Card locked permanently"
- Toast type is error (red)
- Modal closes

**Business Rule**: Lock confirm → Toast "Card locked permanently" (error) (business-rules.md § Cards Actions)  
**Suggested Layer**: E2E

## Cards-TC-012: Cards — Lock Card Does Not Change Card UI Status (Known Limitation)
**Category**: Edge Case
**Priority**: P3
**Preconditions**: Logged in. On Cards page. Lock Card confirmed for CARD-001.
**Steps**:
1. Confirm lock (Cards-TC-011)
2. Observe `card-CARD-001` visual state

**Expected Results**:
- Card still appears active (original color, no FROZEN badge)
- Freeze button still reads "Freeze"

**Business Rule**: Lock card does not update card status in state (user-flows.md § Known Limitations)  
**Suggested Layer**: E2E

## Cards-TC-013: Cards — Lock Card Cancel Closes Modal With No Toast
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Cards page. Lock Card modal is open.
**Steps**:
1. Click `modal-cancel`

**Expected Results**:
- `modal-overlay` is no longer visible
- `toast-message` does NOT appear
- Card state is unchanged

**Business Rule**: Cancel on lock modal calls onCancel — no side effects ([Code behavior: App.jsx:548])  
**Suggested Layer**: E2E

## Cards-TC-014: Cards — Card Limits Table Renders Correctly
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Cards page.
**Steps**:
1. Observe `card-limits-table`

**Expected Results**:
- Visa row: limit $10,000, used today $347.00, remaining $9,653
- Mastercard row: limit $5,000, used today $347.00, remaining $4,653

**Business Rule**: Card limits from MOCK_CARDS; used today is static $347.00 for both (domain.md § Mock Data, user-flows.md § Known Limitations)  
**Suggested Layer**: E2E

---

