"use client";

import { useMemo, useState } from "react";

type Mode = "prop" | "cash" | "hybrid";
const HORIZONS = [12, 24, 36, 48, 60];

// Illustrative assumptions — intentionally conservative, clearly hypothetical.
const CASH_MONTHLY = 0.034;          // compounding monthly return on personal capital
const PROP_PER_ACCT_MONTHLY = 2200;  // net monthly payout per funded ~$50k account

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n)}`;
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("hybrid");
  const [amount, setAmount] = useState(120000);
  const [accounts, setAccounts] = useState(6);

  const series = useMemo(() => {
    const cash = (m: number) => amount * (Math.pow(1 + CASH_MONTHLY, m) - 1);
    const prop = (m: number) => accounts * PROP_PER_ACCT_MONTHLY * m;
    return HORIZONS.map((m) => {
      let v = 0;
      if (mode === "cash") v = cash(m);
      else if (mode === "prop") v = prop(m);
      else v = 0.55 * prop(m) + 0.45 * cash(m);
      return { m, v };
    });
  }, [mode, amount, accounts]);

  const max = Math.max(...series.map((s) => s.v), 1);
  const headline = series.find((s) => s.m === 36)?.v ?? 0;

  return (
    <div className="calc" data-reveal>
      <div className="calc__controls reveal">
        <div className="calc__field">
          <label>Account type</label>
          <div className="calc__seg">
            {([["hybrid", "Hybrid mix"], ["prop", "Prop firm"], ["cash", "Personal capital"]] as [Mode, string][]).map(
              ([k, label]) => (
                <button key={k} className={mode === k ? "is-on" : ""} onClick={() => setMode(k)}>
                  {label}
                </button>
              ),
            )}
          </div>
        </div>

        {(mode === "cash" || mode === "hybrid") && (
          <div className="calc__field">
            <label>Personal capital <b>{fmt(amount)}</b></label>
            <input
              type="range" min={10000} max={1000000} step={10000}
              value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        )}

        {(mode === "prop" || mode === "hybrid") && (
          <div className="calc__field">
            <label>Funded accounts <b>{accounts}</b></label>
            <input
              type="range" min={1} max={30} step={1}
              value={accounts} onChange={(e) => setAccounts(Number(e.target.value))}
            />
          </div>
        )}

        <p className="form__note">
          Illustrative projection only. Assumes a conservative blended performance and a hands-off
          execution cadence. Not a forecast, guarantee, or advice — your results will differ.
        </p>
      </div>

      <div className="calc__out reveal">
        <div>
          <p className="eyebrow"><span className="dot" /> Projected net · 36 months</p>
          <div className="calc__big">{fmt(headline)}</div>
        </div>

        <div className="calc__bars">
          {series.map((s) => (
            <div key={s.m} className="calc__bar" style={{ height: `${Math.max((s.v / max) * 100, 4).toFixed(2)}%` }}>
              <span>{fmt(s.v)}</span>
              <i>{s.m}mo</i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
