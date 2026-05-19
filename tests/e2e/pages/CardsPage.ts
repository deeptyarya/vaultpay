import { type Page, type Locator } from '@playwright/test';
import { PageWithModals } from './PageWithModals';

/**
 * Cards Page — manage payment cards (freeze, unfreeze, lock).
 * data-testid root: cards-page
 * Selectors defined from: src/App.jsx — Cards component
 *
 * Card IDs in mock data: CARD-001 (Visa), CARD-002 (Mastercard)
 * Dynamic locators (cardContainer, freezeBtn, lockBtn) accept a card ID string.
 */
export class CardsPage extends PageWithModals {
  readonly path = '';

  readonly cardsPage: Locator;
  readonly cardLimitsTable: Locator;

  constructor(page: Page) {
    super(page);
    this.cardsPage       = page.getByTestId('cards-page');
    this.cardLimitsTable = page.getByTestId('card-limits-table');
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

}
