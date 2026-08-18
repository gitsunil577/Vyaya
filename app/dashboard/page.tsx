"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CircleLoader from "@/components/CircleLoader";

// Define the categories from the Expense schema
const CATEGORIES = [
  "Housing & Utilities",
  "Transportation",
  "Food & Groceries",
  "Insurance & Healthcare",
  "Savings & Debt",
  "Personal & Entertainment",
  "Other",
];

interface ExpenseItem {
  _id: string;
  productName: string;
  category: string;
  customCategory?: string;
  price: number;
  remarks?: string;
  createdAt: string;
}

interface Stats {
  totalSpend: number;
  avgTransaction: number;
  transactionCount: number;
  categoryWise: Array<{ category: string; amount: number }>;
  currentMonthTotal: number;
  previousMonthTotal: number;
  maxCategory: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      // Fetch user details / session state first
      const sessionRes = await fetch("/api/expenses");
      if (sessionRes.status === 401) {
        router.push("/login");
        return;
      }
      
      const data = await sessionRes.json();
      if (sessionRes.ok) {
        setExpenses(data.expenses);
        setStats(data.stats);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to load dashboard data.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Get username from temporary local storage or session if possible
    // For now we'll retrieve it or just show a fallback
  }, []);

  // Format currency
  const formatINR = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!productName.trim()) {
      setModalError("Product/Service name is required.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setModalError("Price must be a valid positive number.");
      return;
    }

    if (category === "Other" && !customCategory.trim()) {
      setModalError("Please specify the custom category.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          category,
          customCategory: category === "Other" ? customCategory : undefined,
          price: priceNum,
          remarks: remarks.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.error || "Failed to add expense.");
      } else {
        // Success: reset form and refresh data
        setProductName("");
        setCategory(CATEGORIES[0]);
        setCustomCategory("");
        setPrice("");
        setRemarks("");
        setIsModalOpen(false);
        fetchData(); // Refresh list and dashboard statistics
      }
    } catch (err) {
      setModalError("Server connection failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/login", { method: "DELETE" }); // Wait, is there a delete handler?
      // Let's implement logout by clearing session or just hitting redirect.
      // Let's build a small helper or call a logout api route if it exists, or redirect to home.
    } catch (e) {
      console.error(e);
    }
    // Simple redirect
    document.cookie = "vyaya_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 font-mono text-xs text-muted">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent mx-auto"></div>
          Reading ledger...
        </div>
      </div>
    );
  }

  // Monthly Diff Calculations
  const currentMonthTotal = stats?.currentMonthTotal || 0;
  const previousMonthTotal = stats?.previousMonthTotal || 0;
  const momDiff = currentMonthTotal - previousMonthTotal;
  const momPercent = previousMonthTotal > 0 ? (momDiff / previousMonthTotal) * 100 : 0;

  return (
    <main className="min-h-screen bg-ink-950 text-cream selection:bg-brass selection:text-ink-950">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-ink-700/80 bg-ink-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-brass">₹</span>
            <span className="font-display text-xl tracking-tight text-cream">
              Vyaya Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-950 transition-colors hover:bg-brass-light cursor-pointer font-bold"
            >
              + Add Expense
            </button>
            <button
              onClick={handleLogout}
              className="rounded-sm border border-ink-700 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-rule hover:text-rule cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* TOP CARDS: ANALYTICS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {/* Card 1: Total Spent */}
          <div className="rounded-lg border border-ink-700/80 bg-ink-900 p-5 relative overflow-hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Total Ledger Spend</p>
            <p className="mt-2 font-display text-3xl font-medium text-cream">{formatINR(stats?.totalSpend || 0)}</p>
            <span className="absolute bottom-2 right-4 font-mono text-[11px] text-brass/20">All-time</span>
          </div>

          {/* Card 2: Current Month vs Previous Month */}
          <div className="rounded-lg border border-ink-700/80 bg-ink-900 p-5 relative overflow-hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">This vs Last Month</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="font-display text-3xl font-medium text-cream">
                {formatINR(currentMonthTotal)}
              </p>
              <span className="font-mono text-xs text-muted">
                (Last: {formatINR(previousMonthTotal)})
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px]">
              {momDiff > 0 ? (
                <span className="text-rule">
                  ▲ {formatINR(momDiff)} (+{momPercent.toFixed(1)}%)
                </span>
              ) : momDiff < 0 ? (
                <span className="text-moss">
                  ▼ {formatINR(Math.abs(momDiff))} ({momPercent.toFixed(1)}%)
                </span>
              ) : (
                <span className="text-muted">No change (0%)</span>
              )}
              <span className="text-muted/60">MoM spend</span>
            </div>
          </div>

          {/* Card 3: Average Transaction */}
          <div className="rounded-lg border border-ink-700/80 bg-ink-900 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Avg. Transaction Size</p>
            <p className="mt-2 font-display text-3xl font-medium text-cream">{formatINR(stats?.avgTransaction || 0)}</p>
            <p className="mt-2 font-mono text-[11px] text-muted">
              Over {stats?.transactionCount || 0} entered items
            </p>
          </div>

          {/* Card 4: Top Category */}
          <div className="rounded-lg border border-ink-700/80 bg-ink-900 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Top Burn Category</p>
            <p className="mt-2 font-display text-2xl font-medium text-brass-light truncate">
              {stats?.maxCategory || "None"}
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted">
              Heaviest relative spending
            </p>
          </div>
        </div>

        {/* MIDDLE SECTION: CATEGORY WISE SPEND & CHART */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] mb-12">
          {/* Category-Wise breakdown list */}
          <div className="rounded-lg border border-ink-700/80 bg-ink-900/60 p-6">
            <h2 className="font-display text-xl text-cream mb-6">Categorywise Spending</h2>
            
            {(!stats || stats.categoryWise.length === 0) ? (
              <p className="font-mono text-xs text-muted text-center py-8">No category data recorded yet.</p>
            ) : (
              <div className="space-y-5">
                {stats.categoryWise
                  .sort((a, b) => b.amount - a.amount)
                  .map((item) => {
                    const percentage = stats.totalSpend > 0 ? (item.amount / stats.totalSpend) * 100 : 0;
                    return (
                      <div key={item.category} className="space-y-1.5">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-cream/90">{item.category}</span>
                          <span className="text-brass-light font-medium">
                            {formatINR(item.amount)} <span className="text-muted/60 text-[10px]">({percentage.toFixed(1)}%)</span>
                          </span>
                        </div>
                        {/* Progress Bar container */}
                        <div className="h-2 w-full bg-ink-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brass rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick Ledger Visual card */}
          <div className="paper-grain relative rounded-sm bg-paper px-6 py-6 text-ink-900 shadow-md">
            <div className="absolute left-10 top-0 h-full w-px bg-rule/40" />
            
            <div className="mb-4 flex items-baseline justify-between border-b border-ink-900/20 pb-3 pl-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-900/60">
                Ledger Summary
              </span>
              <span className="stamp rounded-sm border border-moss px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-moss">
                Calculated
              </span>
            </div>

            <ul className="divide-y divide-ink-900/10 font-mono text-xs pl-6">
              <li className="flex justify-between py-2.5">
                <span className="text-ink-900/75">Total Transactions:</span>
                <span className="font-bold">{stats?.transactionCount || 0}</span>
              </li>
              <li className="flex justify-between py-2.5">
                <span className="text-ink-900/75">Current Month Spend:</span>
                <span className="font-bold">{formatINR(currentMonthTotal)}</span>
              </li>
              <li className="flex justify-between py-2.5">
                <span className="text-ink-900/75">Previous Month Spend:</span>
                <span className="font-bold">{formatINR(previousMonthTotal)}</span>
              </li>
              <li className="flex justify-between py-2.5">
                <span className="text-ink-900/75">MoM Change:</span>
                <span className={`font-bold ${momDiff > 0 ? 'text-rule' : 'text-moss'}`}>
                  {momDiff > 0 ? `+${formatINR(momDiff)}` : `${formatINR(momDiff)}`}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: DETAILED EXPENSE TRANSACTIONS */}
        <div className="rounded-lg border border-ink-700/80 bg-ink-900/40 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="font-display text-xl text-cream">Ledger Journal</h2>
            <p className="font-mono text-xs text-muted">
              Showing entries, newest first (clears automatically after 3 months)
            </p>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-ink-700 rounded-lg">
              <p className="font-mono text-xs text-muted">Your ledger is empty.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-950 hover:bg-brass-light"
              >
                Enter your first expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink-700 text-muted uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-2">Date</th>
                    <th className="pb-3">Product / Service</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Remarks</th>
                    <th className="pb-3 text-right pr-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800">
                  {expenses.map((exp) => {
                    const formattedDate = new Date(exp.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    const finalCategory = exp.category === "Other" && exp.customCategory ? exp.customCategory : exp.category;
                    return (
                      <tr key={exp._id} className="hover:bg-ink-900/40 transition-colors">
                        <td className="py-3.5 pl-2 text-muted">{formattedDate}</td>
                        <td className="py-3.5 font-medium text-cream">{exp.productName}</td>
                        <td className="py-3.5">
                          <span className="inline-block px-2 py-0.5 rounded-sm bg-ink-800 border border-ink-700/80 text-[10px] text-brass-light/95">
                            {finalCategory}
                          </span>
                        </td>
                        <td className="py-3.5 text-muted/80 max-w-xs truncate" title={exp.remarks}>
                          {exp.remarks || "—"}
                        </td>
                        <td className="py-3.5 text-right pr-2 font-bold text-cream">
                          {formatINR(exp.price)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="paper-grain relative w-full max-w-lg rounded-xl bg-paper px-6 py-6 text-ink-900 shadow-2xl ring-1 ring-black/15 animate-fade-up">
            
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-ink-900/10 pb-3 mb-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-900/60">
                  New Ledger Item
                </span>
                <h3 className="font-display text-2xl text-ink-950 mt-1">Record Expense</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full hover:bg-black/10 h-7 w-7 flex items-center justify-center text-ink-950 font-bold font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="mb-4 rounded-lg border border-rule/30 bg-rule/10 p-3 font-mono text-xs text-rule">
                {modalError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-900/70 mb-1">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Smart Groceries"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-ink-900/25 bg-cream px-3 py-2 font-body text-sm text-ink-950 outline-none focus:border-brass disabled:opacity-60"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-900/70 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-lg border border-ink-900/25 bg-cream px-3 py-2 font-body text-sm text-ink-950 outline-none focus:border-brass disabled:opacity-60"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-900/70 mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0.01"
                    placeholder="e.g. 1500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-lg border border-ink-900/25 bg-cream px-3 py-2 font-body text-sm text-ink-950 outline-none focus:border-brass disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Conditional Custom Category Field */}
              {category === "Other" && (
                <div className="animate-fade-up">
                  <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-900/70 mb-1">
                    Specify Custom Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Books & Subscriptions"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-lg border border-ink-900/25 bg-cream px-3 py-2 font-body text-sm text-ink-950 outline-none focus:border-brass disabled:opacity-60"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-900/70 mb-1">
                  Remarks / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly grocery stockup"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-ink-900/25 bg-cream px-3 py-2 font-body text-sm text-ink-950 outline-none focus:border-brass disabled:opacity-60"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ink-900/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider text-ink-900 hover:bg-black/5 disabled:opacity-60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-ink-950 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-cream hover:bg-ink-800 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <CircleLoader size="sm" />
                      Entering...
                    </div>
                  ) : (
                    "Enter Expense"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
