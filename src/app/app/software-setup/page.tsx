"use client";

import { useState } from "react";
import {
  ExternalLink, Webhook, Braces, Send, CheckCircle2, Circle, Loader2, Radio,
} from "lucide-react";
import { PageHead, Panel, Badge, TierTag, ProgressBar } from "@/portal/ui";
import { CopyButton } from "@/portal/ui-client";
import { ME } from "@/portal/data";

/* ----- example TradingView alert payload (static → SSR-safe) ----- */
const EXAMPLE_PAYLOAD = {
  ticker: "{{ticker}}",
  action: "{{strategy.order.action}}",
  contracts: "{{strategy.order.contracts}}",
  price: "{{close}}",
  tier: ME.tierLabel,
  username: ME.tvUsername,
  secret: "mdn_••••••••••••",
};
const PAYLOAD_STR = JSON.stringify(EXAMPLE_PAYLOAD, null, 2);

/* ----- setup checklist (first few pre-completed) ----- */
interface ChecklistItem { label: string; note: string; done: boolean; }
const CHECKLIST_INIT: ChecklistItem[] = [
  { label: "Connect your TradingView account", note: "Pro plan or higher — required for server-side alerts.", done: true },
  { label: "Add the Meridian master chart template", note: "Loads every session config in one layout.", done: true },
  { label: `Grant indicator access to ${ME.tvUsername}`, note: "We unlock the Polaris invite-only study on that handle.", done: true },
  { label: "Paste the webhook URL into your alert", note: "Use the forwarding endpoint from step 2.", done: false },
  { label: "Paste the alert message payload", note: "Copy the JSON body exactly — placeholders included.", done: false },
  { label: `Connect ${ME.automationPlatform} to your broker`, note: "Authorize the execution bridge for each account.", done: false },
  { label: "Map contracts to each funded account", note: "Match sizing to the drawdown on every prop account.", done: false },
  { label: "Send a test signal and verify delivery", note: "Confirm a 2xx response in the Signal Feed.", done: false },
];

type TestState = "idle" | "sending" | "done";

