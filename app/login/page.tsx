"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Front-end only for now — wire this up to your API route / auth
    // provider once the backend exists.
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
            Returning entry
          </span>
          <h1 className="mt-2 font-display text-3xl text-ink-950">Log in</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-900/70"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="First name only"
                className="w-full rounded-lg border border-ink-900/25 bg-cream px-3.5 py-2.5 font-body text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-900/40 focus:border-brass"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="pwd"
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-900/70"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="font-mono text-[11px] text-rule hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="pwd"
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ink-900/25 bg-cream px-3.5 py-2.5 font-body text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-900/40 focus:border-brass"
              />
            </div>

            <button
              type="submit"
              className="shine-wrap w-full rounded-lg bg-ink-950 px-6 py-3 font-mono text-xs uppercase tracking-widest text-cream transition-transform hover:scale-[1.01] hover:bg-ink-800"
            >
              Log in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-muted">
          New here?{" "}
          <Link href="/register" className="text-brass-light hover:underline">
            Open an account
          </Link>
        </p>
      </div>
    </main>
  );
}
