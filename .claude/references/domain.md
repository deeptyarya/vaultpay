# VaultPay Domain Knowledge

**App URL:** `http://localhost:3000` — **Credentials:** `demo@vaultpay.com` / `Demo@1234`

VaultPay is a frontend-only SPA. No backend, no API calls. All data is mocked in `src/App.jsx`. State resets on page refresh.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.2 |
| Build tool | Vite 5.4 (port 3000 via vite.config.js) |
| Routing | None — single `App.jsx`, state via `useState` |
| Styling | Vanilla CSS, no Tailwind |
| Testing | Playwright (TypeScript) |
| HTTP client | None — zero network requests |

## Component Tree

```
App (root)
├── SignIn             ← page: "signin"
├── SignUp             ← page: "signup"
└── AppLayout          ← page: "app"
    ├── Sidebar (nav)
    └── ActivePage: Dashboard | Transactions | SendMoney | Cards | Budget | Settings

Shared: Toast (3s auto-dismiss) | Modal (overlay + cancel/confirm)
```

## Page State Machine

```
"signin" → (valid login) → "app"
"signin" ↔ "signup"
"app" → (logout) → "signin"
```

## Mock Data

### Users (MOCK_USERS)
| Email | Password | Name | Balance |
|---|---|---|---|
| demo@vaultpay.com | Demo@1234 | Alex Morgan | $24,850.75 |

New sign-up users get $1,000.00 balance and a random `****NNNN` account number.

### Transactions (MOCK_TRANSACTIONS) — 12 records
| ID | Description | Amount | Category | Status | Type |
|---|---|---|---|---|---|
| TXN-001 | Netflix Subscription | -$15.99 | Entertainment | completed | debit |
| TXN-002 | Salary Deposit - Acme Corp | +$5,200.00 | Income | completed | credit |
| TXN-003 | Whole Foods Market | -$87.43 | Groceries | completed | debit |
| TXN-004 | Uber Ride | -$23.50 | Transport | completed | debit |
| TXN-005 | Transfer to Sarah K. | -$150.00 | Transfer | completed | debit |
| TXN-006 | Amazon Purchase | -$64.99 | Shopping | **pending** | debit |
| TXN-007 | Freelance Payment - DesignCo | +$1,200.00 | Income | completed | credit |
| TXN-008 | Electric Bill | -$142.30 | Utilities | completed | debit |
| TXN-009 | Starbucks | -$6.75 | Food & Drink | completed | debit |
| TXN-010 | Gym Membership | -$49.99 | Health | completed | debit |
| TXN-011 | Refund - Return Item | +$32.50 | Refund | completed | credit |
| TXN-012 | Spotify Premium | -$9.99 | Entertainment | completed | debit |

### Cards (MOCK_CARDS)
| ID | Type | Last4 | Expiry | Limit |
|---|---|---|---|---|
| CARD-001 | Visa | 4821 | 09/28 | $10,000 |
| CARD-002 | Mastercard | 7733 | 03/27 | $5,000 |

### Budget (BUDGET_DATA)
| Category | Budget | Spent |
|---|---|---|
| Groceries | $400 | $287.43 |
| Entertainment | $100 | $25.98 |
| Transport | $200 | $123.50 |
| Shopping | $300 | $264.99 (88.3%) |
| Utilities | $250 | $142.30 |
| Food & Drink | $150 | $86.75 |

Total: $1,400 budget / $930.95 spent / $469.05 remaining

### Contacts (CONTACTS — Send Money)
| ID | Name | Email |
|---|---|---|
| C-001 | Sarah K. | sarah@email.com |
| C-002 | James W. | james@email.com |
| C-003 | Maria L. | maria@email.com |
| C-004 | David R. | david@email.com |

## Dashboard Stats (static, demo user)
- Total Balance: $24,850.75 (+12.5%)
- Income: $6,432 (+8.2%)
- Expenses: $2,180 (-3.1%)
- Savings: $4,252 (+22.4%)
- Recent Transactions: first 5 records (TXN-001 to TXN-005)
