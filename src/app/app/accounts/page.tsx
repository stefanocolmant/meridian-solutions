import type { ReactNode } from "react";
import { Layers, Activity, Trophy, Banknote, Building2 } from "lucide-react";
import { PageHead, Panel, StatCard, Badge, Pnl, ProgressBar } from "@/portal/ui";
import { usd, usdShort } from "@/portal/format";
import { ACCOUNTS, TOTALS, type Account } from "@/portal/data";

/* Per-account trailing-drawdown headroom rendered against an assumed 5% band,
   so the bar reads as "buffer remaining before the floor". Deterministic. */
const DRAWDOWN_BAND = 0.05;

function AccountCard({ a }: { a: Account }) {
  const band = a.startingBalance * DRAWDOWN_BAND;
  const headroom = Math.max(0, Math.min(100, (a.distanceToFloor / band) * 100));
  const ddTone: "signal" | "pos" | "neg" =
    headroom < 30 ? "neg" : headroom < 65 ? "signal" : "pos";

  const rows: { label: string; value: ReactNode }[] = [
    { label: "Cash", value: <span className="mono">{usd(a.cash)}</span> },
    { label: "Today", value: <Pnl value={a.todayPnl} /> },
    { label: "Realized today", value: <Pnl value={a.realizedToday} /> },
    { label: "Open P&L", value: <Pnl value={a.openPnl} /> },
    { label: "Week realized", value: <Pnl value={a.weekRealized} /> },
  ];

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: "1rem",
        background: "rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      <div className="p-row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{a.name}</div>
          <div className="muted mono" style={{ fontSize: "0.64rem" }}>{a.accountId}</div>
        </div>
        <Badge tone={a.environment === "Funded" ? "pos" : "info"}>{a.environment}</Badge>
      </div>

      <div>
        <div className="p-stat__label">Net liquidation</div>
        <div className="stat-num" style={{ fontSize: "1.7rem" }}>{usd(a.netLiq)}</div>
      </div>

      <div className="p-stack" style={{ gap: "0.4rem" }}>
        {rows.map((r) => (
          <div key={r.label} className="p-row" style={{ justifyContent: "space-between", fontSize: "0.78rem" }}>
            <span className="muted">{r.label}</span>
            <span>{r.value}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.35rem" }}>
          <span className="p-stat__label">Trailing drawdown</span>
          <span className="muted mono" style={{ fontSize: "0.62rem" }}>{a.locked ? "Locked" : "Trailing"}</span>
        </div>
        <ProgressBar value={headroom} tone={ddTone} />
        <div className="p-stat__sub" style={{ marginTop: "0.35rem" }}>
          {usd(a.distanceToFloor)} above floor · {a.locked ? "floor locked at start" : "floor trails your equity"}
        </div>
      </div>

      <div className="muted mono" style={{ fontSize: "0.62rem", borderTop: "1px solid var(--line)", paddingTop: "0.6rem" }}>
        {a.trades} trades synced · {a.lastSync}
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const firms: string[] = Array.from(new Set(ACCOUNTS.map((a) => a.firm)));
  const groups = firms.map((firm) => ({
    firm,
    accounts: ACCOUNTS.filter((a) => a.firm === firm),
  }));
  const profitable = ACCOUNTS.filter((a) => a.lifetimePnl > 0).length;

  return (
    <>
      <PageHead
        eyebrow="Accounts"
        title="Fleet"
        sub={`${TOTALS.count} accounts across ${firms.length} firms · ${TOTALS.funded} funded · all synced.`}
        actions={<span className="tag">Live</span>}
      />

      <div className="p-grid-4" style={{ marginBottom: "1.4rem" }}>
        <StatCard label="Net liquidation" value={usd(TOTALS.netLiq)} icon={<Layers size={15} />} />
        <StatCard label="Today" value={<Pnl value={TOTALS.todayPnl} />} icon={<Activity size={15} />} />
        <StatCard
          label="Lifetime P&L"
          value={<Pnl value={TOTALS.lifetimePnl} />}
          sub={`across ${profitable} of ${TOTALS.count} accounts`}
          icon={<Trophy size={15} />}
        />
        <StatCard label="Cash" value={usd(TOTALS.cash)} icon={<Banknote size={15} />} />
      </div>

      <div className="p-stack" style={{ gap: "1.2rem" }}>
        {groups.map((g) => {
          const firmNet = g.accounts.reduce((s, a) => s + a.netLiq, 0);
          return (
            <Panel
              key={g.firm}
              eyebrow="Firm"
              title={
                <span className="p-row" style={{ gap: "0.5rem", alignItems: "center" }}>
                  <Building2 size={16} style={{ opacity: 0.6 }} />
                  {g.firm}
                </span>
              }
              action={
                <span className="muted mono" style={{ fontSize: "0.7rem" }}>
                  {g.accounts.length} account{g.accounts.length === 1 ? "" : "s"} · {usdShort(firmNet)} net liq
                </span>
              }
            >
              <div className="p-grid-3">
                {g.accounts.map((a) => (
                  <AccountCard key={a.id} a={a} />
                ))}
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
