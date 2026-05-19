import { type Page, type Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract readonly path: string;
  abstract get requiredElements(): Locator[];

  async navigate(): Promise<void> {
    await this.page.goto(this.path);
    await this.validate();
  }

  async validate(): Promise<void> {
    for (const el of this.requiredElements) {
      await expect(el).toBeVisible({ timeout: 10_000 });
    }
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.validate();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigates to this page via the sidebar nav item after login.
   * @param navTestId e.g. 'nav-cards'
   * @param pageContainerTestId e.g. 'cards-page'
   */
  protected async navigateViaSidebar(
    navTestId: string,
    pageContainerTestId: string
  ): Promise<void> {
    await this.page.getByTestId(navTestId).click();
    await this.page.getByTestId(pageContainerTestId).waitFor({ state: 'visible' });
  }
}
