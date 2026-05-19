# VaultPay — UI Selectors (data-testid Reference)

> **Authoritative source for implementation**: `tests/e2e/pages/*.ts` page objects own all selector definitions.
> This file is planning context for `/test-plan` — selectors here may lag behind the code. Do not use as implementation reference.

All interactive elements and key containers carry a `data-testid` attribute. Use `page.getByTestId('X')` in Playwright.

---

## Auth Pages

### Sign In (`data-testid="signin-page"`)
| Selector | Element | Notes |
|---|---|---|
| `signin-page` | Page root div | |
| `signin-form` | `<form>` | |
| `signin-email` | Email input | type="email", autocomplete="email" |
| `signin-password` | Password input | type="password" or "text" when visible |
| `toggle-password` | Eye/EyeOff button | Toggles password visibility |
| `signin-submit` | Submit button | Disabled during loading; text "Signing in..." |
| `remember-me` | Checkbox | No persistence |
| `forgot-password` | Anchor link | No action |
| `goto-signup` | "Sign up" link | Navigates to signup page |
| `form-error` | Error div | Top-level credential failure message |
| `email-error` | Inline email error | |
| `password-error` | Inline password error | |

### Sign Up (`data-testid="signup-page"`)
| Selector | Element | Notes |
|---|---|---|
| `signup-page` | Page root div | |
| `signup-form` | `<form>` | |
| `signup-name` | Full Name input | |
| `signup-email` | Email input | type="email" |
| `signup-password` | Password input | Has strength meter |
| `toggle-password-signup` | Eye/EyeOff button | |
| `password-strength` | Strength bar container | Only visible when password has value |
| `signup-confirm-password` | Confirm Password input | type="password" |
| `agree-terms` | Checkbox | Must be checked to submit |
| `signup-submit` | Submit button | Text "Creating account..." during loading |
| `goto-signin` | "Sign in" link | |
| `name-error` | Name inline error | |
| `email-error` | Email inline error | |
| `password-error` | Password inline error | |
| `confirm-error` | Confirm password error | |
| `terms-error` | Terms checkbox error | |

---

## App Layout

| Selector | Element | Notes |
|---|---|---|
| `app-layout` | Outer layout div | Present on all authenticated pages |
| `sidebar` | `<aside>` | Always visible |
| `sidebar-nav` | `<nav>` | Contains all nav buttons |
| `page-title` | H1-equivalent div | Changes per active page |
| `global-search` | Search input in header | No action implemented |
| `notifications-btn` | Bell button | No action implemented |

### Sidebar Navigation
| Selector | Navigates to |
|---|---|
| `nav-dashboard` | Dashboard |
| `nav-transactions` | Transactions |
| `nav-send` | Send Money |
| `nav-cards` | Cards |
| `nav-budget` | Budget |
| `nav-settings` | Settings |
| `nav-logout` | Sign In page (clears user) |

---

## Dashboard Page (`data-testid="dashboard-page"`)

### Stat Cards
| Selector | Label | Value (demo user) |
|---|---|---|
| `stat-balance` | Total Balance | $24,850.75 |
| `stat-income` | Income | $6,432 |
| `stat-expenses` | Expenses | $2,180 |
| `stat-savings` | Savings | $4,252 |

### Recent Transactions Table
| Selector | Notes |
|---|---|
| `recent-transactions-table` | Shows first 5 transactions |
| `txn-row-TXN-001` | Netflix row |
| `txn-row-TXN-002` | Salary row |
| `txn-row-TXN-003` | Whole Foods row |
| `txn-row-TXN-004` | Uber row |
| `txn-row-TXN-005` | Transfer to Sarah K. row |
| `view-all-txn` | "View All" button → navigates to Transactions |

### Quick Actions
| Selector | Action |
|---|---|
| `quick-send` | Navigate to Send Money |
| `quick-cards` | Navigate to Cards |
| `quick-budget` | Navigate to Budget |

---

## Transactions Page (`data-testid="transactions-page"`)

