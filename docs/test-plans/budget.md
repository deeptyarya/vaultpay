# VaultPay Test Plan — Budget

## BUDGET

## Budget-TC-001: Budget — Total Budget Stat Card
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. Navigate to `nav-budget`.
**Steps**:
1. Observe `total-budget`

**Expected Results**:
- Label reads "Total Budget"
- Value reads "$1,400"

**Business Rule**: Sum of all BUDGET_DATA.budget values = 400+100+200+300+250+150 = $1,400 (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Budget-TC-002: Budget — Total Spent Stat Card
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Budget page.
**Steps**:
1. Observe `total-spent`

**Expected Results**:
- Value reads "$930.95"

**Business Rule**: Sum of all spent values: 287.43+25.98+123.50+264.99+142.30+86.75 = $930.95 (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Budget-TC-003: Budget — Remaining Budget Stat Card
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Budget page.
**Steps**:
1. Observe `remaining-budget`

**Expected Results**:
- Value reads "$469.05"
- Value is displayed in green color (#10b981)

**Business Rule**: 1400 - 930.95 = $469.05; color is --success (#10b981) ([Code behavior: App.jsx:569])  
**Suggested Layer**: E2E

## Budget-TC-004: Budget — All Six Category Cards Are Visible
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Logged in. On Budget page.
**Steps**:
1. Observe the budget grid

**Expected Results**:
- `budget-groceries` is visible
- `budget-entertainment` is visible
- `budget-transport` is visible
- `budget-shopping` is visible
- `budget-utilities` is visible
- `budget-food-&-drink` is visible

**Business Rule**: 6 entries in BUDGET_DATA render as 6 category cards (domain.md § Mock Data)  
**Suggested Layer**: E2E

## Budget-TC-005: Budget — Groceries Category Values
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Logged in. On Budget page.
**Steps**:
1. Observe `budget-groceries`

**Expected Results**:
- Displays "$287.43 / $400"
- Progress bar shows approximately 71.9%
- Label reads "71% used" (or "72%" depending on rounding)
- Bar color is #10b981 (green — under 90%)

**Business Rule**: Groceries: spent $287.43, budget $400, pct = 71.86% (business-rules.md § Budget Visual Rules)  
**Suggested Layer**: E2E

## Budget-TC-006: Budget — Shopping Category Near-Limit (88.3%, NOT Red)
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Logged in. On Budget page.
**Steps**:
1. Observe `budget-shopping`

**Expected Results**:
- Displays "$264.99 / $300"
- Percentage reads "88% used"
- Progress bar color is #ef4444 (Shopping's own category color — also happens to be red)
- Bar is NOT turning red due to threshold (88% < 90%)

**Business Rule**: Bar turns red (#ef4444) only at ≥ 90%. Shopping color happens to also be #ef4444 but it's the category color, not the warning color. At 88.3% it has NOT crossed the threshold. (business-rules.md § Budget Visual Rules)  
**Suggested Layer**: Component

## Budget-TC-007: Budget — Progress Bar Turns Red at ≥ 90% Usage
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Understanding of code logic (unit test scenario). No current BUDGET_DATA item is at ≥ 90% in production mock.
**Steps**:
1. In a component test, render BudgetPage with a category at 90% spent (e.g. spent=$360, budget=$400)
2. Observe progress bar fill color

**Expected Results**:
- Bar fill color is #ef4444 (red warning color)
- This overrides the category's own color at this threshold

**Business Rule**: `pct > 90 ? "#ef4444" : b.color` — at exactly 90 the condition is false; at 91 it turns red ([Code behavior: App.jsx:590])  
**Suggested Layer**: Unit

## Budget-TC-008: Budget — Progress Bar Capped at 100% When Over Budget
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Component test with overspent category (spent > budget).
**Steps**:
1. Render with spent=$500, budget=$400 (125% overspent)
2. Observe progress bar width

**Expected Results**:
- Bar width is 100% (not 125%)
- Percentage label reads "100% used"

**Business Rule**: `Math.min((spent/budget)*100, 100)` — capped at 100 (business-rules.md § Budget Visual Rules)  
**Suggested Layer**: Unit

---

