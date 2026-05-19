import { SendMoneyPage } from '../pages/SendMoneyPage';

/**
 * SendMoneyFlow — full send-money sequence from contact selection to confirmation.
 * The confirm step has a 1,500ms simulated delay — waits on toast-message.
 */
export class SendMoneyFlow {
  constructor(private sendPage: SendMoneyPage) {}

  /**
   * Sends money to a contact chip, fills amount/note, reviews, and confirms.
   * @param contactId e.g. 'C-001' (Sarah K.), 'C-002' (James W.)
   * @param amount numeric amount
   * @param note optional transfer note
   */
  async sendToContact(contactId: string, amount: number, note?: string): Promise<void> {
    await this.sendPage.contactChip(contactId).click();
    await this.sendPage.fillAndReview(amount, note);
    await this.sendPage.confirmModal();
    await this.sendPage.waitForToast();
  }
}
