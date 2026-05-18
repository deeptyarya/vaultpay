# VaultPay Test Plan — Settings

## SETTINGS

## Settings-TC-001: Settings — Profile Fields Pre-Filled With User Data
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in as demo user. Navigate to `nav-settings`.
**Steps**:
1. Observe `settings-name`, `settings-email`, `settings-phone`

**Expected Results**:
- `settings-name` value is "Alex Morgan"
- `settings-email` value is "demo@vaultpay.com"
- `settings-phone` value is "+1 (555) 123-4567"

**Business Rule**: Profile form initialized with user.name, user.email, and hardcoded phone ([Code behavior: App.jsx:601])  
**Suggested Layer**: E2E

## Settings-TC-002: Settings — Save Profile Shows Success Toast
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Settings page.
**Steps**:
1. Clear `settings-name` and type `New Name`
2. Click `save-profile`

**Expected Results**:
- `toast-message` appears with text "Profile updated"
- Toast type is success (green)

**Business Rule**: Profile save → Toast "Profile updated" (success) (business-rules.md § Settings Profile)  
**Suggested Layer**: E2E

## Settings-TC-003: Settings — 2FA Toggle Default Is ON
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. On Settings page (fresh page load — no prior toggles).
**Steps**:
1. Observe `toggle-twoFactor`

**Expected Results**:
- `toggle-twoFactor` has CSS class `on`

**Business Rule**: twoFactor default is `true` (on) (business-rules.md § Security Toggles)  
**Suggested Layer**: Component

## Settings-TC-004: Settings — Toggle 2FA Off
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Settings page. `toggle-twoFactor` is ON.
**Steps**:
1. Click `toggle-twoFactor`

**Expected Results**:
- `toggle-twoFactor` no longer has class `on`
- `toast-message` appears with text "two Factor disabled"
- Toast type is success (green)

**Business Rule**: Toggle → Toast `"[key with spaces] disabled"` — twoFactor → "two Factor" (business-rules.md § Security Toggles)  
**Suggested Layer**: E2E

## Settings-TC-005: Settings — Toggle 2FA Back On
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Settings page. `toggle-twoFactor` has been toggled off.
**Steps**:
1. Click `toggle-twoFactor` again

**Expected Results**:
- `toggle-twoFactor` has class `on` again
- `toast-message` shows "two Factor enabled"

**Business Rule**: Toggle is bidirectional — next click re-enables (business-rules.md § Security Toggles)  
**Suggested Layer**: E2E

## Settings-TC-006: Settings — Biometric Toggle Default Is OFF
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. On Settings page (fresh load).
**Steps**:
1. Observe `toggle-biometric`

**Expected Results**:
- `toggle-biometric` does NOT have class `on`

**Business Rule**: biometric default is `false` (off) (business-rules.md § Security Toggles)  
**Suggested Layer**: Component

## Settings-TC-007: Settings — Toggle Biometric On
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Settings page. Biometric is OFF.
**Steps**:
1. Click `toggle-biometric`

**Expected Results**:
- `toggle-biometric` gains class `on`
- Toast: "biometric enabled" (success)

**Business Rule**: Toggle biometric from false → true; toast "biometric enabled" (business-rules.md § Security Toggles)  
**Suggested Layer**: E2E

## Settings-TC-008: Settings — Push Notifications Default Is ON
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Settings page.
**Steps**:
1. Observe `toggle-notifications`

**Expected Results**:
- `toggle-notifications` has class `on`

**Business Rule**: notifications default is `true` (business-rules.md § Notification Toggles)  
**Suggested Layer**: Component

## Settings-TC-009: Settings — Email Alerts Default Is ON
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Settings page.
**Steps**:
1. Observe `toggle-emailAlerts`

**Expected Results**:
- `toggle-emailAlerts` has class `on`

**Business Rule**: emailAlerts default is `true` (business-rules.md § Notification Toggles)  
**Suggested Layer**: Component

## Settings-TC-010: Settings — SMS Alerts Default Is OFF
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Settings page.
**Steps**:
1. Observe `toggle-smsAlerts`

**Expected Results**:
- `toggle-smsAlerts` does NOT have class `on`

**Business Rule**: smsAlerts default is `false` (business-rules.md § Notification Toggles)  
**Suggested Layer**: Component

## Settings-TC-011: Settings — Toggle SMS Alerts On
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Settings page. SMS alerts is OFF.
**Steps**:
1. Click `toggle-smsAlerts`

**Expected Results**:
- `toggle-smsAlerts` gains class `on`
- Toast: "sms Alerts enabled" (success)

**Business Rule**: Toggle SMS alerts from false → true (business-rules.md § Notification Toggles)  
**Suggested Layer**: E2E

## Settings-TC-012: Settings — Delete Account Opens Danger Modal
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Settings page.
**Steps**:
1. Click `delete-account`

**Expected Results**:
- `modal-overlay` is visible
- Modal title reads "Delete Account"
- Modal text reads "This action cannot be undone. All your data including transaction history, cards, and settings will be permanently deleted."
- `modal-confirm` has `btn-danger` class (red)

**Business Rule**: Delete account danger modal with exact text (business-rules.md § Settings Danger Zone)  
**Suggested Layer**: E2E

## Settings-TC-013: Settings — Delete Account Confirm Shows Error Toast
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Settings page. Delete Account modal is open.
**Steps**:
1. Click `modal-confirm`

**Expected Results**:
- `toast-message` visible with text "Account deletion requested"
- Toast type is error (red with X icon)
- Modal closes

**Business Rule**: Delete confirm → Toast "Account deletion requested" (error) (business-rules.md § Settings Danger Zone)  
**Suggested Layer**: E2E

## Settings-TC-014: Settings — Delete Account Does Not Log User Out (Known Limitation)
**Category**: Edge Case
**Priority**: P3
**Preconditions**: Logged in. Confirmed account deletion (TC-113).
**Steps**:
1. After confirming deletion, observe current page

**Expected Results**:
- User remains on `settings-page`
- `app-layout` and `sidebar` are still visible
- User is NOT redirected to sign-in

**Business Rule**: Delete account has no redirect/logout side effect (user-flows.md § Known Limitations)  
**Suggested Layer**: E2E

## Settings-TC-015: Settings — Delete Account Cancel Closes Modal
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Settings page. Delete Account modal is open.
**Steps**:
1. Click `modal-cancel`

**Expected Results**:
- Modal closes
- No toast appears
- User remains on settings page

**Business Rule**: Cancel on delete modal calls onCancel with no side effects ([Code behavior: App.jsx:676])  
**Suggested Layer**: E2E

## Settings-TC-016: Settings — Change Password Button Is Present (No-Op)
**Category**: UI State
**Priority**: P3
**Preconditions**: Logged in. On Settings page.
**Steps**:
1. Observe `change-password` button
2. Click it

**Expected Results**:
- Button is present and clickable
- No modal, toast, or navigation occurs

**Business Rule**: Change Password button exists with no handler (user-flows.md § Known Limitations)  
**Suggested Layer**: Component

---

