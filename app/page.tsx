import Link from "next/link";

const entries = [
  {
    no: "01",
    title: "Register in one line",
    body:
      "Your username is drawn straight from the first word of your name — nothing to invent, nothing to forget. Set a password with at least 4 characters, mixing an uppercase letter, a lowercase letter, and a number.",
  },
  {
    no: "02",
    title: "Log in",
    body:
      "Come back to the same ledger every time. One username, one password, your spending exactly where you left it.",
  },
  {
    no: "03",
    title: "Add an expense",
    body:
      "Product, category, price, remarks. Choose from Housing & Utilities, Transportation, Food & Groceries, Insurance & Healthcare, Savings & Debt, or Personal & Entertainment — or pick Other and name it yourself.",
  },
  {
    no: "04",
    title: "Read the dashboard",
    body:
      "See spending broken down by category, and this month set plainly against last month. Entries older than three months clear themselves, so the ledger stays quick.",
  },
  {
    no: "05",
    title: "Get the monthly post",
    body:
      "On the first of each month, a mail arrives with the total and an AI reading of your last few months — where it's unbalanced, and what a steadier split could look like.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-950 text-cream selection:bg-brass selection:text-ink-950">
      {/* NAV */}
      <header className="sticky top-0 z-20 border-b border-ink-700/80 bg-ink-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-brass">₹</span>
            <span className="font-display text-xl tracking-tight text-cream">
              Vyaya
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-sm border border-ink-700 px-4 py-2 font-mono text-xs uppercase tracking-widest text-cream/90 transition-colors hover:border-brass hover:text-brass"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-950 transition-colors hover:bg-brass-light"
            >
              Open an account
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO — a ledger sheet */}
      <section className="relative overflow-hidden border-b border-ink-700/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-sm border border-brass/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
              Entry no. 001 · new account
            </span>
            <h1 className="font-display text-5xl leading-[1.05] text-cream md:text-6xl">
              Every rupee,
              <br />
              <span className="italic text-brass-light">entered</span> and
              understood.
            </h1>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-muted">
              Vyaya is a personal expense ledger. Add what you spend in
              seconds, watch it sort itself into categories, and let a
              monthly letter tell you — plainly — where your money actually
              went.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="rounded-sm bg-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink-950 transition-colors hover:bg-brass-light"
              >
                Start your ledger
              </Link>
              <Link
                href="/login"
                className="font-mono text-xs uppercase tracking-widest text-cream/80 underline decoration-ink-700 decoration-2 underline-offset-8 transition-colors hover:text-brass"
              >
                I already have one →
              </Link>
            </div>
          </div>

          {/* ledger sheet visual */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="paper-grain relative rounded-sm bg-paper px-7 pb-7 pt-6 text-ink-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
              <div className="absolute left-11 top-0 h-full w-px bg-rule/70" />
              <div className="mb-4 flex items-baseline justify-between border-b border-ink-900/20 pb-3 pl-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-900/60">
                  August — ledger
                </span>
                <span className="stamp rounded-sm border border-moss px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-moss">
                  Balanced
                </span>
              </div>
              <ul className="bg-ledger-lines">
                {[
                  ["Groceries", "1,240"],
                  ["Metro pass", "450"],
                  ["Electricity bill", "890"],
                  ["Weekend movie", "600"],
                  ["Health insurance", "1,800"],
                ].map(([label, amt]) => (
                  <li
                    key={label}
                    className="flex h-11 items-center justify-between pl-6 pr-1"
                  >
                    <span className="font-body text-sm text-ink-900/80">
                      {label}
                    </span>
                    <span className="font-mono text-sm text-ink-900">
                      ₹{amt}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-ink-900/20 pl-6 pt-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-900/60">
                  Running total
                </span>
                <span className="font-mono text-base font-medium text-rule">
                  ₹4,980
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — five ledger entries */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mb-14 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-3xl text-cream md:text-4xl">
            How the ledger fills in
          </h2>
          <p className="max-w-sm font-body text-sm leading-relaxed text-muted">
            Five entries, in order — from opening an account to the letter
            that lands in your inbox each month.
          </p>
        </div>

        <div className="divide-y divide-ink-700/80 border-y border-ink-700/80">
          {entries.map((e) => (
            <div
              key={e.no}
              className="grid gap-3 py-8 md:grid-cols-[80px_260px_1fr] md:gap-8"
            >
              <span className="font-mono text-sm text-brass/80">{e.no}</span>
              <h3 className="font-display text-xl text-cream md:text-2xl">
                {e.title}
              </h3>
              <p className="max-w-xl font-body text-sm leading-relaxed text-muted">
                {e.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="border-y border-ink-700/80 bg-ink-900/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
              Dashboard
            </span>
            <h2 className="font-display text-3xl text-cream md:text-4xl">
              This month, set against last month.
            </h2>
            <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-muted">
              Category totals, a month-over-month read, and nothing older
              than three months slowing it down — the database prunes itself
              automatically, so the numbers stay fast even a year in.
            </p>
          </div>
          <div className="rounded-sm border border-ink-700 bg-ink-950 p-6">
            <div className="mb-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span>Category</span>
              <span>Jul → Aug</span>
            </div>
            {[
              ["Food & Groceries", 62, 74, "up"],
              ["Transportation", 40, 33, "down"],
              ["Housing & Utilities", 88, 88, "same"],
              ["Personal & Entertainment", 25, 41, "up"],
              ["Savings & Debt", 70, 55, "down"],
            ].map(([cat, jul, aug, dir]) => (
              <div key={cat as string} className="mb-4 last:mb-0">
                <div className="mb-1.5 flex items-center justify-between font-body text-xs text-cream/85">
                  <span>{cat}</span>
                  <span
                    className={`font-mono ${
                      dir === "up"
                        ? "text-rule"
                        : dir === "down"
                        ? "text-moss-light"
                        : "text-muted"
                    }`}
                  >
                    {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"} {aug}%
                  </span>
                </div>
                <div className="flex h-1.5 gap-1 overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full bg-ink-700"
                    style={{ width: `${jul}%` }}
                  />
                </div>
                <div className="mt-1 flex h-1.5 gap-1 overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full bg-brass"
                    style={{ width: `${aug}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MONTHLY MAIL */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="rounded-sm border border-ink-700 bg-ink-900/60 p-6 font-mono text-xs leading-relaxed text-muted">
            <p className="mb-3 text-cream/80">
              Subject: Your August ledger, closed out
            </p>
            <p className="mb-3">
              Total spend: ₹34,210 — 8% below July.
            </p>
            <p className="mb-3">
              Personal & Entertainment climbed three months running. Shifting
              even ₹1,500 of it toward Savings & Debt would bring your split
              back in line with your usual pattern.
            </p>
            <p className="text-brass">— Vyaya, on the 1st of every month</p>
          </div>
          <div>
            <span className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
              Monthly letter
            </span>
            <h2 className="font-display text-3xl text-cream md:text-4xl">
              An AI reading of your own habits, delivered — not requested.
            </h2>
            <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-muted">
              Every month, Vyaya mails you the total and looks back across
              your recent entries to suggest where a steadier balance is
              possible. No dashboard to open — it's already in your inbox.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="border-t border-ink-700/80">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-3xl text-cream md:text-4xl">
            Open your first entry today.
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-sm bg-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink-950 transition-colors hover:bg-brass-light"
            >
              Open an account
            </Link>
            <Link
              href="/login"
              className="rounded-sm border border-ink-700 px-6 py-3 font-mono text-xs uppercase tracking-widest text-cream/90 transition-colors hover:border-brass hover:text-brass"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-700/80 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted md:flex-row md:items-center md:justify-between">
          <span>Vyaya — a personal expense ledger</span>
          <span>Entries older than 3 months are cleared automatically</span>
        </div>
      </footer>
    </main>
  );
}
