# VaultPay Test Plan — Dashboard

## DASHBOARD

## Dashboard-TC-001: Dashboard — Total Balance Stat Card
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Logged in as demo user (Alex Morgan). On Dashboard.
**Steps**:
1. Observe `stat-balance`

**Expected Results**:
- Label reads "Total Balance"
- Value reads "$24,850.75"
- Change indicator shows "+12.5% this month" with green up arrow

**Business Rule**: Balance from MOCK_USERS — Alex Morgan balance is 24850.75 (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Dashboard-TC-002: Dashboard — Income Stat Card
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard.
**Steps**:
1. Observe `stat-income`

**Expected Results**:
- Label reads "Income"
- Value reads "$6,432"
- Change shows "+8.2%" with green arrow

**Business Rule**: Static dashboard stat — $6,432 income (domain.md § Dashboard Stats)  
**Suggested Layer**: E2E

## Dashboard-TC-003: Dashboard — Expenses Stat Card
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard.
**Steps**:
1. Observe `stat-expenses`

**Expected Results**:
- Label reads "Expenses"
- Value reads "$2,180"
- Change shows "-3.1%" with red down arrow

**Business Rule**: Static dashboard stat — $2,180 expenses, down 3.1% (domain.md § Dashboard Stats)  
**Suggested Layer**: E2E

## Dashboard-TC-004: Dashboard — Savings Stat Card
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard.
**Steps**:
1. Observe `stat-savings`

**Expected Results**:
- Label reads "Savings"
- Value reads "$4,252"
- Change shows "+22.4%" with green arrow

**Business Rule**: Static dashboard stat — $4,252 savings (domain.md § Dashboard Stats)  
**Suggested Layer**: E2E

## Dashboard-TC-005: Dashboard — Recent Transactions Shows Exactly 5 Rows
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Dashboard.
**Steps**:
1. Count rows in `recent-transactions-table`

**Expected Results**:
- Exactly 5 `<tr>` rows in tbody
- Rows correspond to TXN-001 through TXN-005 (first 5 from MOCK_TRANSACTIONS)
- TXN-006 through TXN-012 are NOT shown

**Business Rule**: DashboardPage slices first 5 transactions — `MOCK_TRANSACTIONS.slice(0, 5)` ([Code behavior: App.jsx:257])  
**Suggested Layer**: E2E

## Dashboard-TC-006: Dashboard — Recent Transactions Correct Row Content
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Dashboard.
**Steps**:
1. Observe `txn-row-TXN-001` content
2. Observe `txn-row-TXN-002` content

**Expected Results**:
- TXN-001 shows "Netflix Subscription", date "2026-05-14", "-$15.99", "completed"
- TXN-002 shows "Salary Deposit - Acme Corp", "+$5200.00", "completed"

**Business Rule**: First 5 entries of MOCK_TRANSACTIONS array (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Dashboard-TC-007: Dashboard — All Three Quick Action Buttons Present
**Category**: UI State
**Priority**: P3
**Preconditions**: Logged in. On Dashboard.
**Steps**:
1. Observe the Quick Actions card

**Expected Results**:
- `quick-send` is present with "Send Money" label
- `quick-cards` is present with "My Cards" label
- `quick-budget` is present with "Budget" label

**Business Rule**: [Code behavior: App.jsx:309–319 — three quick-action buttons rendered]  
**Suggested Layer**: Component

---