| Selector | Element |
|---|---|
| `transactions-page` | Page root |
| `txn-search` | Search input |
| `filter-type` | Type dropdown (all / credit / debit) |
| `filter-status` | Status dropdown (all / completed / pending) |
| `filter-category` | Category dropdown (all + 10 categories) |
| `transactions-table` | Full table (all 12 or filtered) |
| `txn-row-TXN-001` through `txn-row-TXN-012` | Individual rows |
| `no-results` | Empty state div |

---

## Send Money Page (`data-testid="send-money-page"`)

| Selector | Element | Notes |
|---|---|---|
| `send-money-page` | Page root | |
| `contact-C-001` | Sarah K. chip | |
| `contact-C-002` | James W. chip | |
| `contact-C-003` | Maria L. chip | |
| `contact-C-004` | David R. chip | |
| `recipient-email` | Manual email input | |
| `send-amount` | Amount number input | type="number", min="0", step="0.01" |
| `send-note` | Note textarea | Optional |
| `send-submit` | "Review & Send" button | |
| `recipient-error` | Recipient validation error | |
| `amount-error` | Amount validation error | |

---

## Cards Page (`data-testid="cards-page"`)

| Selector | Element | Notes |
|---|---|---|
| `cards-page` | Page root | |
| `card-CARD-001` | Visa card container | |
| `card-CARD-002` | Mastercard container | |
| `freeze-CARD-001` | Freeze/Unfreeze button (Visa) | Label toggles |
| `freeze-CARD-002` | Freeze/Unfreeze button (Mastercard) | |
| `lock-CARD-001` | Lock Card button (Visa) | Opens danger modal |
| `lock-CARD-002` | Lock Card button (Mastercard) | |
| `details-CARD-001` | Details button (Visa) | No action |
| `details-CARD-002` | Details button (Mastercard) | No action |
| `card-limits-table` | Limits table | Shows limit, used, remaining |

---

## Budget Page (`data-testid="budget-page"`)

| Selector | Element | Notes |
|---|---|---|
| `budget-page` | Page root | |
| `total-budget` | Stat card | $1,400 |
| `total-spent` | Stat card | $930.95 |
| `remaining-budget` | Stat card | $469.05 (green) |
| `budget-groceries` | Groceries progress card | |
| `budget-entertainment` | Entertainment progress card | |
| `budget-transport` | Transport progress card | |
| `budget-shopping` | Shopping progress card | |
| `budget-utilities` | Utilities progress card | |
| `budget-food-&-drink` | Food & Drink progress card | Note the `&` in selector |

---

## Settings Page (`data-testid="settings-page"`)

| Selector | Element | Notes |
|---|---|---|
| `settings-page` | Page root | |
| `settings-name` | Name input | Pre-filled with user.name |
| `settings-email` | Email input | Pre-filled with user.email |
| `settings-phone` | Phone input | Pre-filled "+1 (555) 123-4567" |
| `save-profile` | Save Changes button | |
| `toggle-twoFactor` | 2FA toggle | Default: ON |
| `toggle-biometric` | Biometric toggle | Default: OFF |
| `toggle-notifications` | Push notifications toggle | Default: ON |
| `toggle-emailAlerts` | Email alerts toggle | Default: ON |
| `toggle-smsAlerts` | SMS alerts toggle | Default: OFF |
| `change-password` | Change Password button | No action |
| `delete-account` | Delete Account button (danger) | Opens danger modal |

---

## Shared Components

### Toast (`data-testid="toast-message"`)
Always present in DOM once shown; disappears after 3s.

### Modal
| Selector | Element |
|---|---|
| `modal-overlay` | Background overlay; click dismisses |
| `modal` | Dialog box |
| `modal-cancel` | Cancel button |
| `modal-confirm` | Confirm button (blue or red depending on `danger` prop) |

---

## CSS Classes for Assertions

| Class | Meaning |
|---|---|
| `.txn-amount.credit` | Green positive amount |
| `.txn-amount.debit` | Red negative amount |
| `.txn-status.completed` | Green "completed" badge |
| `.txn-status.pending` | Yellow "pending" badge |
| `.toggle-switch.on` | Toggle is enabled |
| `.nav-item.active` | Active sidebar nav item |
| `.contact-chip.selected` | Selected contact in Send Money |
| `.credit-card` (frozen) | Has inline `opacity: 0.7` and `background: #374151` |