export default function SoftwareSetupPage() {
  const [items, setItems] = useState<ChecklistItem[]>(CHECKLIST_INIT);
  const [test, setTest] = useState<TestState>("idle");

  const completed = items.filter((it) => it.done).length;

  function toggle(i: number): void {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it)));
  }

  function runTest(): void {
    if (test === "sending") return;
    setTest("sending");
    setTimeout(() => setTest("done"), 900);
  }

  return (
    <>
      <PageHead
        eyebrow="Onboarding"
        title="Software Setup"
        sub={`Wire ${ME.assignedAlgorithm} into your charts and automation in four steps. Signals route the moment every box is green.`}
        actions={
          <span className="p-row" style={{ gap: "0.5rem" }}>
            <span className="tag">{ME.automationPlatform}</span>
            <TierTag tier={ME.tierLabel} />
          </span>
        }
      />

      <div className="p-stack">
        {/* ---------- Step 1 ---------- */}
        <Panel eyebrow="Step 01" title="1 · Install the master chart">
          <p className="muted" style={{ fontSize: "0.86rem", maxWidth: "60ch", marginBottom: "1rem" }}>
            Open TradingView and load the Meridian master template onto an NQ chart. It bundles every
            session configuration for your tier, so a single layout drives all of your signals. Your
            indicator access is provisioned to{" "}
            <span className="mono accent">{ME.tvUsername}</span>.
          </p>
          <div className="p-row" style={{ flexWrap: "wrap", gap: "0.7rem" }}>
            <a
              className="p-btn p-btn--solid"
              href="https://www.tradingview.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open TradingView <ExternalLink size={14} />
            </a>
            <a
              className="p-btn p-btn--ghost"
              href="https://www.tradingview.com/chart"
              target="_blank"
              rel="noopener noreferrer"
            >
              Load master chart <ExternalLink size={14} />
            </a>
            <span className="p-row" style={{ gap: "0.4rem", marginLeft: "auto" }}>
              <Badge tone="pos">Access granted</Badge>
            </span>
          </div>
        </Panel>

        {/* ---------- Step 2 ---------- */}
        <Panel
          eyebrow="Step 02"
          title="2 · Webhook configuration"
          action={<Badge tone="info"><Webhook size={12} /> Endpoint live</Badge>}
        >
          <p className="muted" style={{ fontSize: "0.86rem", maxWidth: "60ch", marginBottom: "1.1rem" }}>
            In your alert dialog, enable <span className="mono accent">Webhook URL</span> and paste the
            endpoint below. Then drop the JSON body into the alert message — the placeholders are
            substituted by TradingView at fire time.
          </p>

          <div className="p-grid-2" style={{ alignItems: "start" }}>
            <div>
              <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span className="eyebrow"><span className="dot" /> Webhook URL</span>
                <CopyButton text={ME.webhookUrl} />
              </div>
              <div className="p-codeblock">{ME.webhookUrl}</div>

              <div className="p-row" style={{ justifyContent: "space-between", margin: "1rem 0 0.5rem" }}>
                <span className="eyebrow"><span className="dot" /> Your forwarding endpoint</span>
                <CopyButton text={ME.forwardingUrl} />
              </div>
              <div className="p-codeblock">{ME.forwardingUrl}</div>
            </div>

            <div>
              <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span className="eyebrow"><Braces size={12} /> Alert message payload</span>
                <CopyButton text={PAYLOAD_STR} />
              </div>
              <div className="p-codeblock">{PAYLOAD_STR}</div>
            </div>
          </div>
        </Panel>

        {/* ---------- Step 3 ---------- */}
        <Panel eyebrow="Step 03" title="3 · Test the pipeline">
          <p className="muted" style={{ fontSize: "0.86rem", maxWidth: "60ch", marginBottom: "1.1rem" }}>
            Fire a dummy signal through the full path — TradingView to{" "}
            <span className="mono accent">{ME.automationPlatform}</span> to your broker. A green result
            confirms the round trip before any live config goes hot.
          </p>

          <div className="p-row" style={{ flexWrap: "wrap", gap: "0.8rem" }}>
            <button
              type="button"
              className="p-btn p-btn--solid"
              onClick={runTest}
              disabled={test === "sending"}
              style={test === "sending" ? { opacity: 0.7 } : undefined}
            >
              {test === "sending" ? (
                <><Loader2 size={14} /> Sending…</>
              ) : test === "done" ? (
                <><Send size={14} /> Send again</>
              ) : (
                <><Send size={14} /> Send test signal</>
              )}
            </button>

            {test === "done" && (
              <span
                className="p-row"
                style={{
                  gap: "0.6rem",
                  padding: "0.55rem 0.9rem",
                  border: "1px solid var(--color-up)",
                  borderRadius: 10,
                  background: "rgba(95,167,119,0.08)",
                }}
              >
                <CheckCircle2 size={16} style={{ color: "var(--color-up)" }} />
                <span style={{ fontSize: "0.84rem" }}>
                  Delivered · 142ms
                </span>
                <span className="muted mono" style={{ fontSize: "0.66rem" }}>HTTP 200</span>
              </span>
            )}

            {test === "idle" && (
              <span className="p-row muted" style={{ gap: "0.45rem", fontSize: "0.78rem" }}>
                <Radio size={14} /> Idle — no test sent yet.
              </span>
            )}
          </div>

          <div className="p-row" style={{ gap: "1.4rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
            <span className="p-stat__sub">Route: TradingView → {ME.automationPlatform} → Broker</span>
            <span className="p-stat__sub">Destination: <span className="mono">{ME.webhookUrl}</span></span>
          </div>
        </Panel>

        {/* ---------- Step 4 ---------- */}
        <Panel
          eyebrow="Step 04"
          title="4 · Setup checklist"
          action={
            <span className="p-row" style={{ gap: "0.6rem" }}>
              <span className="mono accent" style={{ fontSize: "0.72rem" }}>
                {completed} / {items.length} complete
              </span>
              <Badge tone={completed === items.length ? "pos" : "signal"}>
                {completed === items.length ? "Ready" : "In progress"}
              </Badge>
            </span>
          }
        >
          <div style={{ marginBottom: "1.1rem" }}>
            <ProgressBar value={completed} max={items.length} tone={completed === items.length ? "pos" : "signal"} />
          </div>

          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {items.map((it: ChecklistItem, i: number) => (
              <button
                key={it.label}
                type="button"
                onClick={() => toggle(i)}
                className="p-row"
                style={{
                  textAlign: "left",
                  width: "100%",
                  gap: "0.75rem",
                  padding: "0.7rem 0",
                  borderBottom: i < items.length - 1 ? "1px solid var(--line)" : "none",
                  alignItems: "flex-start",
                }}
              >
                {it.done ? (
                  <CheckCircle2 size={18} style={{ color: "var(--color-up)", flex: "none", marginTop: 1 }} />
                ) : (
                  <Circle size={18} style={{ color: "var(--muted)", flex: "none", marginTop: 1 }} />
                )}
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.86rem",
                      fontWeight: 500,
                      opacity: it.done ? 0.65 : 1,
                      textDecoration: it.done ? "line-through" : "none",
                    }}
                  >
                    {it.label}
                  </span>
                  <span className="muted" style={{ fontSize: "0.74rem" }}>{it.note}</span>
                </span>
                <span className="mono" style={{ fontSize: "0.6rem", color: "var(--muted)", flex: "none", marginTop: 2 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
