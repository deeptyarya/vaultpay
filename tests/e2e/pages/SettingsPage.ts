import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Settings Page — profile info, security toggles, and danger zone.
 * data-testid root: settings-page
 * Reference: .claude/references/ui-selectors.md § Settings Page
 *
 * Toggle testids use camelCase suffixes: toggle-twoFactor, toggle-biometric, etc.
 */
export class SettingsPage extends BasePage {
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
  readonly toastMessage: Locator;
  readonly modalOverlay: Locator;
  readonly modal: Locator;
  readonly modalConfirm: Locator;
  readonly modalCancel: Locator;

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
    this.toastMessage        = page.getByTestId('toast-message');
    this.modalOverlay        = page.getByTestId('modal-overlay');
    this.modal               = page.getByTestId('modal');
    this.modalConfirm        = page.getByTestId('modal-confirm');
    this.modalCancel         = page.getByTestId('modal-cancel');
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
