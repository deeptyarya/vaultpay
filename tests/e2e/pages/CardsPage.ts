import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cards Page — manage payment cards (freeze, unfreeze, lock).
 * data-testid root: cards-page
 * Reference: .claude/references/ui-selectors.md § Cards Page
 *
 * Card IDs in mock data: CARD-001 (Visa), CARD-002 (Mastercard)
 * Dynamic locators (cardContainer, freezeBtn, lockBtn) accept a card ID string.
 */
export class CardsPage extends BasePage {
  readonly path = '';

  readonly cardsPage: Locator;
  readonly cardLimitsTable: Locator;
  readonly toastMessage: Locator;
  readonly modalOverlay: Locator;
  readonly modal: Locator;
  readonly modalConfirm: Locator;
  readonly modalCancel: Locator;

  constructor(page: Page) {
    super(page);
    this.cardsPage       = page.getByTestId('cards-page');
    this.cardLimitsTable = page.getByTestId('card-limits-table');
    this.toastMessage    = page.getByTestId('toast-message');
    this.modalOverlay    = page.getByTestId('modal-overlay');
    this.modal           = page.getByTestId('modal');
    this.modalConfirm    = page.getByTestId('modal-confirm');
    this.modalCancel     = page.getByTestId('modal-cancel');
  }

  get requiredElements(): Locator[] {
    return [this.cardsPage];
  }

  override navigate(): Promise<void> {
    throw new Error('CardsPage has no direct URL route — use navigateViaSidebar() after login');
  }

  async navigateViaSidebar(): Promise<void> {
    await super.navigateViaSidebar('nav-cards', 'cards-page');
  }

  cardContainer(cardId: string): Locator {
    return this.page.getByTestId(`card-${cardId}`);
  }

  freezeBtn(cardId: string): Locator {
    return this.page.getByTestId(`freeze-${cardId}`);
  }

  lockBtn(cardId: string): Locator {
    return this.page.getByTestId(`lock-${cardId}`);
  }

  async toggleFreeze(cardId: string): Promise<void> {
    await this.freezeBtn(cardId).click();
  }

  async clickLock(cardId: string): Promise<void> {
    await this.lockBtn(cardId).click();
  }

  async confirmModal(): Promise<void> {
    await this.modalConfirm.click();
  }

  async cancelModal(): Promise<void> {
    await this.modalCancel.click();
  }
}
