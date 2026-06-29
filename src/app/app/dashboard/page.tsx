import Link from "next/link";
import { Radio, ListOrdered, HandCoins, CheckCircle2, ArrowUpRight } from "lucide-react";
import {
  PageHead, Panel, StatCard, Pnl, Badge, ProgressBar, AreaChart, Gauge, cn,
} from "@/portal/ui";
import { usd, usdShort } from "@/portal/format";
import {
  ME, ACCOUNTS, TOTALS, EQUITY, KPIS, STATS_BAND, ACTIVITY, ANNOUNCEMENTS, SIGNAL_SUMMARY,
} from "@/portal/data";

export default function DashboardPage() {
  const periodPnl = EQUITY[EQUITY.length - 1].equity - EQUITY[0].equity;
  const announce = ANNOUNCEMENTS[0];
  const kindIcon = { signal: Radio, trade: ListOrdered, payout: HandCoins, system: CheckCircle2 };

  return (
    <>
      {announce && (
        <Link href="/app/dashboard" className="p-panel" style={{ display: "flex", gap: "0.8rem", alignItems: "center", padding: "0.7rem 1rem", marginBottom: "1.2rem" }}>
          <Badge tone="signal">New</Badge>
          <span style={{ fontSize: "0.85rem" }}>{announce.title}</span>
          <ArrowUpRight size={15} style={{ marginLeft: "auto", opacity: 0.6 }} />
        </Link>
      )}

      <PageHead
        eyebrow="The Bridge"
        title={`Welcome back, ${ME.firstName}.`}
        sub={`Up ${usd(TOTALS.todayPnl, { sign: true })} today across ${TOTALS.count} accounts · ${TOTALS.funded} funded · all healthy.`}
        actions={<span className="tag">Last 90 days</span>}
      />

      {/* account health strip */}
      <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
        {ACCOUNTS.map((a) => {
          const headroom = (a.distanceToFloor / (a.netLiq - a.trailingFloor + a.distanceToFloor)) * 100;
          return (
            <div className="p-stat" key={a.id}>
              <div className="p-stat__top">
                <span className="p-stat__label">{a.firm}</span>
                <Badge tone={a.environment === "Funded" ? "pos" : "info"}>{a.environment}</Badge>
              </div>
              <div className="p-stat__value">{usdShort(a.netLiq)}</div>
              <div className="p-stat__sub">{a.name}</div>
              <ProgressBar value={Math.max(12, Math.min(100, headroom))} tone={headroom < 30 ? "neg" : "signal"} />
              <div className="p-stat__sub">{usd(a.distanceToFloor)} above floor</div>
            </div>
          );
        })}
      </div>

      {/* hero + activity */}
      <div className="p-split" style={{ marginBottom: "1.2rem" }}>
        <Panel eyebrow="Portfolio" title="Equity curve" action={<Pnl value={periodPnl} />}>
          <div className="p-grid-3" style={{ marginBottom: "1.2rem" }}>
            <div>
              <div className="p-stat__label">Total balance</div>
              <div className="stat-num" style={{ fontSize: "2.2rem" }}>{usd(TOTALS.netLiq)}</div>
            </div>
            <div>
              <div className="p-stat__label">90-day P&amp;L</div>
              <div className="stat-num" style={{ fontSize: "2.2rem", color: "var(--color-up)" }}>{usd(periodPnl, { sign: true })}</div>
            </div>
            <div>
              <div className="p-stat__label">Today</div>
              <div className="stat-num" style={{ fontSize: "2.2rem", color: "var(--color-up)" }}>{usd(TOTALS.todayPnl, { sign: true })}</div>
            </div>
          </div>
          <AreaChart points={EQUITY.map((e) => e.equity)} height={190} />
        </Panel>

        <Panel eyebrow="Live" title="Activity" action={<Link href="/app/signal-feed" className="p-copy">Feed</Link>}>
          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {ACTIVITY.map((ev, i) => {
              const Icon = kindIcon[ev.kind];
              return (
                <div key={i} className="p-row" style={{ padding: "0.6rem 0", borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--line)" : "none" }}>
                  <span className={cn("p-side__avatar")} style={{ width: 30, height: 30, background: "rgba(237,235,231,0.05)", color: "var(--muted)" }}>
                    <Icon size={14} />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "block", fontSize: "0.82rem" }}>{ev.title}</span>
                    <span className="muted" style={{ fontSize: "0.7rem" }}>{ev.meta}</span>
                  </span>
                  <span className="muted mono" style={{ fontSize: "0.66rem" }}>{ev.ago}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* KPI strip */}
      <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
        <Panel pad><div className="p-row" style={{ justifyContent: "space-between" }}>
          <div><div className="p-stat__label">Win rate</div><div className="stat-num" style={{ fontSize: "1.9rem" }}>{KPIS.winRate}%</div></div>
          <Gauge value={KPIS.winRate} max={100} display={`${KPIS.winRate}%`} />
        </div></Panel>
        <Panel pad><div className="p-row" style={{ justifyContent: "space-between" }}>
          <div><div className="p-stat__label">Profit factor</div><div className="stat-num" style={{ fontSize: "1.9rem" }}>{KPIS.profitFactor}</div></div>
          <Gauge value={KPIS.profitFactor} max={3} display={KPIS.profitFactor.toFixed(2)} />
        </div></Panel>
        <StatCard label="Avg R:R" value={KPIS.avgRR.toFixed(2)} sub="Reward to risk" />
        <StatCard label="Max drawdown" value={`${KPIS.maxDrawdown}%`} tone="neg" sub="Peak to trough" />
      </div>

      {/* stats band */}
      <Panel eyebrow="Behaviour" title="Trading stats">
        <div className="p-grid-4">
          {STATS_BAND.map((s) => (
            <div key={s.label}>
              <div className="p-stat__label">{s.label}</div>
              <div className={cn("stat-num", s.tone === "pos" && "pos", s.tone === "neg" && "neg")} style={{ fontSize: "1.5rem", color: s.tone === "pos" ? "var(--color-up)" : s.tone === "neg" ? "var(--signal-soft)" : undefined }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="p-row" style={{ marginTop: "1.2rem", justifyContent: "space-between" }}>
          <span className="muted" style={{ fontSize: "0.8rem" }}>{SIGNAL_SUMMARY.total.toLocaleString()} signals routed · {SIGNAL_SUMMARY.successRate}% delivered</span>
          <Link href="/app/performance" className="p-copy">Full performance →</Link>
        </div>
      </Panel>
    </>
  );
}
