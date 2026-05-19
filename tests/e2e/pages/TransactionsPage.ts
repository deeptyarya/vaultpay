import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Transactions Page — full transaction list with search and filters.
 * data-testid root: transactions-page
 * Reference: .claude/references/ui-selectors.md § Transactions Page
 */
export class TransactionsPage extends BasePage {
  readonly path = '';

  readonly transactionsPage: Locator;
  readonly txnSearch: Locator;
  readonly filterType: Locator;
  readonly filterStatus: Locator;
  readonly filterCategory: Locator;
  readonly transactionsTable: Locator;
  readonly noResults: Locator;

  constructor(page: Page) {
    super(page);
    this.transactionsPage = page.getByTestId('transactions-page');
    this.txnSearch        = page.getByTestId('txn-search');
    this.filterType       = page.getByTestId('filter-type');
    this.filterStatus     = page.getByTestId('filter-status');
    this.filterCategory   = page.getByTestId('filter-category');
    this.transactionsTable = page.getByTestId('transactions-table');
    this.noResults        = page.getByTestId('no-results');
  }

  get requiredElements(): Locator[] {
    return [this.transactionsPage, this.transactionsTable];
  }

  override navigate(): Promise<void> {
    throw new Error('TransactionsPage has no direct URL route — use navigateViaSidebar() after login');
  }

  async navigateViaSidebar(): Promise<void> {
    await super.navigateViaSidebar('nav-transactions', 'transactions-page');
  }

  txnRow(txnId: string): Locator {
    return this.page.getByTestId(`txn-row-${txnId}`);
  }

  async search(query: string): Promise<void> {
    await this.txnSearch.fill(query);
  }

  async getVisibleRowCount(): Promise<number> {
    return this.page.locator('[data-testid^="txn-row-"]').count();
  }
}
