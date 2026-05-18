import { useState, useEffect, useCallback } from "react";

// ─── Mock Data ───────────────────────────────────────────────
const MOCK_USERS = [
  { email: "demo@vaultpay.com", password: "Demo@1234", name: "Alex Morgan", balance: 24850.75, accountNo: "****4821" },
];

const MOCK_TRANSACTIONS = [
  { id: "TXN-001", date: "2026-05-14", description: "Netflix Subscription", amount: -15.99, category: "Entertainment", status: "completed", type: "debit" },
  { id: "TXN-002", date: "2026-05-13", description: "Salary Deposit - Acme Corp", amount: 5200.00, category: "Income", status: "completed", type: "credit" },
  { id: "TXN-003", date: "2026-05-12", description: "Whole Foods Market", amount: -87.43, category: "Groceries", status: "completed", type: "debit" },
  { id: "TXN-004", date: "2026-05-12", description: "Uber Ride", amount: -23.50, category: "Transport", status: "completed", type: "debit" },
  { id: "TXN-005", date: "2026-05-11", description: "Transfer to Sarah K.", amount: -150.00, category: "Transfer", status: "completed", type: "debit" },
  { id: "TXN-006", date: "2026-05-10", description: "Amazon Purchase", amount: -64.99, category: "Shopping", status: "pending", type: "debit" },
  { id: "TXN-007", date: "2026-05-09", description: "Freelance Payment - DesignCo", amount: 1200.00, category: "Income", status: "completed", type: "credit" },
  { id: "TXN-008", date: "2026-05-08", description: "Electric Bill", amount: -142.30, category: "Utilities", status: "completed", type: "debit" },
  { id: "TXN-009", date: "2026-05-07", description: "Starbucks", amount: -6.75, category: "Food & Drink", status: "completed", type: "debit" },
  { id: "TXN-010", date: "2026-05-06", description: "Gym Membership", amount: -49.99, category: "Health", status: "completed", type: "debit" },
  { id: "TXN-011", date: "2026-05-05", description: "Refund - Return Item", amount: 32.50, category: "Refund", status: "completed", type: "credit" },
  { id: "TXN-012", date: "2026-05-04", description: "Spotify Premium", amount: -9.99, category: "Entertainment", status: "completed", type: "debit" },
];

const MOCK_CARDS = [
  { id: "CARD-001", type: "Visa", last4: "4821", expiry: "09/28", name: "Alex Morgan", color: "#0f172a", status: "active", limit: 10000 },
  { id: "CARD-002", type: "Mastercard", last4: "7733", expiry: "03/27", name: "Alex Morgan", color: "#7c3aed", status: "active", limit: 5000 },
];

const BUDGET_DATA = [
  { category: "Groceries", budget: 400, spent: 287.43, color: "#10b981" },
  { category: "Entertainment", budget: 100, spent: 25.98, color: "#8b5cf6" },
  { category: "Transport", budget: 200, spent: 123.50, color: "#f59e0b" },
  { category: "Shopping", budget: 300, spent: 264.99, color: "#ef4444" },
  { category: "Utilities", budget: 250, spent: 142.30, color: "#3b82f6" },
  { category: "Food & Drink", budget: 150, spent: 86.75, color: "#ec4899" },
];

const CONTACTS = [
  { id: "C-001", name: "Sarah K.", email: "sarah@email.com", avatar: "SK" },
  { id: "C-002", name: "James W.", email: "james@email.com", avatar: "JW" },
  { id: "C-003", name: "Maria L.", email: "maria@email.com", avatar: "ML" },
  { id: "C-004", name: "David R.", email: "david@email.com", avatar: "DR" },
];

// ─── Icons (inline SVG) ──────────────────────────────────────
const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#3b82f6" />
      <path d="M8 14L12 10L16 14L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 18L12 14L16 18L20 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  ),
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Transactions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Cards: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Budget: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  ArrowDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Freeze: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>,
};

// ─── Shared Components ───────────────────────────────────────

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`toast ${type}`} data-testid="toast-message">
      {type === "success" ? <Icons.Check /> : <Icons.X />}
      <span>{message}</span>
    </div>
  );
}

