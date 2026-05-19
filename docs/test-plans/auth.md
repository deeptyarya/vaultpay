# VaultPay Test Plan — Auth

## AUTH — SIGN IN

## Auth-TC-001: Sign In — Happy Path (Demo User)
**Category**: Happy Path
**Priority**: P0
**Preconditions**: App is running at http://localhost:3000. User is on the Sign In page (`signin-page` visible).
**Steps**:
1. Fill `signin-email` with `demo@vaultpay.com`
2. Fill `signin-password` with `Demo@1234`
3. Click `signin-submit`
4. Wait up to 2,000ms for navigation

**Expected Results**:
- `dashboard-page` becomes visible
- `sidebar` is visible
- `page-title` contains "Welcome back, Alex"
- `stat-balance` displays "$24,850.75"

**Business Rule**: Credential check — email + password must match exactly one MOCK_USERS entry; on success, user is set and app page renders (business-rules.md § Sign In)  
**Suggested Layer**: E2E

## Auth-TC-002: Sign In — Submit Button Loading State
**Category**: UI State
**Priority**: P1
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Fill `signin-email` with `demo@vaultpay.com`
2. Fill `signin-password` with `Demo@1234`
3. Click `signin-submit`
4. Immediately observe button before navigation completes

**Expected Results**:
- `signin-submit` is disabled (attribute `disabled` present)
- `signin-submit` text reads "Signing in..."
- Button remains in this state for approximately 1,200ms

**Business Rule**: Loading delay — 1,200ms simulated async delay on submit (business-rules.md § Sign In)  
**Suggested Layer**: E2E

## Auth-TC-003: Sign In — Empty Email Field
**Category**: Negative
**Priority**: P1
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Leave `signin-email` empty
2. Fill `signin-password` with `Demo@1234`
3. Click `signin-submit`

**Expected Results**:
- `email-error` is visible with text "Email is required"
- `password-error` is not visible
- No navigation occurs — `signin-page` remains

**Business Rule**: Email required — "Email is required" (business-rules.md § Sign In)  
**Suggested Layer**: E2E

## Auth-TC-004: Sign In — Invalid Email Format
**Category**: Negative
**Priority**: P1
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Fill `signin-email` with `notanemail`
2. Fill `signin-password` with `Demo@1234`
3. Click `signin-submit`

**Expected Results**:
- `email-error` is visible with text "Invalid email format"
- No navigation occurs

**Business Rule**: Email format must match `/\S+@\S+\.\S+/` — "Invalid email format" (business-rules.md § Sign In)  
**Suggested Layer**: Unit (validation logic), E2E (error display)

## Auth-TC-005: Sign In — Empty Password Field
**Category**: Negative
**Priority**: P1
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Fill `signin-email` with `demo@vaultpay.com`
2. Leave `signin-password` empty
3. Click `signin-submit`

**Expected Results**:
- `password-error` is visible with text "Password is required"
- `email-error` is not visible
- No navigation occurs

**Business Rule**: Password required — "Password is required" (business-rules.md § Sign In)  
**Suggested Layer**: E2E

## Auth-TC-006: Sign In — Password Too Short (Under 6 Characters)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Fill `signin-email` with `demo@vaultpay.com`
2. Fill `signin-password` with `12345` (5 characters)
3. Click `signin-submit`

**Expected Results**:
- `password-error` is visible with text "Password must be at least 6 characters"
- No network call or navigation occurs

**Business Rule**: Password min length 6 characters for sign in — "Password must be at least 6 characters" (business-rules.md § Sign In)  
**Suggested Layer**: Unit (validation), E2E (error display)

## Auth-TC-007: Sign In — Wrong Credentials (Valid Format)
**Category**: Negative
**Priority**: P0
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Fill `signin-email` with `wrong@email.com`
2. Fill `signin-password` with `WrongPass1`
3. Click `signin-submit`
4. Wait for loading delay (~1,200ms)

**Expected Results**:
- `form-error` is visible with text "Invalid credentials. Try demo@vaultpay.com / Demo@1234"
- `signin-submit` returns to enabled state with original label
- No navigation occurs — `signin-page` remains

**Business Rule**: Credential check — failure shows exact hint message (business-rules.md § Sign In)  
**Suggested Layer**: E2E

## Auth-TC-008: Sign In — Password Visibility Toggle (Show)
**Category**: UI State
**Priority**: P2
**Preconditions**: App at http://localhost:3000. Sign In page visible. `signin-password` filled with `Demo@1234`.
**Steps**:
1. Observe `signin-password` input — type should be "password" (text hidden)
2. Click `toggle-password`

