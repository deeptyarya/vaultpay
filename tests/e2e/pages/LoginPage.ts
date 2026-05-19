import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page — Sign In form at the app root.
 * data-testid root: signin-page
 * Reference: .claude/references/ui-selectors.md § Auth Pages / Sign In
 */
export class LoginPage extends BasePage {
  readonly path = '/';

  readonly signinPage: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);
    this.signinPage    = page.getByTestId('signin-page');
    this.emailInput    = page.getByTestId('signin-email');
    this.passwordInput = page.getByTestId('signin-password');
    this.submitButton  = page.getByTestId('signin-submit');
    this.formError     = page.getByTestId('form-error');
    this.emailError    = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
  }

  get requiredElements(): Locator[] {
    return [this.signinPage, this.emailInput, this.passwordInput, this.submitButton];
  }

  /**
   * Fills credentials and clicks submit. Does NOT wait for navigation.
   * Auth-TC-002 asserts the loading state between this call and waitFor(dashboard-page),
   * so callers are responsible for awaiting the outcome element.
   */
  async fillAndSubmit(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async waitForDashboard(): Promise<void> {
    await this.page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
  }
}
