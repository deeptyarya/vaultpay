# VaultPay Test Plan — Transactions

## TRANSACTIONS

## Trans-TC-001: Transactions — All 12 Records Render
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in. Navigate to `nav-transactions`.
**Steps**:
1. Observe `transactions-table`

**Expected Results**:
- Exactly 12 rows in tbody
- `txn-row-TXN-001` through `txn-row-TXN-012` all present
- No filters are applied (all dropdowns on "All")

**Business Rule**: TransactionsPage renders all MOCK_TRANSACTIONS when no filter is active ([Code behavior: App.jsx:336–342])  
**Suggested Layer**: E2E

## Trans-TC-002: Transactions — Search by Description (Case-Insensitive)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Fill `txn-search` with `netflix`

**Expected Results**:
- Only `txn-row-TXN-001` is visible ("Netflix Subscription")
- `txn-row-TXN-002` through TXN-012 are not visible

**Business Rule**: Search matches description case-insensitively via `.toLowerCase().includes()` (business-rules.md § Transactions Filtering)  
**Suggested Layer**: E2E

## Trans-TC-003: Transactions — Search by Description (Uppercase)
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Fill `txn-search` with `AMAZON`

**Expected Results**:
- Only `txn-row-TXN-006` is visible ("Amazon Purchase")

**Business Rule**: Case-insensitive search — uppercase query still matches lowercase in description (business-rules.md § Transactions Filtering)  
**Suggested Layer**: E2E

## Trans-TC-004: Transactions — Search by Transaction ID
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Fill `txn-search` with `TXN-006`

**Expected Results**:
- Only `txn-row-TXN-006` is visible ("Amazon Purchase")

**Business Rule**: Search matches against transaction ID as well as description (business-rules.md § Transactions Filtering)  
**Suggested Layer**: E2E

## Trans-TC-005: Transactions — Search With No Matches Shows Empty State
**Category**: Edge Case
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Fill `txn-search` with `zzznotfound`

**Expected Results**:
- `no-results` element is visible with text "No transactions found"
- `transactions-table` is not visible

**Business Rule**: Empty result state renders `no-results` div (business-rules.md § Transactions Filtering)  
**Suggested Layer**: E2E

## Trans-TC-006: Transactions — Filter by Type: Credit (3 Results)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Credit" in `filter-type` dropdown

**Expected Results**:
- Exactly 3 rows visible: TXN-002, TXN-007, TXN-011
- All have amounts prefixed with "+"

**Business Rule**: type filter "credit" matches transactions where type === "credit" ([Code behavior: App.jsx:339])  
**Suggested Layer**: E2E

## Trans-TC-007: Transactions — Filter by Type: Debit (9 Results)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Debit" in `filter-type` dropdown

**Expected Results**:
- Exactly 9 rows visible
- All have amounts prefixed with "-"

**Business Rule**: 12 total - 3 credit = 9 debit transactions (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Trans-TC-008: Transactions — Filter by Status: Pending (1 Result)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Pending" in `filter-status` dropdown

**Expected Results**:
- Exactly 1 row: `txn-row-TXN-006` ("Amazon Purchase")
- Status badge shows "pending"

**Business Rule**: Only TXN-006 has status "pending" in MOCK_TRANSACTIONS (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Trans-TC-009: Transactions — Filter by Status: Completed (11 Results)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Completed" in `filter-status` dropdown

**Expected Results**:
- Exactly 11 rows visible
- TXN-006 is not shown

**Business Rule**: 12 total - 1 pending = 11 completed (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Trans-TC-010: Transactions — Filter by Category: Entertainment (2 Results)
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Entertainment" in `filter-category` dropdown

**Expected Results**:
- Exactly 2 rows: TXN-001 (Netflix), TXN-012 (Spotify)

**Business Rule**: Two transactions in Entertainment category (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Trans-TC-011: Transactions — Filter by Category: Income (2 Results)
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Income" in `filter-category` dropdown

**Expected Results**:
- Exactly 2 rows: TXN-002 (Salary), TXN-007 (Freelance)

**Business Rule**: Two Income category transactions (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Trans-TC-012: Transactions — Combined Filter: Credit + Income
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Credit" in `filter-type`
2. Select "Income" in `filter-category`

**Expected Results**:
- Exactly 2 rows: TXN-002 and TXN-007
- Both are credit AND income

**Business Rule**: All filter conditions are ANDed together ([Code behavior: App.jsx:336–342])  
**Suggested Layer**: E2E

## Trans-TC-013: Transactions — Combined Filter: Pending + Debit (Single Result)
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Pending" in `filter-status`
2. Select "Debit" in `filter-type`

**Expected Results**:
- Exactly 1 row: TXN-006 (Amazon Purchase — the only pending debit)

**Business Rule**: Pending AND debit = only TXN-006 (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Trans-TC-014: Transactions — Combined Filter Returns Empty State
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Select "Pending" in `filter-status`
2. Select "Credit" in `filter-type`

**Expected Results**:
- `no-results` element is visible (no pending credits exist)

**Business Rule**: No transactions are both pending and credit — empty result triggers empty state (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Trans-TC-015: Transactions — Credit Amount Has Green + Prefix
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Locate `txn-row-TXN-002` (Salary Deposit)
2. Observe amount cell

**Expected Results**:
- Amount displays "+$5200.00"
- Cell has CSS class `txn-amount credit` (green styling)

**Business Rule**: Credit type renders with "+" prefix and `.credit` class ([Code behavior: App.jsx:381])  
**Suggested Layer**: Component

## Trans-TC-016: Transactions — Debit Amount Has Red Minus Prefix
**Category**: UI State
**Priority**: P1
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Locate `txn-row-TXN-001` (Netflix Subscription)
2. Observe amount cell

**Expected Results**:
- Amount displays "-$15.99"
- Cell has CSS class `txn-amount debit` (red styling)

**Business Rule**: Debit type renders with "-" prefix and `.debit` class ([Code behavior: App.jsx:381])  
**Suggested Layer**: Component

## Trans-TC-017: Transactions — Pending Status Badge Styling
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Locate `txn-row-TXN-006`
2. Observe status badge element

**Expected Results**:
- Badge text reads "pending"
- Badge has class `txn-status pending` (yellow styling)

**Business Rule**: pending status renders `.txn-status.pending` class (App.jsx — txn-status CSS classes)  
**Suggested Layer**: Component

## Trans-TC-018: Transactions — Completed Status Badge Styling
**Category**: UI State
**Priority**: P2
**Preconditions**: Logged in. On Transactions page.
**Steps**:
1. Locate `txn-row-TXN-001`
2. Observe status badge element

**Expected Results**:
- Badge text reads "completed"
- Badge has class `txn-status completed` (green styling)

**Business Rule**: completed status renders `.txn-status.completed` class (App.jsx — txn-status CSS classes)  
**Suggested Layer**: Component

## Trans-TC-019: Transactions — Clearing Search Restores All Results
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Logged in. On Transactions page. Search term entered causing filtered results.
**Steps**:
1. Fill `txn-search` with `netflix` — 1 result shows
2. Clear `txn-search` (empty the field)

**Expected Results**:
- All 12 transaction rows are visible again

**Business Rule**: Filter function re-evaluates on every input change; empty search skips description/id filter ([Code behavior: App.jsx:337])  
**Suggested Layer**: E2E

---

