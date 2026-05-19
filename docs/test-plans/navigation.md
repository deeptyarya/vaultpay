# VaultPay Test Plan — Navigation

## NAVIGATION

## Nav-TC-001: Navigation — Dashboard Sidebar Item
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in as demo user. Currently on any non-dashboard page.
**Steps**:
1. Click `nav-dashboard`

**Expected Results**:
- `dashboard-page` is visible
- `nav-dashboard` has CSS class `active`
- `page-title` reads "Welcome back, Alex"

**Business Rule**: [Code behavior: App.jsx:700–716 — navItems array, navigateTo sets activePage]  
**Suggested Layer**: E2E

## Nav-TC-002: Navigation — Transactions Sidebar Item
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. Currently on Dashboard.
**Steps**:
1. Click `nav-transactions`

**Expected Results**:
- `transactions-page` is visible
- `nav-transactions` has class `active`
- `page-title` reads "Transactions"

**Business Rule**: [Code behavior: App.jsx:712 — pageTitles.transactions]  
**Suggested Layer**: E2E

## Nav-TC-003: Navigation — Send Money Sidebar Item
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. Currently on Dashboard.
**Steps**:
1. Click `nav-send`

**Expected Results**:
- `send-money-page` is visible
- `nav-send` has class `active`
- `page-title` reads "Send Money"

**Business Rule**: [Code behavior: App.jsx:713 — pageTitles.send]  
**Suggested Layer**: E2E

## Nav-TC-004: Navigation — Cards Sidebar Item
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. Currently on Dashboard.
**Steps**:
1. Click `nav-cards`

**Expected Results**:
- `cards-page` is visible
- `nav-cards` has class `active`
- `page-title` reads "My Cards"

**Business Rule**: [Code behavior: App.jsx:714 — pageTitles.cards]  
**Suggested Layer**: E2E

## Nav-TC-005: Navigation — Budget Sidebar Item
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. Currently on Dashboard.
**Steps**:
1. Click `nav-budget`

**Expected Results**:
- `budget-page` is visible
- `nav-budget` has class `active`
- `page-title` reads "Budget"

**Business Rule**: [Code behavior: App.jsx:715 — pageTitles.budget]  
**Suggested Layer**: E2E

## Nav-TC-006: Navigation — Settings Sidebar Item
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. Currently on Dashboard.
**Steps**:
1. Click `nav-settings`

**Expected Results**:
- `settings-page` is visible
- `nav-settings` has class `active`
- `page-title` reads "Settings"

**Business Rule**: [Code behavior: App.jsx:716 — pageTitles.settings]  
**Suggested Layer**: E2E

## Nav-TC-007: Navigation — Logout Clears Auth State
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in as demo user.
**Steps**:
1. Click `nav-logout`

**Expected Results**:
- `signin-page` is visible
- `app-layout` is no longer visible
- `sidebar` is not visible

**Business Rule**: handleLogout sets user to null and page to "signin" ([Code behavior: App.jsx:696])  
**Suggested Layer**: E2E

## Nav-TC-008: Navigation — Cannot Return to App After Logout
**Category**: Security
**Priority**: P0
**Preconditions**: User was logged in, then logged out.
**Steps**:
1. After logout, observe current page
2. Attempt to navigate backward in browser history

**Expected Results**:
- `signin-page` remains visible (or reappears)
- No authenticated content is accessible

**Business Rule**: Page state is in-memory React state; browser history does not restore it (user-flows.md § Known Limitations — no persistence)  
**Suggested Layer**: E2E

## Nav-TC-009: Navigation — Active Nav Item Has Active Class
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. Starting on Dashboard.
**Steps**:
1. Observe `nav-dashboard` — confirm it has class `active`
2. Click `nav-transactions`
3. Observe `nav-transactions` has class `active`
4. Observe `nav-dashboard` no longer has class `active`

**Expected Results**:
- Exactly one nav item has class `active` at any time
- Active class follows the current page

**Business Rule**: [Code behavior: App.jsx:729 — className uses activePage === n.id ternary]  
**Suggested Layer**: Component

## Nav-TC-010: Navigation — Dashboard Quick Action: Send Money
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard page.
**Steps**:
1. Click `quick-send`

**Expected Results**:
- `send-money-page` becomes visible
- `nav-send` has class `active`

**Business Rule**: [Code behavior: App.jsx:310 — quick-action calls navigateTo("send")]  
**Suggested Layer**: E2E

## Nav-TC-011: Navigation — Dashboard Quick Action: My Cards
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard page.
**Steps**:
1. Click `quick-cards`

**Expected Results**:
- `cards-page` becomes visible
- `nav-cards` has class `active`

**Business Rule**: [Code behavior: App.jsx:313 — quick-action calls navigateTo("cards")]  
**Suggested Layer**: E2E

## Nav-TC-012: Navigation — Dashboard Quick Action: Budget
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard page.
**Steps**:
1. Click `quick-budget`

**Expected Results**:
- `budget-page` becomes visible
- `nav-budget` has class `active`

**Business Rule**: [Code behavior: App.jsx:316 — quick-action calls navigateTo("budget")]  
**Suggested Layer**: E2E

## Nav-TC-013: Navigation — View All Transactions From Dashboard
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard page.
**Steps**:
1. Click `view-all-txn`

**Expected Results**:
- `transactions-page` is visible
- Full table with all 12 transactions renders

**Business Rule**: [Code behavior: App.jsx:287 — "View All" calls navigateTo("transactions")]  
**Suggested Layer**: E2E

---

