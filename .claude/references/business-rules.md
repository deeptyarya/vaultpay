# VaultPay — Business Rules & Validation

## Authentication

### Sign In
| Rule | Detail |
|---|---|
| Email required | "Email is required" |
| Email format | Must match `/\S+@\S+\.\S+/` — "Invalid email format" |
| Password required | "Password is required" |
| Password min length | 6 characters — "Password must be at least 6 characters" |
| Credential check | Must match exactly one MOCK_USERS entry; failure → "Invalid credentials. Try demo@vaultpay.com / Demo@1234" |
| Loading delay | 1,200ms simulated async delay |
| Remember me | Checkbox present; no persistence implemented (UI-only) |
| Forgot password | Link present; no action implemented (UI-only) |

### Sign Up
| Rule | Detail |
|---|---|
| Name required | Cannot be blank/whitespace — "Name is required" |
| Email required + format | Same regex as sign-in |
| Password min | 8 characters — "At least 8 characters required" |
| Confirm password | Must match password — "Passwords don't match" |
| Terms checkbox | Must be checked — "You must agree to terms" |
| New user balance | $1,000.00 starting balance |
| New account number | "****" + random 4-digit number |
| Loading delay | 1,200ms |

#### Password Strength Meter (Sign Up only)
Strength score is sum of passing criteria (0–4):
1. Length ≥ 8 chars
2. Contains uppercase letter
3. Contains number
4. Contains special character

| Score | Label | Color |
|---|---|---|
| 1 | Weak | #ef4444 |
| 2 | Fair | #f59e0b |
| 3 | Good | #3b82f6 |
| 4 | Strong | #10b981 |

Bar renders only when password field has any value. Four segments fill left-to-right in the score's color.

---

## Send Money

### Validation
| Rule | Detail |
|---|---|
| Recipient required | Must select a contact chip OR enter a custom email — "Select a contact or enter email" |
| Custom email format | If entered, must match email regex — "Invalid email" |
| Recipient exclusivity | Selecting a contact clears custom email; typing custom email deselects contact |
| Amount required | Must be > 0 — "Enter a valid amount" |
| Insufficient funds | Amount > user.balance → "Insufficient balance" |
| Note | Optional; max not enforced |

### Flow
1. User picks recipient (contact chip OR manual email)
2. User enters amount and optional note
3. Click "Review & Send" → validates → shows confirmation Modal
4. Modal shows: `Send $X.XX to [Name]? Note: "..."` (note omitted if empty)
5. Confirm → 1,500ms delay → Toast "Transfer sent successfully!" (success) → form resets
6. Cancel → closes modal, form state preserved

**Side effect:** Transfer does NOT actually deduct from user.balance (UI-only).

---

## Cards

### Card States
| Status | Visual | Freeze button label |
|---|---|---|
| active | Original card color, full opacity | "Freeze" |
| frozen | Background #374151, opacity 0.7, "FROZEN" badge | "Unfreeze" |

### Actions
| Action | Behavior |
|---|---|
| Freeze/Unfreeze | Toggles card status in local state; Toast "Card frozen" or "Card unfrozen" (success) |
| Lock Card | Opens Modal with danger warning; confirm → Toast "Card locked permanently" (error); card status does NOT update in state |
| Details | Button present; no action implemented |

**Lock Card modal text:** "This will permanently lock the card. You'll need to request a replacement. Are you sure?"

---

## Budget

### Visual Rules
- Progress bar fill: category color when < 90% used; #ef4444 (red) when ≥ 90%
- Percentage: `Math.min((spent / budget) * 100, 100)` — capped at 100%
- Shopping is at 88.3% (close to warning threshold)
- No categories currently exceed 100%

---

## Settings

### Profile
- Name, email, phone fields; "Save Changes" → Toast "Profile updated" (success)
- Changes are local state only (not persisted)

### Security Toggles
| Key | Default | Label |
|---|---|---|
| twoFactor | true (on) | Two-Factor Authentication |
| biometric | false (off) | Biometric Login |

Toggle → Toast shows `"[Key with spaces] enabled/disabled"` (success).
"Change Password" button present, no action implemented.

### Notification Toggles
| Key | Default | Label |
|---|---|---|
| notifications | true (on) | Push Notifications |
| emailAlerts | true (on) | Email Alerts |
| smsAlerts | false (off) | SMS Alerts |

### Danger Zone
- "Delete Account" → Modal (danger) → confirm → Toast "Account deletion requested" (error)
- **Delete Account modal text:** "This action cannot be undone. All your data including transaction history, cards, and settings will be permanently deleted."

---

## Toast Component

- Auto-dismisses after **3,000ms**
- `type: "success"` → green, shows checkmark icon
- `type: "error"` → red, shows X icon
- Only one toast visible at a time (new call overwrites previous)
- `data-testid="toast-message"`

---

## Modal Component

- Renders as overlay (`data-testid="modal-overlay"`)
- Clicking overlay calls `onCancel`
- `data-testid="modal-cancel"` / `data-testid="modal-confirm"`
- `danger=true` → confirm button uses `.btn-danger` (red); default is `.btn-primary` (blue)

---

## Transactions Filtering

Search matches against `description` (case-insensitive) OR `id` (e.g. "TXN-006").
All three filter dropdowns are combinable.
Empty result state: `data-testid="no-results"` with text "No transactions found".
