import { TransactionsPage } from '../pages/TransactionsPage';

/**
 * TransactionFlow — composite operations over the transactions list.
 * Each method returns the number of visible rows after the filter is applied.
 */
export class TransactionFlow {
  constructor(private txnPage: TransactionsPage) {}

  async searchTransactions(query: string): Promise<number> {
    await this.txnPage.search(query);
    return this.txnPage.getVisibleRowCount();
  }

  async filterByType(value: string): Promise<number> {
    await this.txnPage.filterType.selectOption(value);
    return this.txnPage.getVisibleRowCount();
  }

  async filterByStatus(value: string): Promise<number> {
    await this.txnPage.filterStatus.selectOption(value);
    return this.txnPage.getVisibleRowCount();
  }

  async filterByCategory(value: string): Promise<number> {
    await this.txnPage.filterCategory.selectOption(value);
    return this.txnPage.getVisibleRowCount();
  }
}
