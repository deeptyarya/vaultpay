/**
 * Auth E2E Tests
 * Test plan: docs/test-plans/auth.md
 * E2E coverage: Auth-TC-001 (sign-in happy path), Auth-TC-002 (loading state)
 * Skipped (Component): Auth-TC-003–Auth-TC-011 (validation error display, visibility toggle, navigation)
 * Skipped (Unit): Auth-TC-004, Auth-TC-006 (email regex, password min-length logic)
 * Skipped (E2E — sign up): Auth-TC-012–Auth-TC-025 (see separate sign-up spec when added)
 */
import { test, expect } from '../fixtures/base-fixture';
import { DEMO_USER } from '../fixtures/test-users';

test.describe('Auth — Sign In', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('Auth-TC-001: happy path — demo user lands on dashboard with correct data', async ({ page, loginPage }) => {
    // Step 1: Fill credentials
    await loginPage.fillAndSubmit(DEMO_USER.email, DEMO_USER.password);

    // Step 2: Wait for 1,200ms async delay to resolve
    await page.getByTestId('dashboard-page').waitFor({ state: 'visible' });

    // Step 3: Assert authenticated layout
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.getByTestId('page-title')).toContainText('Welcome back, Alex');

    // Step 4: Assert dashboard data for demo user (balance from MOCK_USERS in App.jsx)
    await expect(page.getByTestId('stat-balance')).toContainText(DEMO_USER.balance);
  });

  test('Auth-TC-002: submit button shows loading state during 1,200ms sign-in delay', async ({ page, loginPage }) => {
    // Step 1: Fill credentials
    await loginPage.fillAndSubmit(DEMO_USER.email, DEMO_USER.password);

    // Step 2: Assert loading state is active before the 1,200ms delay resolves
    // setLoading(true) fires synchronously before setTimeout (App.jsx:121)
    await expect(loginPage.submitButton).toBeDisabled();
    await expect(loginPage.submitButton).toHaveText('Signing in...');

    // Step 3: Confirm the delay eventually resolves and navigation completes
    await page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
  });
});
