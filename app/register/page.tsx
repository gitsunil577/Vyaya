"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CircleLoader from "@/components/CircleLoader";

function usernameFromName(name: string) {
  return name.trim().split(/\s+/)[0] || "";
}

function passwordChecks(pwd: string) {
  return [
    { label: "At least 4 characters", ok: pwd.length >= 4 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(pwd) },
    { label: "One lowercase letter", ok: /[a-z]/.test(pwd) },
    { label: "One number", ok: /[0-9]/.test(pwd) },
  ];
}

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registeredUser, setRegisteredUser] = useState("");

  const username = useMemo(() => usernameFromName(name), [name]);
  const checks = useMemo(() => passwordChecks(pwd), [pwd]);
  
  const canSubmit = 
    name.trim().length > 0 && 
    email.trim().length > 0 && 
    email.includes("@") &&
    checks.every((c) => c.ok);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError("");

    if (!canSubmit) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: pwd,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
      } else {
        setRegisteredUser(data.username);
        // Redirect to dashboard after 2 seconds so they can see their username
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-16 text-cream">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-glow-brass opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />

      <div className="relative w-full max-w-md animate-fade-up">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-brass-light"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brass/40 text-[11px] text-brass-light">
            ₹
          </span>
          Vyaya
        </Link>

        <div className="paper-grain relative rounded-2xl bg-paper px-7 py-8 text-ink-900 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.8)] ring-1 ring-black/10">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-900/60">
            New entry
          </span>
          <h1 className="mt-2 font-display text-3xl text-ink-950">
            Open an account
          </h1>

          {error && (
            <div className="mt-4 rounded-lg border border-rule/30 bg-rule/10 p-3 font-mono text-xs text-rule">
              {error}
            </div>
          )}

          {registeredUser ? (
            <div className="mt-6 animate-fade-in rounded-lg border border-moss/40 bg-moss/10 p-4">
              <p className="font-body text-sm leading-relaxed text-moss">
                Account entered. Username <strong>{registeredUser}</strong> is
                registered. Opening your ledger...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-900/70"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sahu"
                  disabled={submitting}
                  className="w-full rounded-lg border border-ink-900/25 bg-cream px-3.5 py-2.5 font-body text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-900/40 focus:border-brass disabled:opacity-60"
                />
                <p
                  className={`mt-1.5 min-h-[1.1rem] font-mono text-xs transition-opacity ${
                    name.trim() ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Username will be{" "}
                  <span className="font-medium text-rule">
                    {username || "—"}
                  </span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-900/70"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                  disabled={submitting}
                  className="w-full rounded-lg border border-ink-900/25 bg-cream px-3.5 py-2.5 font-body text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-900/40 focus:border-brass disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="pwd"
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-900/70"
                >
                  Password
                </label>
                <input
                  id="pwd"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="At least 4 characters"
                  disabled={submitting}
                  className="w-full rounded-lg border border-ink-900/25 bg-cream px-3.5 py-2.5 font-body text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-900/40 focus:border-brass disabled:opacity-60"
                />
                <ul className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1.5">
                  {checks.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
                        c.ok
                          ? "text-moss"
                          : touched
                          ? "text-rule"
                          : "text-ink-900/45"
                      }`}
                    >
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[8px] ${
                          c.ok
                            ? "border-moss bg-moss/15"
                            : "border-current"
                        }`}
                      >
                        {c.ok ? "✓" : ""}
                      </span>
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                  type="submit"
                  disabled={submitting} 
                  className={`shine-wrap w-full rounded-lg bg-ink-950 px-6 py-3 font-mono text-xs uppercase tracking-widest text-cream transition-transform hover:bg-ink-800 disabled:opacity-60 disabled:hover:scale-100 ${
                  !submitting ? "hover:scale-[1.01]" : ""}`}>
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <CircleLoader size="sm" />
                    Opening...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center font-mono text-xs text-muted">
          Already have a ledger?{" "}
          <Link href="/login" className="text-brass-light hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}