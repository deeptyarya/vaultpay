import { type Page, type Locator } from '@playwright/test';
import { PageWithModals } from './PageWithModals';

/**
 * Send Money Page — transfer funds to contacts or by email.
 * data-testid root: send-money-page
 * Selectors defined from: src/App.jsx — Send Money component
 *
 * Note: nav testid is 'nav-send' but page root is 'send-money-page' (asymmetric by design in the app).
 */
export class SendMoneyPage extends PageWithModals {
  readonly path = '';

  readonly sendMoneyPage: Locator;
  readonly recipientEmail: Locator;
  readonly sendAmount: Locator;
  readonly sendNote: Locator;
  readonly sendSubmit: Locator;
  readonly recipientError: Locator;
  readonly amountError: Locator;

  constructor(page: Page) {
    super(page);
    this.sendMoneyPage  = page.getByTestId('send-money-page');
    this.recipientEmail = page.getByTestId('recipient-email');
    this.sendAmount     = page.getByTestId('send-amount');
    this.sendNote       = page.getByTestId('send-note');
    this.sendSubmit     = page.getByTestId('send-submit');
    this.recipientError = page.getByTestId('recipient-error');
    this.amountError    = page.getByTestId('amount-error');
  }

  get requiredElements(): Locator[] {
    return [this.sendMoneyPage];
  }

  override navigate(): Promise<void> {
    throw new Error('SendMoneyPage has no direct URL route — use navigateViaSidebar() after login');
  }

  async navigateViaSidebar(): Promise<void> {
    // nav-send → send-money-page: nav testid and page container testid differ (app quirk)
    await super.navigateViaSidebar('nav-send', 'send-money-page');
  }

  contactChip(contactId: string): Locator {
    return this.page.getByTestId(`contact-${contactId}`);
  }

  async fillAndReview(amount: number, note?: string): Promise<void> {
    await this.sendAmount.fill(String(amount));
    if (note) await this.sendNote.fill(note);
    await this.sendSubmit.click();
  }
}
