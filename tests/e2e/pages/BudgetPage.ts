import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Budget Page — spending categories with progress bars and stat summary.
 * data-testid root: budget-page
 * Reference: .claude/references/ui-selectors.md § Budget Page
 *
 * budgetCategory() accepts category slugs: 'groceries', 'entertainment', 'transport',
 * 'shopping', 'utilities', 'food-&-drink' (note the literal ampersand in the selector).
 */
export class BudgetPage extends BasePage {
  readonly path = '';

  readonly budgetPage: Locator;
  readonly totalBudget: Locator;
  readonly totalSpent: Locator;
  readonly remainingBudget: Locator;

  constructor(page: Page) {
    super(page);
    this.budgetPage      = page.getByTestId('budget-page');
    this.totalBudget     = page.getByTestId('total-budget');
    this.totalSpent      = page.getByTestId('total-spent');
    this.remainingBudget = page.getByTestId('remaining-budget');
  }

  get requiredElements(): Locator[] {
    return [this.budgetPage];
  }

  override navigate(): Promise<void> {
    throw new Error('BudgetPage has no direct URL route — use navigateViaSidebar() after login');
  }

  async navigateViaSidebar(): Promise<void> {
    await super.navigateViaSidebar('nav-budget', 'budget-page');
  }

  budgetCategory(category: string): Locator {
    return this.page.getByTestId(`budget-${category}`);
  }
}
