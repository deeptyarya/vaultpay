import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page — main landing page after authentication.
 * data-testid root: dashboard-page
 * Reference: .claude/references/ui-selectors.md § Dashboard Page
 */
export class DashboardPage extends BasePage {
  readonly path = '/';

  readonly dashboardPage: Locator;
  readonly sidebar: Locator;
  readonly pageTitle: Locator;
  readonly statBalance: Locator;
  readonly statIncome: Locator;
  readonly statExpenses: Locator;
  readonly statSavings: Locator;
  readonly recentTransactionsTable: Locator;
  readonly viewAllTxn: Locator;
  readonly quickSend: Locator;
  readonly quickCards: Locator;
  readonly quickBudget: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardPage          = page.getByTestId('dashboard-page');
    this.sidebar                = page.getByTestId('sidebar');
    this.pageTitle              = page.getByTestId('page-title');
    this.statBalance            = page.getByTestId('stat-balance');
    this.statIncome             = page.getByTestId('stat-income');
    this.statExpenses           = page.getByTestId('stat-expenses');
    this.statSavings            = page.getByTestId('stat-savings');
    this.recentTransactionsTable = page.getByTestId('recent-transactions-table');
    this.viewAllTxn             = page.getByTestId('view-all-txn');
    this.quickSend              = page.getByTestId('quick-send');
    this.quickCards             = page.getByTestId('quick-cards');
    this.quickBudget            = page.getByTestId('quick-budget');
  }

  get requiredElements(): Locator[] {
    return [this.dashboardPage, this.sidebar];
  }

  async navigateViaSidebar(): Promise<void> {
    await super.navigateViaSidebar('nav-dashboard', 'dashboard-page');
  }

  async getPageTitleText(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async getBalanceText(): Promise<string> {
    return (await this.statBalance.textContent()) ?? '';
  }

  /** Dynamic locator for a specific row in the recent transactions table by transaction ID. */
  txnRow(id: string): Locator {
    return this.recentTransactionsTable.getByTestId(`txn-row-${id}`);
  }

  /** Returns the number of transaction rows visible in the recent transactions table. */
  async getRecentTxnCount(): Promise<number> {
    return this.recentTransactionsTable.locator('tbody tr').count();
  }
}