**Expected Results**:
- `signin-password` input type changes to "text"
- Password characters are now visible
- `toggle-password` shows EyeOff icon

**Business Rule**: [Code behavior: App.jsx:103 — showPw state toggles input type between "password" and "text"]  
**Suggested Layer**: Component

## Auth-TC-009: Sign In — Password Visibility Toggle (Hide Again)
**Category**: UI State
**Priority**: P2
**Preconditions**: App at http://localhost:3000. Password visibility is already toggled to visible (type="text").
**Steps**:
1. Click `toggle-password` again

**Expected Results**:
- `signin-password` input type reverts to "password"
- Characters are masked
- `toggle-password` shows Eye icon

**Business Rule**: [Code behavior: App.jsx:103 — showPw toggles back to false]  
**Suggested Layer**: Component

## Auth-TC-010: Sign In — Navigate to Sign Up
**Category**: Happy Path
**Priority**: P1
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Click `goto-signup`

**Expected Results**:
- `signup-page` becomes visible
- `signin-page` is no longer visible

**Business Rule**: [Code behavior: App.jsx:718 — onGoToSignUp sets page state to "signup"]  
**Suggested Layer**: E2E

## Auth-TC-011: Sign In — Both Fields Empty (Multiple Errors)
**Category**: Negative
**Priority**: P2
**Preconditions**: App at http://localhost:3000. Sign In page visible.
**Steps**:
1. Leave both `signin-email` and `signin-password` empty
2. Click `signin-submit`

**Expected Results**:
- `email-error` is visible with text "Email is required"
- `password-error` is visible with text "Password is required"
- No navigation occurs

**Business Rule**: Validation runs all fields and collects all errors before returning (business-rules.md § Sign In)  
**Suggested Layer**: E2E

---

## AUTH — SIGN UP

## Auth-TC-012: Sign Up — Happy Path (New User)
**Category**: Happy Path
**Priority**: P0
**Preconditions**: App at http://localhost:3000. Navigate to Sign Up page via `goto-signup`.
**Steps**:
1. Fill `signup-name` with `Jane Doe`
2. Fill `signup-email` with `jane@newuser.com`
3. Fill `signup-password` with `Test@1234`
4. Fill `signup-confirm-password` with `Test@1234`
5. Check `agree-terms`
6. Click `signup-submit`
7. Wait up to 2,000ms

**Expected Results**:
- `dashboard-page` becomes visible
- `page-title` contains "Welcome back, Jane"
- `stat-balance` displays "$1,000.00"
- Account number format "****" followed by 4 digits

**Business Rule**: New user gets $1,000.00 starting balance; name from signup form drives welcome title (business-rules.md § Sign Up)  
**Suggested Layer**: E2E

## Auth-TC-013: Sign Up — Loading State During Submit
**Category**: UI State
**Priority**: P1
**Preconditions**: Sign Up page visible with all valid fields filled and terms checked.
**Steps**:
1. Click `signup-submit`
2. Immediately observe button state

**Expected Results**:
- `signup-submit` is disabled
- Button text reads "Creating account..."
- State lasts approximately 1,200ms

**Business Rule**: Loading delay — 1,200ms simulated async delay on signup submit (business-rules.md § Sign Up)  
**Suggested Layer**: E2E

## Auth-TC-014: Sign Up — Blank Name Field
**Category**: Negative
**Priority**: P1
**Preconditions**: Sign Up page visible.
**Steps**:
1. Leave `signup-name` empty
2. Fill all other fields validly
3. Check `agree-terms`
4. Click `signup-submit`

**Expected Results**:
- `name-error` visible with text "Name is required"
- No navigation occurs

**Business Rule**: Name required — cannot be blank/whitespace — "Name is required" (business-rules.md § Sign Up)  
**Suggested Layer**: E2E

## Auth-TC-015: Sign Up — Whitespace-Only Name
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill `signup-name` with `   ` (spaces only)
2. Fill all other fields validly, check terms
3. Click `signup-submit`

**Expected Results**:
- `name-error` visible with text "Name is required"
- No navigation occurs

**Business Rule**: Name validation uses `.trim()` — whitespace-only fails — "Name is required" (business-rules.md § Sign Up, [Code behavior: App.jsx:187])  
**Suggested Layer**: Unit

## Auth-TC-016: Sign Up — Invalid Email Format
**Category**: Negative
**Priority**: P1
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill `signup-name` with `Jane Doe`
2. Fill `signup-email` with `invalidemail`
3. Fill remaining fields validly, check terms
4. Click `signup-submit`

**Expected Results**:
- `email-error` visible with text "Invalid email format"
- No navigation occurs

