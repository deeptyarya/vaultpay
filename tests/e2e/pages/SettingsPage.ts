import { type Page, type Locator } from '@playwright/test';
import { PageWithModals } from './PageWithModals';

/**
 * Settings Page — profile info, security toggles, and danger zone.
 * data-testid root: settings-page
 * Selectors defined from: src/App.jsx — Settings component
 *
 * Toggle testids use camelCase suffixes: toggle-twoFactor, toggle-biometric, etc.
 */
export class SettingsPage extends PageWithModals {
  readonly path = '';

  readonly settingsPage: Locator;
  readonly settingsName: Locator;
  readonly settingsEmail: Locator;
  readonly settingsPhone: Locator;
  readonly saveProfile: Locator;
  readonly toggleTwoFactor: Locator;
  readonly toggleBiometric: Locator;
  readonly toggleNotifications: Locator;
  readonly toggleEmailAlerts: Locator;
  readonly toggleSmsAlerts: Locator;
  readonly changePassword: Locator;
  readonly deleteAccount: Locator;

  constructor(page: Page) {
    super(page);
    this.settingsPage        = page.getByTestId('settings-page');
    this.settingsName        = page.getByTestId('settings-name');
    this.settingsEmail       = page.getByTestId('settings-email');
    this.settingsPhone       = page.getByTestId('settings-phone');
    this.saveProfile         = page.getByTestId('save-profile');
    this.toggleTwoFactor     = page.getByTestId('toggle-twoFactor');
    this.toggleBiometric     = page.getByTestId('toggle-biometric');
    this.toggleNotifications = page.getByTestId('toggle-notifications');
    this.toggleEmailAlerts   = page.getByTestId('toggle-emailAlerts');
    this.toggleSmsAlerts     = page.getByTestId('toggle-smsAlerts');
    this.changePassword      = page.getByTestId('change-password');
    this.deleteAccount       = page.getByTestId('delete-account');
  }

  get requiredElements(): Locator[] {
    return [this.settingsPage];
  }

  override navigate(): Promise<void> {
    throw new Error('SettingsPage has no direct URL route — use navigateViaSidebar() after login');
  }

  async navigateViaSidebar(): Promise<void> {
    await super.navigateViaSidebar('nav-settings', 'settings-page');
  }
}
