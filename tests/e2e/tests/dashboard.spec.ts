/**
 * Dashboard E2E Tests
 * Test plan: docs/test-plans/dashboard.md
 * E2E coverage: Dashboard-TC-001, Dashboard-TC-002, Dashboard-TC-003, Dashboard-TC-004, Dashboard-TC-005, Dashboard-TC-006
 * Skipped (Component): Dashboard-TC-007 — quick action buttons are static renders, no navigation or async behaviour
 */
import { test, expect } from '../fixtures/base-fixture';
import { DEMO_USER } from '../fixtures/test-users';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ authFlow, dashboardPage }) => {
    await authFlow.loginAsDemo();
    await dashboardPage.navigateViaSidebar();
  });

  test('Dashboard-TC-001: Total Balance stat card shows correct label, value, and change indicator', async ({ dashboardPage }) => {
    await expect(dashboardPage.statBalance).toContainText('Total Balance');
    await expect(dashboardPage.statBalance).toContainText(DEMO_USER.balance);
    await expect(dashboardPage.statBalance).toContainText('12.5% this month');
  });

  test('Dashboard-TC-002: Income stat card shows correct label, value, and change indicator', async ({ dashboardPage }) => {
    await expect(dashboardPage.statIncome).toContainText('Income');
    await expect(dashboardPage.statIncome).toContainText('$6,432');
    await expect(dashboardPage.statIncome).toContainText('8.2%');
  });

  test('Dashboard-TC-003: Expenses stat card shows correct label, value, and change indicator', async ({ dashboardPage }) => {
    await expect(dashboardPage.statExpenses).toContainText('Expenses');
    await expect(dashboardPage.statExpenses).toContainText('$2,180');
    await expect(dashboardPage.statExpenses).toContainText('3.1%');
  });

  test('Dashboard-TC-004: Savings stat card shows correct label, value, and change indicator', async ({ dashboardPage }) => {
    await expect(dashboardPage.statSavings).toContainText('Savings');
    await expect(dashboardPage.statSavings).toContainText('$4,252');
    await expect(dashboardPage.statSavings).toContainText('22.4%');
  });

  test('Dashboard-TC-005: Recent Transactions table shows exactly 5 rows', async ({ dashboardPage }) => {
    const count = await dashboardPage.getRecentTxnCount();
    expect(count).toBe(5);
  });

  test('Dashboard-TC-006: Recent Transactions first two rows show correct content', async ({ dashboardPage }) => {
    // Step 1: Verify TXN-001 — Netflix debit
    await expect(dashboardPage.txnRow('TXN-001')).toContainText('Netflix Subscription');
    await expect(dashboardPage.txnRow('TXN-001')).toContainText('2026-05-14');
    await expect(dashboardPage.txnRow('TXN-001')).toContainText('-$15.99');
    await expect(dashboardPage.txnRow('TXN-001')).toContainText('completed');

    // Step 2: Verify TXN-002 — Salary credit
    await expect(dashboardPage.txnRow('TXN-002')).toContainText('Salary Deposit - Acme Corp');
    await expect(dashboardPage.txnRow('TXN-002')).toContainText('+$5200.00');
    await expect(dashboardPage.txnRow('TXN-002')).toContainText('completed');
  });
});