**Business Rule**: Same email regex `/\S+@\S+\.\S+/` as sign in (business-rules.md § Sign Up)  
**Suggested Layer**: Unit

## Auth-TC-017: Sign Up — Password Under 8 Characters
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill all fields; set `signup-password` to `Ab1@567` (7 characters)
2. Set `signup-confirm-password` to `Ab1@567`
3. Check terms, click submit

**Expected Results**:
- `password-error` visible with text "At least 8 characters required"
- Note: sign-in requires only 6; sign-up requires 8 — different thresholds

**Business Rule**: Password min 8 characters on signup — "At least 8 characters required" (business-rules.md § Sign Up)  
**Suggested Layer**: Unit

## Auth-TC-018: Sign Up — Passwords Do Not Match
**Category**: Negative
**Priority**: P1
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill `signup-password` with `Test@1234`
2. Fill `signup-confirm-password` with `Test@5678`
3. Fill other fields validly, check terms
4. Click `signup-submit`

**Expected Results**:
- `confirm-error` visible with text "Passwords don't match"
- No navigation occurs

**Business Rule**: Confirm password must match password exactly — "Passwords don't match" (business-rules.md § Sign Up)  
**Suggested Layer**: Unit

## Auth-TC-019: Sign Up — Terms Not Checked
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Sign Up page visible with all text fields filled validly.
**Steps**:
1. Leave `agree-terms` unchecked
2. Click `signup-submit`

**Expected Results**:
- `terms-error` visible with text "You must agree to terms"
- No navigation occurs

**Business Rule**: Terms checkbox must be checked — "You must agree to terms" (business-rules.md § Sign Up)  
**Suggested Layer**: E2E

## Auth-TC-020: Sign Up — Password Strength: Bar Hidden When No Password
**Category**: UI State
**Priority**: P3
**Preconditions**: Sign Up page visible. `signup-password` is empty.
**Steps**:
1. Observe `password-strength` container

**Expected Results**:
- `password-strength` element is not present in DOM (only renders when password has value)

**Business Rule**: Bar renders only when password field has any value ([Code behavior: App.jsx:230])  
**Suggested Layer**: Component

## Auth-TC-021: Sign Up — Password Strength Score 1 (Weak)
**Category**: UI State
**Priority**: P2
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill `signup-password` with `abcdefgh` (8 lowercase letters, no uppercase/number/special)

**Expected Results**:
- `password-strength` is visible
- One segment is filled, three are dark
- Label reads "Weak"
- Filled segment and label color is red (#ef4444)

**Business Rule**: Strength score 1 = length ≥ 8 only → "Weak", color #ef4444 (business-rules.md § Password Strength Meter)  
**Suggested Layer**: Component

## Auth-TC-022: Sign Up — Password Strength Score 2 (Fair)
**Category**: UI State
**Priority**: P2
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill `signup-password` with `Abcdefgh` (8 chars, has uppercase)

**Expected Results**:
- Two segments filled
- Label reads "Fair"
- Color is amber (#f59e0b)

**Business Rule**: Strength score 2 = length ≥ 8 + uppercase → "Fair", color #f59e0b (business-rules.md § Password Strength Meter)  
**Suggested Layer**: Component

## Auth-TC-023: Sign Up — Password Strength Score 3 (Good)
**Category**: UI State
**Priority**: P2
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill `signup-password` with `Abcdefg1` (8 chars, uppercase, number)

**Expected Results**:
- Three segments filled
- Label reads "Good"
- Color is blue (#3b82f6)

**Business Rule**: Strength score 3 = length ≥ 8 + uppercase + number → "Good", color #3b82f6 (business-rules.md § Password Strength Meter)  
**Suggested Layer**: Component

## Auth-TC-024: Sign Up — Password Strength Score 4 (Strong)
**Category**: UI State
**Priority**: P2
**Preconditions**: Sign Up page visible.
**Steps**:
1. Fill `signup-password` with `Abcdefg1!` (8 chars, uppercase, number, special char)

**Expected Results**:
- All four segments filled
- Label reads "Strong"
- Color is green (#10b981)

**Business Rule**: Strength score 4 = all criteria → "Strong", color #10b981 (business-rules.md § Password Strength Meter)  
**Suggested Layer**: Component

## Auth-TC-025: Sign Up — Navigate Back to Sign In
**Category**: Happy Path
**Priority**: P2
**Preconditions**: Sign Up page visible.
**Steps**:
1. Click `goto-signin`

**Expected Results**:
- `signin-page` becomes visible
- `signup-page` is no longer visible

**Business Rule**: [Code behavior: App.jsx:249 — onGoToSignIn sets page to "signin"]  
**Suggested Layer**: E2E

---

