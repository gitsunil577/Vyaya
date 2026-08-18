import CircleLoader from "@/components/CircleLoader";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 text-cream">
      {/* Background decorations matching the app's aesthetic */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-glow-brass opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />

      {/* Loader Graphic and Text */}
      <div className="relative flex flex-col items-center animate-fade-in">
        <CircleLoader size="lg" />

        {/* Brand and Status text */}
        <h2 className="mt-6 font-display text-2xl tracking-tight text-cream">
          Vyaya
        </h2>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted animate-pulse">
          Opening ledger...
        </p>
      </div>
    </div>
  );
}
