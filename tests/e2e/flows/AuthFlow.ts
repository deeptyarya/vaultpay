import { LoginPage } from '../pages/LoginPage';
import { DEMO_USER } from '../fixtures/test-users';

/**
 * AuthFlow — orchestrates the sign-in sequence for the demo user.
 * VaultPay has a single demo account; loginAsDemo() is the only method needed.
 */
export class AuthFlow {
  constructor(private loginPage: LoginPage) {}

  /**
   * Navigates to the login page, fills demo credentials, submits, and waits
   * for the dashboard container — absorbing the 1,200ms simulated async delay.
   */
  async loginAsDemo(): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.fillAndSubmit(DEMO_USER.email, DEMO_USER.password);
    await this.loginPage.waitForDashboard();
  }
}
