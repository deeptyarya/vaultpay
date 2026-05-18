/**
 * Cards E2E Tests
 * Test plan: docs/test-plans/cards.md
 * E2E coverage: Cards-TC-001, Cards-TC-004–005, Cards-TC-007–009, Cards-TC-011–014
 * Skipped (Component): Cards-TC-002–003 (card background color), Cards-TC-006 (button label toggle), Cards-TC-010 (modal danger styling)
 */
import { test, expect } from '@playwright/test';
import { login, navigateTo } from './fixtures';

test.describe('Cards', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateTo(page, 'cards');
  });

  test('Cards-TC-001: both cards render with correct details', async ({ page }) => {
    // Step 1: Assert Visa card
    await expect(page.getByTestId('card-CARD-001')).toBeVisible();
    await expect(page.getByTestId('card-CARD-001')).toContainText('4821');
    await expect(page.getByTestId('card-CARD-001')).toContainText('09/28');
    await expect(page.getByTestId('card-CARD-001')).toContainText('Alex Morgan');
    await expect(page.getByTestId('card-CARD-001')).toContainText('Visa');

    // Step 2: Assert Mastercard
    await expect(page.getByTestId('card-CARD-002')).toBeVisible();
    await expect(page.getByTestId('card-CARD-002')).toContainText('7733');
    await expect(page.getByTestId('card-CARD-002')).toContainText('03/27');
    await expect(page.getByTestId('card-CARD-002')).toContainText('Alex Morgan');
    await expect(page.getByTestId('card-CARD-002')).toContainText('Mastercard');
  });

  // Component TCs skipped: Cards-TC-002 (Visa background color), Cards-TC-003 (Mastercard background color)

  test('Cards-TC-004: freezing Visa card shows FROZEN badge', async ({ page }) => {
    await page.getByTestId('freeze-CARD-001').click();
    await expect(page.getByTestId('card-CARD-001')).toContainText('FROZEN');
  });

  test('Cards-TC-005: freezing Visa card shows success toast', async ({ page }) => {
    await page.getByTestId('freeze-CARD-001').click();
    await expect(page.getByTestId('toast-message')).toBeVisible();
    await expect(page.getByTestId('toast-message')).toContainText('Card frozen');
  });

  // Component TC skipped: Cards-TC-006 (button label toggle — isolated render)

  test('Cards-TC-007: unfreezing Visa card removes FROZEN badge and shows toast', async ({ page }) => {
    // Step 1: Freeze first
    await page.getByTestId('freeze-CARD-001').click();
    await expect(page.getByTestId('card-CARD-001')).toContainText('FROZEN');

    // Step 2: Unfreeze
    await page.getByTestId('freeze-CARD-001').click();

    // Step 3: Assert restored state
    await expect(page.getByTestId('card-CARD-001')).not.toContainText('FROZEN');
    await expect(page.getByTestId('toast-message')).toContainText('Card unfrozen');
  });

  test('Cards-TC-008: freezing Mastercard does not affect Visa card', async ({ page }) => {
    await page.getByTestId('freeze-CARD-002').click();

    // Step 1: Mastercard frozen
    await expect(page.getByTestId('card-CARD-002')).toContainText('FROZEN');
    await expect(page.getByTestId('toast-message')).toContainText('Card frozen');

    // Step 2: Visa unaffected
    await expect(page.getByTestId('card-CARD-001')).not.toContainText('FROZEN');
  });

  test('Cards-TC-009: clicking Lock opens danger modal with permanent lock warning', async ({ page }) => {
    await page.getByTestId('lock-CARD-001').click();

    // Step 1: Modal visible
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    await expect(page.getByTestId('modal')).toBeVisible();

    // Step 2: Modal content
    await expect(page.getByTestId('modal')).toContainText('Lock Card');
    await expect(page.getByTestId('modal')).toContainText(
      "This will permanently lock the card. You'll need to request a replacement. Are you sure?"
    );
  });

  // Component TC skipped: Cards-TC-010 (modal danger styling — isolated render)

  test('Cards-TC-011: confirming lock shows error toast and closes modal', async ({ page }) => {
    // Step 1: Open modal
    await page.getByTestId('lock-CARD-001').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    // Step 2: Confirm lock
    await page.getByTestId('modal-confirm').click();

    // Step 3: Assert error toast and modal dismissed
    await expect(page.getByTestId('toast-message')).toContainText('Card locked permanently');
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  test('Cards-TC-012: lock card does not change card visual state (known limitation)', async ({ page }) => {
    // KNOWN LIMITATION: locking a card does not update the card UI status
    await page.getByTestId('lock-CARD-001').click();
    await page.getByTestId('modal-confirm').click();
    await expect(page.getByTestId('toast-message')).toContainText('Card locked permanently');

    // Card still appears active — no FROZEN badge, freeze button still reads "Freeze"
    await expect(page.getByTestId('card-CARD-001')).not.toContainText('FROZEN');
    await expect(page.getByTestId('freeze-CARD-001')).toContainText('Freeze');
  });

  test('Cards-TC-013: cancelling lock modal closes without toast', async ({ page }) => {
    // Step 1: Open modal
    await page.getByTestId('lock-CARD-001').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    // Step 2: Cancel
    await page.getByTestId('modal-cancel').click();

    // Step 3: Modal gone, no toast fired
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
    await expect(page.getByTestId('toast-message')).not.toBeVisible();
  });

  test('Cards-TC-014: card limits table renders with correct values', async ({ page }) => {
    await expect(page.getByTestId('card-limits-table')).toBeVisible();
    await expect(page.getByTestId('card-limits-table')).toContainText('$10,000');
    await expect(page.getByTestId('card-limits-table')).toContainText('$5,000');
  });
});
