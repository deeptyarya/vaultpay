import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Intermediate abstract class for pages that render a toast and/or modal.
 * Extends BasePage; extended by CardsPage, SendMoneyPage, SettingsPage.
 *
 * Exposes waitForToast() and waitForModal() so flows never need to call
 * .waitFor() on a Locator property directly.
 */
export abstract class PageWithModals extends BasePage {
  readonly toastMessage: Locator;
  readonly modalOverlay: Locator;
  readonly modal: Locator;
  readonly modalConfirm: Locator;
  readonly modalCancel: Locator;

  constructor(page: Page) {
    super(page);
    this.toastMessage = page.getByTestId('toast-message');
    this.modalOverlay = page.getByTestId('modal-overlay');
    this.modal        = page.getByTestId('modal');
    this.modalConfirm = page.getByTestId('modal-confirm');
    this.modalCancel  = page.getByTestId('modal-cancel');
  }

  async waitForToast(): Promise<void> {
    await this.toastMessage.waitFor({ state: 'visible' });
  }

  async waitForModal(): Promise<void> {
    await this.modal.waitFor({ state: 'visible' });
  }

  async confirmModal(): Promise<void> {
    await this.modalConfirm.click();
  }

  async cancelModal(): Promise<void> {
    await this.modalCancel.click();
  }
}
