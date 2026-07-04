"use client";

import { useEffect, useRef, useState } from "react";
import { MONTHLY_PNL } from "@/content/data";

/**
 * Monthly-returns bar chart — net P&L for each of the 15 validated months.
 * Positive months grow up from the zero line (equity green); the single down
 * month grows below it (loss orange). Bars stagger up once scrolled into view.
 * Values reveal on hover to keep the resting state clean and spaced out.
 */
export function MonthlyReturns() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maxPos = Math.max(...MONTHLY_PNL.map((m) => m.pnl), 0);
  const maxNeg = Math.min(...MONTHLY_PNL.map((m) => m.pnl), 0); // ≤ 0
  const span = maxPos - maxNeg || 1;
  const zero = (-maxNeg / span) * 100; // % of plot height below the zero line

  const fmt = (n: number) => {
    const k = Math.abs(n) / 1000;
    const s = k >= 10 ? k.toFixed(0) : k.toFixed(1);
    return `${n >= 0 ? "+" : "−"}$${s}k`;
  };

  return (
    <div
      className="mreturns reveal"
      ref={ref}
      data-in={inView ? "" : undefined}
      style={{ ["--zero" as string]: `${zero}%` }}
    >
      <div className="mreturns__head">
        <span className="eyebrow">
          <span className="dot" /> Monthly returns
        </span>
        <span className="mono muted mreturns__note">
          Net P&amp;L per month · 15-month validation · hypothetical
        </span>
      </div>

      <div className="mreturns__scroll">
        <div className="mreturns__plot">
          <span className="mreturns__baseline" style={{ bottom: `${zero}%` }} aria-hidden="true" />
          <div className="mreturns__bars">
            {MONTHLY_PNL.map((m, i) => {
              const pos = m.pnl >= 0;
              const h = (Math.abs(m.pnl) / span) * 100;
              return (
                <div
                  className={`mreturns__col ${pos ? "is-up" : "is-down"}`}
                  key={m.month}
                  style={{ ["--h" as string]: `${h}%`, ["--d" as string]: `${i * 45}ms` }}
                >
                  <span className="mreturns__val mono">{fmt(m.pnl)}</span>
                  <span className="mreturns__bar" aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mreturns__axis" aria-hidden="true">
          {MONTHLY_PNL.map((m) => (
            <span className="mreturns__m mono" key={m.month}>
              {m.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
