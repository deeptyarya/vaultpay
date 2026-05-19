/**
 * Auth E2E Tests
 * Test plan: docs/test-plans/auth.md
 * E2E coverage: Auth-TC-001 (sign-in happy path), Auth-TC-002 (loading state)
 * Skipped (Component): Auth-TC-003–Auth-TC-011 (validation error display, visibility toggle, navigation)
 * Skipped (Unit): Auth-TC-004, Auth-TC-006 (email regex, password min-length logic)
 * Skipped (E2E — sign up): Auth-TC-012–Auth-TC-025 (see separate sign-up spec when added)
 */
import { test, expect } from '@playwright/test';
import { BASE_URL, DEMO_EMAIL, DEMO_PASSWORD } from './fixtures';

test.describe('Auth — Sign In', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Auth-TC-001: happy path — demo user lands on dashboard with correct data', async ({ page }) => {
    // Step 1: Fill credentials
    await page.getByTestId('signin-email').fill(DEMO_EMAIL);
    await page.getByTestId('signin-password').fill(DEMO_PASSWORD);

    // Step 2: Submit and wait for 1,200ms async delay to resolve
    await page.getByTestId('signin-submit').click();
    await page.getByTestId('dashboard-page').waitFor({ state: 'visible' });

    // Step 3: Assert authenticated layout
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.getByTestId('page-title')).toContainText('Welcome back, Alex');

    // Step 4: Assert dashboard data for demo user (balance from MOCK_USERS — App.jsx:5)
    await expect(page.getByTestId('stat-balance')).toContainText('$24,850.75');
  });

  test('Auth-TC-002: submit button shows loading state during 1,200ms sign-in delay', async ({ page }) => {
    // Step 1: Fill credentials
    await page.getByTestId('signin-email').fill(DEMO_EMAIL);
    await page.getByTestId('signin-password').fill(DEMO_PASSWORD);

    // Step 2: Click submit — setLoading(true) fires synchronously before setTimeout (App.jsx:121)
    await page.getByTestId('signin-submit').click();

    // Step 3: Assert loading state is active before the 1,200ms delay resolves
    await expect(page.getByTestId('signin-submit')).toBeDisabled();
    await expect(page.getByTestId('signin-submit')).toHaveText('Signing in...');

    // Step 4: Confirm the delay eventually resolves and navigation completes
    await page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
  });
});
