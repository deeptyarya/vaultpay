/**
 * VaultPay demo user credentials.
 * There is one shared account; all E2E tests authenticate as this user.
 * Source: MOCK_USERS in App.jsx
 */
export const DEMO_USER = {
  email: 'demo@vaultpay.com',
  password: 'Demo@1234',
  firstName: 'Alex',
  fullName: 'Alex Morgan',
  balance: '$24,850.75',
} as const;
