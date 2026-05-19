import { test as base, expect } from '@playwright/test';
import { LoginPage }        from '../pages/LoginPage';
import { DashboardPage }    from '../pages/DashboardPage';
import { CardsPage }        from '../pages/CardsPage';
import { SendMoneyPage }    from '../pages/SendMoneyPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { BudgetPage }       from '../pages/BudgetPage';
import { SettingsPage }     from '../pages/SettingsPage';
import { AuthFlow }         from '../flows/AuthFlow';
import { CardFlow }         from '../flows/CardFlow';
import { SendMoneyFlow }    from '../flows/SendMoneyFlow';
import { TransactionFlow }  from '../flows/TransactionFlow';

type VaultPayFixtures = {
  loginPage:        LoginPage;
  dashboardPage:    DashboardPage;
  cardsPage:        CardsPage;
  sendMoneyPage:    SendMoneyPage;
  transactionsPage: TransactionsPage;
  budgetPage:       BudgetPage;
  settingsPage:     SettingsPage;
  authFlow:         AuthFlow;
  cardFlow:         CardFlow;
  sendMoneyFlow:    SendMoneyFlow;
  transactionFlow:  TransactionFlow;
};

export const test = base.extend<VaultPayFixtures>({
  loginPage:        async ({ page }, use) => { await use(new LoginPage(page)); },
  dashboardPage:    async ({ page }, use) => { await use(new DashboardPage(page)); },
  cardsPage:        async ({ page }, use) => { await use(new CardsPage(page)); },
  sendMoneyPage:    async ({ page }, use) => { await use(new SendMoneyPage(page)); },
  transactionsPage: async ({ page }, use) => { await use(new TransactionsPage(page)); },
  budgetPage:       async ({ page }, use) => { await use(new BudgetPage(page)); },
  settingsPage:     async ({ page }, use) => { await use(new SettingsPage(page)); },

  // Flows construct their own page instance from 'page' to avoid circular fixture dependencies.
  // Playwright guarantees the same 'page' instance is shared within a test.
  authFlow:        async ({ page }, use) => { await use(new AuthFlow(new LoginPage(page))); },
  cardFlow:        async ({ page }, use) => { await use(new CardFlow(new CardsPage(page))); },
  sendMoneyFlow:   async ({ page }, use) => { await use(new SendMoneyFlow(new SendMoneyPage(page))); },
  transactionFlow: async ({ page }, use) => { await use(new TransactionFlow(new TransactionsPage(page))); },
});

export { expect } from '@playwright/test';
