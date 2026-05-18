# VaultPay Test Plan — Toast & Modal

## TOAST & MODAL (CROSS-CUTTING)

## Toast-TC-001: Toast — Success Type Has Green Style and Check Icon
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. Any action that triggers a success toast (e.g. save profile).
**Steps**:
1. Click `save-profile` on Settings page
2. Observe `toast-message` immediately

**Expected Results**:
- Toast element has success class/styling (green)
- Checkmark icon is visible (SVG check polygon)
- Text reads "Profile updated"

**Business Rule**: type "success" → green styling + check icon (business-rules.md § Toast Component)  
**Suggested Layer**: Component

## Toast-TC-002: Toast — Error Type Has Red Style and X Icon
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. Any action that triggers an error toast (e.g. confirm lock card).
**Steps**:
1. Lock a card via `lock-CARD-001` → `modal-confirm`
2. Observe `toast-message`

**Expected Results**:
- Toast has error class/styling (red)
- X icon visible
- Text reads "Card locked permanently"

**Business Rule**: type "error" → red styling + X icon (business-rules.md § Toast Component)  
**Suggested Layer**: Component

## Toast-TC-003: Toast — Auto-Dismisses After 3 Seconds
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. Toast has just appeared (any success action).
**Steps**:
1. Trigger a success toast (e.g. save profile)
2. Wait 3,000ms
3. Observe `toast-message`

**Expected Results**:
- Before 3s: `toast-message` is visible
- After 3s: `toast-message` is no longer in the DOM

**Business Rule**: Toast auto-dismisses after 3,000ms via setTimeout (business-rules.md § Toast Component)  
**Suggested Layer**: Component

## Toast-TC-004: Toast — New Toast Overwrites Previous Toast
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in. A success toast is currently visible.
**Steps**:
1. Trigger first toast (save profile → "Profile updated")
2. Immediately trigger second toast (toggle biometric → "biometric enabled")
3. Observe `toast-message`

**Expected Results**:
- Only one toast is visible at a time
- Toast shows the second message ("biometric enabled")

**Business Rule**: Only one toast visible at a time — new call overwrites state (business-rules.md § Toast Component)  
**Suggested Layer**: Component

## Toast-TC-005: Modal — Clicking Overlay Dismisses Modal
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. Any modal is open (e.g. Send Money confirm).
**Steps**:
1. Click `modal-overlay` (the dark background area, not the modal box itself)

**Expected Results**:
- `modal-overlay` and `modal` are no longer visible
- No confirm action was executed

**Business Rule**: Clicking overlay calls onCancel (business-rules.md § Modal Component)  
**Suggested Layer**: Component

## Toast-TC-006: Modal — Clicking Inside Modal Box Does Not Dismiss It
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. Any modal is open.
**Steps**:
1. Click anywhere inside `modal` (the inner dialog box, e.g. on the modal text)

**Expected Results**:
- Modal remains open
- No action is triggered

**Business Rule**: `e.stopPropagation()` on modal inner div prevents overlay click from firing ([Code behavior: App.jsx:87])  
**Suggested Layer**: Component

## Toast-TC-007: Modal — Non-Danger Modal Has Blue Confirm Button
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. Send Money confirm modal is open (not a danger modal).
**Steps**:
1. Observe `modal-confirm` button in Send Money flow

**Expected Results**:
- Button has class `btn-primary` (blue)
- Button does NOT have class `btn-danger`

**Business Rule**: Default modal (danger=false) uses `.btn-primary` (business-rules.md § Modal Component)  
**Suggested Layer**: Component

---

