import { CardsPage } from '../pages/CardsPage';

/**
 * CardFlow — multi-step card operations that combine multiple locator interactions.
 * Use in specs that test sequences (e.g. freeze then assert then unfreeze).
 */
export class CardFlow {
  constructor(private cardsPage: CardsPage) {}

  /**
   * Clicks the freeze/unfreeze toggle for a card and waits for the success toast.
   */
  async freezeCard(cardId: string): Promise<void> {
    await this.cardsPage.toggleFreeze(cardId);
    await this.cardsPage.waitForToast();
  }

  /**
   * Opens the lock danger modal, confirms, and waits for the toast to confirm the action.
   */
  async lockCard(cardId: string): Promise<void> {
    await this.cardsPage.clickLock(cardId);
    await this.cardsPage.waitForModal();
    await this.cardsPage.confirmModal();
    await this.cardsPage.waitForToast();
  }
}
