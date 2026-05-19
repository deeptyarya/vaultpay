/**
 * Cards E2E Tests
 * Test plan: docs/test-plans/cards.md
 * E2E coverage: Cards-TC-001, Cards-TC-004–005, Cards-TC-007–009, Cards-TC-011–014
 * Skipped (Component): Cards-TC-002–003 (card background color), Cards-TC-006 (button label toggle), Cards-TC-010 (modal danger styling)
 */
import { test, expect } from '../fixtures/base-fixture';

test.describe('Cards', () => {
  test.beforeEach(async ({ authFlow, cardsPage }) => {
    await authFlow.loginAsDemo();
    await cardsPage.navigateViaSidebar();
  });

  test('Cards-TC-001: both cards render with correct details', async ({ cardsPage }) => {
    // Step 1: Assert Visa card
    await expect(cardsPage.cardContainer('CARD-001')).toBeVisible();
    await expect(cardsPage.cardContainer('CARD-001')).toContainText('4821');
    await expect(cardsPage.cardContainer('CARD-001')).toContainText('09/28');
    await expect(cardsPage.cardContainer('CARD-001')).toContainText('Alex Morgan');
    await expect(cardsPage.cardContainer('CARD-001')).toContainText('Visa');

    // Step 2: Assert Mastercard
    await expect(cardsPage.cardContainer('CARD-002')).toBeVisible();
    await expect(cardsPage.cardContainer('CARD-002')).toContainText('7733');
    await expect(cardsPage.cardContainer('CARD-002')).toContainText('03/27');
    await expect(cardsPage.cardContainer('CARD-002')).toContainText('Alex Morgan');
    await expect(cardsPage.cardContainer('CARD-002')).toContainText('Mastercard');
  });

  // Component TCs skipped: Cards-TC-002 (Visa background color), Cards-TC-003 (Mastercard background color)

  test('Cards-TC-004: freezing Visa card shows FROZEN badge', async ({ cardsPage }) => {
    await cardsPage.toggleFreeze('CARD-001');
    await expect(cardsPage.cardContainer('CARD-001')).toContainText('FROZEN');
  });

  test('Cards-TC-005: freezing Visa card shows success toast', async ({ cardsPage }) => {
    await cardsPage.toggleFreeze('CARD-001');
    await expect(cardsPage.toastMessage).toBeVisible();
    await expect(cardsPage.toastMessage).toContainText('Card frozen');
  });

  // Component TC skipped: Cards-TC-006 (button label toggle — isolated render)

  test('Cards-TC-007: unfreezing Visa card removes FROZEN badge and shows toast', async ({ cardsPage }) => {
    // Step 1: Freeze first
    await cardsPage.toggleFreeze('CARD-001');
    await expect(cardsPage.cardContainer('CARD-001')).toContainText('FROZEN');

    // Step 2: Unfreeze
    await cardsPage.toggleFreeze('CARD-001');

    // Step 3: Assert restored state
    await expect(cardsPage.cardContainer('CARD-001')).not.toContainText('FROZEN');
    await expect(cardsPage.toastMessage).toContainText('Card unfrozen');
  });

  test('Cards-TC-008: freezing Mastercard does not affect Visa card', async ({ cardsPage }) => {
    await cardsPage.toggleFreeze('CARD-002');

    // Step 1: Mastercard frozen
    await expect(cardsPage.cardContainer('CARD-002')).toContainText('FROZEN');
    await expect(cardsPage.toastMessage).toContainText('Card frozen');

    // Step 2: Visa unaffected
    await expect(cardsPage.cardContainer('CARD-001')).not.toContainText('FROZEN');
  });

  test('Cards-TC-009: clicking Lock opens danger modal with permanent lock warning', async ({ cardsPage }) => {
    await cardsPage.clickLock('CARD-001');

    // Step 1: Modal visible
    await expect(cardsPage.modalOverlay).toBeVisible();
    await expect(cardsPage.modal).toBeVisible();

    // Step 2: Modal content
    await expect(cardsPage.modal).toContainText('Lock Card');
    await expect(cardsPage.modal).toContainText(
      "This will permanently lock the card. You'll need to request a replacement. Are you sure?"
    );
  });

  // Component TC skipped: Cards-TC-010 (modal danger styling — isolated render)

  test('Cards-TC-011: confirming lock shows error toast and closes modal', async ({ cardsPage }) => {
    // Step 1: Open modal
    await cardsPage.clickLock('CARD-001');
    await expect(cardsPage.modalOverlay).toBeVisible();

    // Step 2: Confirm lock
    await cardsPage.confirmModal();

    // Step 3: Assert error toast and modal dismissed
    await expect(cardsPage.toastMessage).toContainText('Card locked permanently');
    await expect(cardsPage.modalOverlay).not.toBeVisible();
  });

  test('Cards-TC-012: lock card does not change card visual state (known limitation)', async ({ cardsPage }) => {
    // KNOWN LIMITATION: locking a card does not update the card UI status
    await cardsPage.clickLock('CARD-001');
    await cardsPage.confirmModal();
    await expect(cardsPage.toastMessage).toContainText('Card locked permanently');

    // Card still appears active — no FROZEN badge, freeze button still reads "Freeze"
    await expect(cardsPage.cardContainer('CARD-001')).not.toContainText('FROZEN');
    await expect(cardsPage.freezeBtn('CARD-001')).toContainText('Freeze');
  });

  test('Cards-TC-013: cancelling lock modal closes without toast', async ({ cardsPage }) => {
    // Step 1: Open modal
    await cardsPage.clickLock('CARD-001');
    await expect(cardsPage.modalOverlay).toBeVisible();

    // Step 2: Cancel
    await cardsPage.cancelModal();

    // Step 3: Modal gone, no toast fired
    await expect(cardsPage.modalOverlay).not.toBeVisible();
    await expect(cardsPage.toastMessage).not.toBeVisible();
  });

  test('Cards-TC-014: card limits table renders with correct values', async ({ cardsPage }) => {
    await expect(cardsPage.cardLimitsTable).toBeVisible();
    await expect(cardsPage.cardLimitsTable).toContainText('$10,000');
    await expect(cardsPage.cardLimitsTable).toContainText('$5,000');
  });
});
