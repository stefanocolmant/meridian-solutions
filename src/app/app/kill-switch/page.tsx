import Link from "next/link";
import { ShieldAlert, ExternalLink, LifeBuoy, ArrowRight } from "lucide-react";
import { PageHead, Panel, Badge } from "@/portal/ui";

const STEPS: { title: string; body: string }[] = [
  {
    title: "Open your trading platform",
    body: "Use the button above to launch Tradovate in a new tab. If you trade through a different broker, open that platform instead.",
  },
  {
    title: "Sign in to your funded account",
    body: "Authenticate and select the account you want to protect. Confirm the account number matches the one showing exposure.",
  },
  {
    title: "Hit Flatten All",
    body: "Use the Flatten All control to close every open position at market, immediately, across all contracts.",
  },
  {
    title: "Cancel pending orders",
    body: "Clear any resting limit, stop or bracket orders so nothing re-enters the market after you have flattened.",
  },
];

export default function KillSwitchPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <PageHead
        eyebrow="Emergency"
        title="Kill Switch"
        sub="Stop your exposure now. This page walks you through flattening every position from your broker in under a minute."
        actions={<Badge tone="warn">Manual action</Badge>}
      />

      {/* What the kill switch actually is */}
      <Panel eyebrow="Read this first" title="Meridian never touches your orders" className="" >
        <div className="p-stack" style={{ gap: "1rem" }}>
          <div
            className="p-row"
            style={{
              alignItems: "flex-start",
              gap: "0.8rem",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "0.9rem 1rem",
              background: "rgba(204,100,55,0.08)",
            }}
          >
            <span
              className="p-side__avatar"
              style={{ width: 34, height: 34, flexShrink: 0, background: "rgba(204,100,55,0.16)", color: "var(--signal)" }}
            >
              <ShieldAlert size={17} />
            </span>
            <p className="muted" style={{ fontSize: "0.86rem", lineHeight: 1.6, margin: 0 }}>
              Meridian is a signal and analytics layer. It does <span className="accent">not</span> place, modify, or close
              orders on your behalf, and it cannot reach your broker account. When you want to stop trading, you must flatten
              positions yourself inside your broker platform. That is the real kill switch &mdash; and you are always in control of it.
            </p>
          </div>

          <Link
            href="https://trader.tradovate.com"
            target="_blank"
            rel="noreferrer noopener"
            className="p-btn p-btn--solid"
            style={{ width: "100%", justifyContent: "center", gap: "0.5rem", padding: "0.95rem" }}
          >
            <ExternalLink size={16} />
            Open Tradovate &amp; close all positions
          </Link>
          <p className="muted mono" style={{ fontSize: "0.66rem", textAlign: "center", margin: 0 }}>
            Opens trader.tradovate.com in a new tab
          </p>
        </div>
      </Panel>

      {/* The 4 steps */}
      <Panel eyebrow="Flatten procedure" title="Close everything in 4 steps" className="" >
        <ol className="p-stack" style={{ listStyle: "none", margin: 0, padding: 0, gap: "0.7rem" }}>
          {STEPS.map((s, i) => (
            <li
              key={i}
              className="p-row"
              style={{
                alignItems: "flex-start",
                gap: "0.9rem",
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: "0.85rem 1rem",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <span
                className="p-side__avatar mono"
                style={{
                  width: 30,
                  height: 30,
                  flexShrink: 0,
                  background: "rgba(237,235,231,0.05)",
                  color: "var(--signal)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.15rem" }}>
                  {s.title}
                </span>
                <span className="muted" style={{ fontSize: "0.8rem", lineHeight: 1.55, display: "block" }}>
                  {s.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Panel>

      {/* Footer help */}
      <div
        className="p-row"
        style={{ justifyContent: "center", gap: "0.5rem", marginTop: "0.4rem", fontSize: "0.84rem" }}
      >
        <LifeBuoy size={15} className="muted" />
        <span className="muted">Need help?</span>
        <Link href="/app/support" className="p-copy p-row" style={{ gap: "0.3rem", alignItems: "center" }}>
          Contact support <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
