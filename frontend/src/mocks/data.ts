// Mock data aligned with backend models and endpoints
// - Forecasts, operator summaries, transactions, user profile

export type Transaction = {
  id: string;
  type: "deposit" | "loan" | "saving" | "payment";
  amount: number; // positive for inflow, negative for outflow
  currency: string; // e.g., KSH
  description: string;
  time: string; // human readable
  status: "completed" | "pending" | "failed";
};

export const mockUser = {
  id: "user-001",
  name: "John Doe",
  email: "john.doe@example.com",
  provider: "email",
  avatar: undefined as string | undefined,
};

export const mockTransactions: Transaction[] = [
  { id: "t1", type: "deposit", amount: 5000, currency: "KSH", description: "Mobile Money Deposit", time: "2 hours ago", status: "completed" },
  { id: "t2", type: "loan", amount: -10000, currency: "KSH", description: "Personal Loan Disbursement", time: "1 day ago", status: "completed" },
  { id: "t3", type: "saving", amount: 2500, currency: "KSH", description: "Auto-Save Transfer", time: "3 days ago", status: "completed" },
  { id: "t4", type: "payment", amount: -1200, currency: "KSH", description: "Loan Repayment", time: "5 days ago", status: "completed" },
];

export const mockForecast = {
  operator: "safaricom",
  window: "4h",
  predictedNetFlow: 123.45,
};

export const mockOperatorSummary = {
  operator: "safaricom",
  window: "4h",
  summary: "[mock-summary:32]Operator safaricom predicted net flow 123.45 over 4h.",
};
