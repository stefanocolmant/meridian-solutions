/* Shared formatters for the portal. Pure + deterministic (safe for SSR). */

export function usd(n: number, opts: { sign?: boolean; cents?: boolean } = {}): string {
  const { sign = false, cents = false } = opts;
  const abs = Math.abs(n);
  const s = abs.toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
  const prefix = n < 0 ? "−$" : sign ? "+$" : "$";
  return `${prefix}${s}`;
}

/** Compact money for dense cells: $1.2k / −$18.4k / $1.1M */
export function usdShort(n: number): string {
  const abs = Math.abs(n);
  const sgn = n < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sgn}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sgn}$${(abs / 1_000).toFixed(1)}k`;
  return `${sgn}$${abs.toFixed(0)}`;
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function num(n: number, digits = 0): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function pnlClass(n: number): string {
  return n > 0 ? "pos" : n < 0 ? "neg" : "flat";
}

/** Fixed-date helpers (anchored, deterministic — no wall clock). */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