function Modal({ title, text, onConfirm, onCancel, confirmLabel = "Confirm", danger = false }) {
  return (
    <div className="modal-overlay" data-testid="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} data-testid="modal">
        <div className="modal-title">{title}</div>
        <div className="modal-text">{text}</div>
        <div className="modal-actions">
          <button className="btn btn-secondary btn-small" onClick={onCancel} data-testid="modal-cancel">Cancel</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"} btn-small`} onClick={onConfirm} data-testid="modal-confirm">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sign In ─────────────────────────────────────────────────
function SignIn({ onSignIn, onGoToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email format";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
      if (user) { onSignIn(user); }
      else { setErrors({ form: "Invalid credentials. Try demo@vaultpay.com / Demo@1234" }); setLoading(false); }
    }, 1200);
  };

  return (
    <div className="auth-page" data-testid="signin-page">
      <div className="auth-container">
        <div className="auth-logo"><Icons.Logo /><span>VaultPay</span></div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Sign in to manage your finances</div>
        <form onSubmit={handleSubmit} data-testid="signin-form" noValidate>
          {errors.form && <div className="form-error" style={{ marginBottom: 16 }} data-testid="form-error">{errors.form}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="signin-email">Email</label>
            <input id="signin-email" className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="signin-email" autoComplete="email" />
            {errors.email && <div className="form-error" data-testid="email-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signin-password">Password</label>
            <div className="form-input-wrap">
              <input id="signin-password" className={`form-input ${errors.password ? "error" : ""}`} type={showPw ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="signin-password" autoComplete="current-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)} data-testid="toggle-password" aria-label="Toggle password visibility">{showPw ? <Icons.EyeOff /> : <Icons.Eye />}</button>
            </div>
            {errors.password && <div className="form-error" data-testid="password-error">{errors.password}</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <label className="form-checkbox"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} data-testid="remember-me" />Remember me</label>
            <a className="auth-link" data-testid="forgot-password" style={{ fontSize: 13 }}>Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} data-testid="signin-submit">{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <div className="auth-footer">Don't have an account? <a onClick={onGoToSignUp} data-testid="goto-signup">Sign up</a></div>
      </div>
    </div>
  );
}

// ─── Sign Up ─────────────────────────────────────────────────
function SignUp({ onSignUp, onGoToSignIn }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const passwordStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "At least 8 characters required";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!agree) e.agree = "You must agree to terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSignUp({ email: form.email, password: form.password, name: form.name, balance: 1000.00, accountNo: "****" + Math.floor(1000 + Math.random() * 9000) });
    }, 1200);
  };

  return (
    <div className="auth-page" data-testid="signup-page">
      <div className="auth-container">
        <div className="auth-logo"><Icons.Logo /><span>VaultPay</span></div>
        <div className="auth-title">Create account</div>
        <div className="auth-subtitle">Start managing your finances today</div>
        <form onSubmit={handleSubmit} data-testid="signup-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <input id="signup-name" className={`form-input ${errors.name ? "error" : ""}`} placeholder="John Doe" value={form.name} onChange={set("name")} data-testid="signup-name" />
            {errors.name && <div className="form-error" data-testid="name-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input id="signup-email" className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} data-testid="signup-email" />
            {errors.email && <div className="form-error" data-testid="email-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div className="form-input-wrap">
              <input id="signup-password" className={`form-input ${errors.password ? "error" : ""}`} type={showPw ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={set("password")} data-testid="signup-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)} data-testid="toggle-password-signup">{showPw ? <Icons.EyeOff /> : <Icons.Eye />}</button>
            </div>
            {form.password && (
              <div style={{ display: "flex", gap: 4, marginTop: 8 }} data-testid="password-strength">
                {[1, 2, 3, 4].map((i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColors[strength] : "#1e293b" }} />))}
                <span style={{ fontSize: 11, color: strengthColors[strength], marginLeft: 8, fontWeight: 500 }}>{strengthLabels[strength]}</span>
              </div>
            )}
            {errors.password && <div className="form-error" data-testid="password-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
            <input id="signup-confirm" className="form-input" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={set("confirmPassword")} data-testid="signup-confirm-password" />
            {errors.confirmPassword && <div className="form-error" data-testid="confirm-error">{errors.confirmPassword}</div>}
          </div>
          <div className="form-group">
            <label className="form-checkbox"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} data-testid="agree-terms" />I agree to the Terms of Service & Privacy Policy</label>
            {errors.agree && <div className="form-error" data-testid="terms-error">{errors.agree}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} data-testid="signup-submit">{loading ? "Creating account..." : "Create Account"}</button>
        </form>
        <div className="auth-footer">Already have an account? <a onClick={onGoToSignIn} data-testid="goto-signin">Sign in</a></div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────
function DashboardPage({ user, navigateTo }) {
  const recentTxns = MOCK_TRANSACTIONS.slice(0, 5);
  return (
    <div data-testid="dashboard-page">
      <div className="stats-grid">
        <div className="stat-card" data-testid="stat-balance">
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          <div className="stat-change up"><Icons.ArrowUp /> 12.5% this month</div>
        </div>
        <div className="stat-card" data-testid="stat-income">
          <div className="stat-label">Income</div>
          <div className="stat-value">$6,432</div>
          <div className="stat-change up"><Icons.ArrowUp /> 8.2%</div>
        </div>
        <div className="stat-card" data-testid="stat-expenses">
          <div className="stat-label">Expenses</div>
          <div className="stat-value">$2,180</div>
          <div className="stat-change down"><Icons.ArrowDown /> 3.1%</div>
        </div>
        <div className="stat-card" data-testid="stat-savings">
          <div className="stat-label">Savings</div>
          <div className="stat-value">$4,252</div>
          <div className="stat-change up"><Icons.ArrowUp /> 22.4%</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Transactions</span>
            <button className="btn btn-secondary btn-small" onClick={() => navigateTo("transactions")} data-testid="view-all-txn">View All</button>
          </div>
          <table className="txn-table" data-testid="recent-transactions-table">
            <thead>
              <tr><th>Description</th><th>Date</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentTxns.map((t) => (
                <tr key={t.id} data-testid={`txn-row-${t.id}`}>
                  <td>{t.description}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{t.date}</td>
                  <td className={`txn-amount ${t.type}`}>{t.type === "credit" ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}</td>
                  <td><span className={`txn-status ${t.status}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Quick Actions</div>
            <div className="quick-actions" style={{ flexDirection: "column" }}>
              <button className="quick-action" onClick={() => navigateTo("send")} data-testid="quick-send">
                <div className="quick-action-icon"><Icons.Send /></div>Send Money
              </button>
              <button className="quick-action" onClick={() => navigateTo("cards")} data-testid="quick-cards">
                <div className="quick-action-icon"><Icons.Cards /></div>My Cards
              </button>
              <button className="quick-action" onClick={() => navigateTo("budget")} data-testid="quick-budget">
                <div className="quick-action-icon"><Icons.Budget /></div>Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Transactions Page ───────────────────────────────────────
function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(MOCK_TRANSACTIONS.map((t) => t.category))];

  const filtered = MOCK_TRANSACTIONS.filter((t) => {
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div data-testid="transactions-page">
      <div className="txn-filters">
        <div className="search-box" style={{ width: 220 }}>
          <Icons.Search />
          <input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="txn-search" />
        </div>
        <select className="txn-filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} data-testid="filter-type">
          <option value="all">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <select className="txn-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} data-testid="filter-status">
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <select className="txn-filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} data-testid="filter-category">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state" data-testid="no-results">No transactions found</div>
        ) : (
          <table className="txn-table" data-testid="transactions-table">
            <thead>
              <tr><th>ID</th><th>Description</th><th>Category</th><th>Date</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} data-testid={`txn-row-${t.id}`}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b" }}>{t.id}</td>
                  <td>{t.description}</td>
                  <td><span className="txn-category">{t.category}</span></td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{t.date}</td>
                  <td className={`txn-amount ${t.type}`}>{t.type === "credit" ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}</td>
                  <td><span className={`txn-status ${t.status}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Send Money Page ─────────────────────────────────────────
function SendMoneyPage({ user, showToast }) {
  const [selected, setSelected] = useState(null);
  const [customEmail, setCustomEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!selected && !customEmail) e.recipient = "Select a contact or enter email";
    if (customEmail && !/\S+@\S+\.\S+/.test(customEmail)) e.recipient = "Invalid email";
    if (!amount || parseFloat(amount) <= 0) e.amount = "Enter a valid amount";
    else if (parseFloat(amount) > user.balance) e.amount = "Insufficient balance";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const confirmSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setShowConfirm(false);
      showToast("Transfer sent successfully!", "success");
      setAmount(""); setNote(""); setSelected(null); setCustomEmail("");
    }, 1500);
  };

  const recipient = selected ? CONTACTS.find((c) => c.id === selected)?.name : customEmail;

  return (
    <div data-testid="send-money-page">
      <div className="send-container">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>Send to</div>
          <div className="contact-list">
            {CONTACTS.map((c) => (
              <button key={c.id} className={`contact-chip ${selected === c.id ? "selected" : ""}`} onClick={() => { setSelected(c.id); setCustomEmail(""); }} data-testid={`contact-${c.id}`}>
                <div className="contact-avatar">{c.avatar}</div>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", margin: "12px 0 8px" }}>Or enter email manually</div>
          <input className={`form-input ${errors.recipient ? "error" : ""}`} placeholder="recipient@email.com" value={customEmail} onChange={(e) => { setCustomEmail(e.target.value); setSelected(null); }} data-testid="recipient-email" />
          {errors.recipient && <div className="form-error" data-testid="recipient-error">{errors.recipient}</div>}
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>Amount</div>
          <div className="amount-input-wrap">
            <span className="currency">$</span>
            <input className="amount-input" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} data-testid="send-amount" min="0" step="0.01" />
          </div>
          {errors.amount && <div className="form-error" data-testid="amount-error">{errors.amount}</div>}
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Available balance: <span style={{ color: "#f1f5f9", fontFamily: "var(--font-mono)" }}>${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Note (optional)</div>
          <textarea className="form-input" rows="3" placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} data-testid="send-note" style={{ resize: "vertical" }} />
        </div>

        <button className="btn btn-primary" onClick={handleSend} data-testid="send-submit">Review & Send</button>
      </div>

      {showConfirm && (
        <Modal
          title="Confirm Transfer"
          text={`Send $${parseFloat(amount).toFixed(2)} to ${recipient}?${note ? ` Note: "${note}"` : ""}`}
          confirmLabel={sending ? "Sending..." : "Send Money"}
          onConfirm={confirmSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

// ─── Cards Page ──────────────────────────────────────────────
function CardsPage({ showToast }) {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [showLockModal, setShowLockModal] = useState(null);

  const toggleFreeze = (id) => {
    const card = cards.find((c) => c.id === id);
    setCards(cards.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "frozen" : "active" } : c));
    showToast(card.status === "active" ? "Card frozen" : "Card unfrozen", "success");
  };

  return (
    <div data-testid="cards-page">
      <div className="cards-grid">
        {cards.map((c) => (
          <div key={c.id} data-testid={`card-${c.id}`}>
            <div className="credit-card" style={{ background: c.status === "frozen" ? "#374151" : c.color, opacity: c.status === "frozen" ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="card-chip" />
                <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{c.type}</span>
              </div>
              <div className="card-number">•••• •••• •••• {c.last4}</div>
              <div className="card-bottom">
                <div><div className="card-holder">Card Holder</div><div className="card-holder-name">{c.name}</div></div>
                <div style={{ textAlign: "right" }}><div className="card-expiry-label">Expires</div><div className="card-expiry-value">{c.expiry}</div></div>
              </div>
              {c.status === "frozen" && <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(239,68,68,0.8)", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>FROZEN</div>}
            </div>
            <div className="card-actions" style={{ marginTop: 12 }}>
              <button className="card-action-btn" onClick={() => toggleFreeze(c.id)} data-testid={`freeze-${c.id}`}>
                <Icons.Freeze />{c.status === "frozen" ? "Unfreeze" : "Freeze"}
              </button>
              <button className="card-action-btn" onClick={() => setShowLockModal(c.id)} data-testid={`lock-${c.id}`}>
                <Icons.Lock />Lock Card
              </button>
              <button className="card-action-btn" data-testid={`details-${c.id}`}>
                <Icons.Eye />Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Card Limits</span></div>
        <table className="txn-table" data-testid="card-limits-table">
          <thead><tr><th>Card</th><th>Daily Limit</th><th>Used Today</th><th>Remaining</th></tr></thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id}>
                <td>{c.type} ••{c.last4}</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>${c.limit.toLocaleString()}</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>$347.00</td>
                <td style={{ fontFamily: "var(--font-mono)", color: "#10b981" }}>${(c.limit - 347).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showLockModal && (
        <Modal
          title="Lock Card"
          text="This will permanently lock the card. You'll need to request a replacement. Are you sure?"
          confirmLabel="Lock Card"
          danger
          onConfirm={() => { setShowLockModal(null); showToast("Card locked permanently", "error"); }}
          onCancel={() => setShowLockModal(null)}
        />
      )}
    </div>
  );
}

// ─── Budget Page ─────────────────────────────────────────────
function BudgetPage() {
  const totalBudget = BUDGET_DATA.reduce((s, b) => s + b.budget, 0);
  const totalSpent = BUDGET_DATA.reduce((s, b) => s + b.spent, 0);

  return (
    <div data-testid="budget-page">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 24 }}>
        <div className="stat-card" data-testid="total-budget">
          <div className="stat-label">Total Budget</div>
          <div className="stat-value" style={{ fontSize: 24 }}>${totalBudget.toLocaleString()}</div>
        </div>
        <div className="stat-card" data-testid="total-spent">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value" style={{ fontSize: 24 }}>${totalSpent.toFixed(2)}</div>
        </div>
        <div className="stat-card" data-testid="remaining-budget">
          <div className="stat-label">Remaining</div>
          <div className="stat-value" style={{ fontSize: 24, color: "#10b981" }}>${(totalBudget - totalSpent).toFixed(2)}</div>
        </div>
      </div>

      <div className="budget-grid">
        {BUDGET_DATA.map((b) => {
          const pct = Math.min((b.spent / b.budget) * 100, 100);
          return (
            <div className="card budget-item" key={b.category} data-testid={`budget-${b.category.replace(/\s+/g, "-").toLowerCase()}`}>
              <div className="budget-header">
                <span className="budget-category" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: b.color, display: "inline-block" }} />
                  {b.category}
                </span>
                <span className="budget-amounts">${b.spent.toFixed(2)} / ${b.budget}</span>
              </div>
              <div className="budget-bar">
                <div className="budget-fill" style={{ width: `${pct}%`, background: pct > 90 ? "#ef4444" : b.color }} />
              </div>
              <div className="budget-percent">{pct.toFixed(0)}% used</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Settings Page ───────────────────────────────────────────
function SettingsPage({ user, showToast }) {
  const [toggles, setToggles] = useState({ notifications: true, biometric: false, twoFactor: true, darkMode: true, emailAlerts: true, smsAlerts: false });
  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email, phone: "+1 (555) 123-4567" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
    showToast(`${key.replace(/([A-Z])/g, " $1")} ${!toggles[key] ? "enabled" : "disabled"}`, "success");
  };

  const handleProfileSave = () => { showToast("Profile updated", "success"); };

  return (
    <div data-testid="settings-page" style={{ maxWidth: 640 }}>
      <div className="settings-section card" style={{ marginBottom: 20, padding: 24 }}>
        <div className="settings-title">Profile</div>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} data-testid="settings-name" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} data-testid="settings-email" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} data-testid="settings-phone" />
        </div>
        <button className="btn btn-primary btn-small" style={{ width: "auto" }} onClick={handleProfileSave} data-testid="save-profile">Save Changes</button>
      </div>

      <div className="settings-section card" style={{ marginBottom: 20, padding: 24 }}>
        <div className="settings-title">Security</div>
        {[
          { key: "twoFactor", label: "Two-Factor Authentication", desc: "Add an extra layer of security" },
          { key: "biometric", label: "Biometric Login", desc: "Use fingerprint or face ID" },
        ].map((s) => (
          <div className="settings-row" key={s.key}>
            <div className="settings-info"><div className="settings-label">{s.label}</div><div className="settings-desc">{s.desc}</div></div>
            <button className={`toggle-switch ${toggles[s.key] ? "on" : ""}`} onClick={() => toggle(s.key)} data-testid={`toggle-${s.key}`} aria-label={`Toggle ${s.label}`}><div className="toggle-knob" /></button>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-secondary btn-small" style={{ width: "auto" }} data-testid="change-password">Change Password</button>
        </div>
      </div>

      <div className="settings-section card" style={{ marginBottom: 20, padding: 24 }}>
        <div className="settings-title">Notifications</div>
        {[
          { key: "notifications", label: "Push Notifications", desc: "Receive push alerts on your device" },
          { key: "emailAlerts", label: "Email Alerts", desc: "Get transaction alerts via email" },
          { key: "smsAlerts", label: "SMS Alerts", desc: "Receive text message alerts" },
        ].map((s) => (
          <div className="settings-row" key={s.key}>
            <div className="settings-info"><div className="settings-label">{s.label}</div><div className="settings-desc">{s.desc}</div></div>
            <button className={`toggle-switch ${toggles[s.key] ? "on" : ""}`} onClick={() => toggle(s.key)} data-testid={`toggle-${s.key}`} aria-label={`Toggle ${s.label}`}><div className="toggle-knob" /></button>
          </div>
        ))}
      </div>

      <div className="settings-section card" style={{ padding: 24 }}>
        <div className="settings-title" style={{ color: "#ef4444" }}>Danger Zone</div>
        <div className="settings-row">
          <div className="settings-info"><div className="settings-label">Delete Account</div><div className="settings-desc">Permanently remove your account and all data</div></div>
          <button className="btn btn-danger btn-small" style={{ width: "auto" }} onClick={() => setShowDeleteModal(true)} data-testid="delete-account">Delete</button>
        </div>
      </div>

      {showDeleteModal && (
        <Modal
          title="Delete Account"
          text="This action cannot be undone. All your data including transaction history, cards, and settings will be permanently deleted."
          confirmLabel="Delete My Account"
          danger
          onConfirm={() => { setShowDeleteModal(false); showToast("Account deletion requested", "error"); }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("signin");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const handleSignIn = (u) => { setUser(u); setPage("app"); setActivePage("dashboard"); };
  const handleSignUp = (u) => { MOCK_USERS.push(u); setUser(u); setPage("app"); setActivePage("dashboard"); };
  const handleLogout = () => { setUser(null); setPage("signin"); setActivePage("dashboard"); };

  const navigateTo = (p) => setActivePage(p);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icons.Dashboard },
    { id: "transactions", label: "Transactions", icon: Icons.Transactions },
    { id: "send", label: "Send Money", icon: Icons.Send },
    { id: "cards", label: "Cards", icon: Icons.Cards },
    { id: "budget", label: "Budget", icon: Icons.Budget },
    { id: "settings", label: "Settings", icon: Icons.Settings },
  ];

  const pageTitles = {
    dashboard: { title: `Welcome back, ${user?.name?.split(" ")[0] || ""}`, subtitle: "Here's your financial overview" },
    transactions: { title: "Transactions", subtitle: "View and filter your transaction history" },
    send: { title: "Send Money", subtitle: "Transfer funds to anyone, instantly" },
    cards: { title: "My Cards", subtitle: "Manage your debit and credit cards" },
    budget: { title: "Budget", subtitle: "Track spending across categories" },
    settings: { title: "Settings", subtitle: "Manage your account preferences" },
  };

  if (page === "signin") return <SignIn onSignIn={handleSignIn} onGoToSignUp={() => setPage("signup")} />;
  if (page === "signup") return <SignUp onSignUp={handleSignUp} onGoToSignIn={() => setPage("signin")} />;

  const pageInfo = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <>
      <div className="app-layout" data-testid="app-layout">
        <aside className="sidebar" data-testid="sidebar">
          <div className="sidebar-logo"><Icons.Logo /><span>VaultPay</span></div>
          <nav className="sidebar-nav" data-testid="sidebar-nav">
            {navItems.map((n) => (
              <button key={n.id} className={`nav-item ${activePage === n.id ? "active" : ""}`} onClick={() => navigateTo(n.id)} data-testid={`nav-${n.id}`}>
                <n.icon />{n.label}
              </button>
            ))}
            <button className="nav-item logout" onClick={handleLogout} data-testid="nav-logout"><Icons.Logout />Log Out</button>
          </nav>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <div><div className="page-title" data-testid="page-title">{pageInfo.title}</div><div className="page-subtitle">{pageInfo.subtitle}</div></div>
            <div className="header-actions">
              <div className="search-box"><Icons.Search /><input placeholder="Search..." data-testid="global-search" /></div>
              <button className="notification-btn" data-testid="notifications-btn"><Icons.Bell /><div className="notification-dot" /></button>
            </div>
          </div>

          {activePage === "dashboard" && <DashboardPage user={user} navigateTo={navigateTo} />}
          {activePage === "transactions" && <TransactionsPage />}
          {activePage === "send" && <SendMoneyPage user={user} showToast={showToast} />}
          {activePage === "cards" && <CardsPage showToast={showToast} />}
          {activePage === "budget" && <BudgetPage />}
          {activePage === "settings" && <SettingsPage user={user} showToast={showToast} />}
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
