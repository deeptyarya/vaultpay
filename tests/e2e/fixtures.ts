import type { Page } from '@playwright/test';

export const BASE_URL = 'http://localhost:3000';
export const DEMO_EMAIL = 'demo@vaultpay.com';
export const DEMO_PASSWORD = 'Demo@1234';

/**
 * Signs in as the demo user and waits for the dashboard to be visible.
 * Handles the 1,200ms simulated async delay — callers do not need to wait separately.
 */
export async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.getByTestId('signin-email').fill(DEMO_EMAIL);
  await page.getByTestId('signin-password').fill(DEMO_PASSWORD);
  await page.getByTestId('signin-submit').click();
  await page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
}

/**
 * Navigates to a feature page via the sidebar and waits for it to be visible.
 * @param feature One of: 'dashboard' | 'transactions' | 'send' | 'cards' | 'budget' | 'settings'
 * Note: 'send' clicks nav-send but waits for send-money-page (the nav ID and page testid differ).
 */
export async function navigateTo(page: Page, feature: string): Promise<void> {
  const pageId = feature === 'send' ? 'send-money-page' : `${feature}-page`;
  await page.getByTestId(`nav-${feature}`).click();
  await page.getByTestId(pageId).waitFor({ state: 'visible' });
}
