"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowUpRight, Check, LifeBuoy, AlarmClock } from "lucide-react";
import { PageHead, Panel, Badge } from "@/portal/ui";
import { Toggle } from "@/portal/ui-client";
import { usd } from "@/portal/format";

/* Per-configuration guardrails — two demo configs the member can cap locally. */
const GUARDRAIL_CONFIGS: { key: string; label: string }[] = [
  { key: "deltaflow", label: "Delta Flow — Index Reversal" },
  { key: "deltavision", label: "Delta Vision — Momentum Burst" },
];

export default function RiskSettingsPage() {
  // core risk parameters
  const [riskPerTrade, setRiskPerTrade] = useState<number>(1);
  const [maxDailyLoss, setMaxDailyLoss] = useState<number>(1500);
  const [maxTrades, setMaxTrades] = useState<number>(6);

  // per-config guardrails
  const [guardrails, setGuardrails] = useState<Record<string, number>>({ deltaflow: 1200, deltavision: 900 });
  const [warnPreOpen, setWarnPreOpen] = useState<boolean>(true);
  const [warnPostClose, setWarnPostClose] = useState<boolean>(false);

  // save + protocol UI state
  const [saved, setSaved] = useState<boolean>(false);
  const [protocolActive, setProtocolActive] = useState<boolean>(false);

  const numHandler = (set: (v: number) => void) => (e: ChangeEvent<HTMLInputElement>) =>
    set(Number(e.target.value));

  const setGuardrail = (key: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setGuardrails((g) => ({ ...g, [key]: Number(e.target.value) }));

  const onSave = (): void => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const onActivateProtocol = (): void => {
    const ok = window.confirm(
      "Activate the daily-loss protocol? Your dashboards will switch to a cool-down view for the rest of the session."
    );
    if (ok) setProtocolActive(true);
  };

  const labelStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "var(--muted)",
  };

  return (
    <>
      {/* advisory banner */}
      <Link
        href="/app/kill-switch"
        className="p-panel"
        style={{ display: "flex", gap: "0.8rem", alignItems: "center", padding: "0.7rem 1rem", marginBottom: "1.2rem" }}
      >
        <Badge tone="warn">Advisory</Badge>
        <span style={{ fontSize: "0.85rem" }}>
          Advisory alerts only — these settings warn you; they do not auto-close trades.
        </span>
        <span className="mono muted" style={{ marginLeft: "auto", fontSize: "0.7rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          Kill switch <ArrowUpRight size={14} />
        </span>
      </Link>

      <PageHead
        eyebrow="Safeguards"
        title="Risk Settings"
        sub="Define the limits Meridian watches on your behalf. Breaches surface as alerts on the Bridge — nothing here closes a position for you."
        actions={<span className="tag"><ShieldAlert size={13} style={{ verticalAlign: "-2px", marginRight: "0.35rem" }} />Advisory mode</span>}
      />

      {/* core risk parameters */}
      <Panel eyebrow="Limits" title="Core risk parameters">
        <div className="form">
          <div className="form__row">
            <label className="field">
              <span>Risk per trade (%)</span>
              <input type="number" min={0} step={0.25} value={riskPerTrade} onChange={numHandler(setRiskPerTrade)} />
            </label>
            <label className="field">
              <span>Max daily loss ($)</span>
              <input type="number" min={0} step={50} value={maxDailyLoss} onChange={numHandler(setMaxDailyLoss)} />
            </label>
          </div>
          <div className="form__row">
            <label className="field">
              <span>Max trades per day</span>
              <input type="number" min={0} step={1} value={maxTrades} onChange={numHandler(setMaxTrades)} />
            </label>
            <div className="field" style={{ justifyContent: "flex-end" }}>
              <span style={labelStyle}>Current envelope</span>
              <p className="muted" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                Risk <span className="accent">{riskPerTrade}%</span> per idea · stop the day at{" "}
                <span className="accent">{usd(maxDailyLoss)}</span> · cap at{" "}
                <span className="accent">{maxTrades}</span> trades.
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* strategy guardrails */}
      <div style={{ marginTop: "1.2rem" }}>
        <Panel eyebrow="Per configuration" title="Strategy guardrails" action={<Badge tone="info">Preview</Badge>}>
          <div className="form">
            <div className="form__row">
              {GUARDRAIL_CONFIGS.map((c) => (
                <label className="field" key={c.key}>
                  <span>{c.label} — max daily loss ($)</span>
                  <input type="number" min={0} step={50} value={guardrails[c.key]} onChange={setGuardrail(c.key)} />
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "1.3rem", borderTop: "1px solid var(--line)", paddingTop: "1.2rem" }}>
            <div className="p-row" style={{ gap: "0.5rem", marginBottom: "1rem" }}>
              <AlarmClock size={15} style={{ color: "var(--signal)" }} />
              <span style={labelStyle}>Session restrictions</span>
            </div>
            <div className="p-stack" style={{ gap: "0.9rem" }}>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.84rem" }}>Warn before the 09:30 ET open</span>
                <Toggle on={warnPreOpen} onChange={setWarnPreOpen} />
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.84rem" }}>Warn after the 16:00 ET close</span>
                <Toggle on={warnPostClose} onChange={setWarnPostClose} />
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* save row */}
      <div className="p-row" style={{ marginTop: "1.2rem", justifyContent: "flex-end", gap: "0.8rem", alignItems: "center" }}>
        {saved && (
          <span className="mono pos" style={{ fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <Check size={14} /> Settings saved
          </span>
        )}
        <button type="button" className="p-btn p-btn--solid" onClick={onSave}>
          {saved ? "Saved" : "Save settings"}
        </button>
      </div>

      {/* daily-loss protocol (red panel, built inline for the red border) */}
      <section className="p-panel" style={{ marginTop: "1.6rem", borderColor: "rgba(217,121,79,0.45)" }}>
        <div className="p-panel__head">
          <div>
            <span className="p-panel__eyebrow">Circuit breaker</span>
            <h2 className="p-panel__title">I hit my daily loss limit</h2>
          </div>
        </div>
        <div className="p-panel__body">
          {protocolActive ? (
            <div className="p-empty" style={{ textAlign: "left", alignItems: "flex-start" }}>
              <div className="p-empty__icon"><LifeBuoy size={20} /></div>
              <p className="p-empty__title">The day is closed. That was the right call.</p>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                You&apos;ve hit your line in the sand and stepped away — the hardest, most professional thing a trader
                does. Step back from the screens, log what you saw, and let the edge reset. Tomorrow&apos;s session
                starts clean.
              </p>
            </div>
          ) : (
            <div className="p-row" style={{ justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <p className="muted" style={{ fontSize: "0.84rem", lineHeight: 1.6, maxWidth: "42ch" }}>
                Reached your <span className="accent">{usd(maxDailyLoss)}</span> stop? Activate the daily-loss protocol
                to switch your portal into a calm cool-down view for the rest of the session.
              </p>
              <button type="button" className="p-btn p-btn--danger" onClick={onActivateProtocol}>
                Activate daily-loss protocol
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
