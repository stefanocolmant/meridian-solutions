import { PageHead, Panel, StatCard, Pnl, AreaChart, Bars } from "@/portal/ui";
import { PERF, KPIS, EQUITY, TRADES } from "@/portal/data";

function TradeRow({
  t,
  last,
}: {
  t: { symbol: string; side: string; date: string; pnl: number };
  last: boolean;
}) {
  return (
    <div
      className="p-row"
      style={{
        padding: "0.6rem 0",
        borderBottom: last ? "none" : "1px solid var(--line)",
        justifyContent: "space-between",
        gap: "0.6rem",
      }}
    >
      <span className="p-row" style={{ gap: "0.6rem", minWidth: 0 }}>
        <span className="mono t-sym" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{t.symbol}</span>
        <span className="muted" style={{ fontSize: "0.72rem" }}>{t.side}</span>
      </span>
      <span className="p-row" style={{ gap: "0.9rem" }}>
        <span className="muted mono" style={{ fontSize: "0.7rem" }}>{t.date}</span>
        <Pnl value={t.pnl} short />
      </span>
    </div>
  );
}

export default function PerformancePage() {
  return (
    <>
      <PageHead
        eyebrow="Performance"
        title="Track Record"
        sub={`Win rate ${KPIS.winRate}% · Profit factor ${KPIS.profitFactor.toFixed(3)} · Avg R:R ${KPIS.avgRR.toFixed(2)}`}
        actions={<span className="tag">{TRADES.length} trades analyzed</span>}
      />

      {/* summary */}
      <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
        <StatCard
          label="Avg hold · winners"
          value={PERF.summary.holdWinners}
          sub={`vs ${PERF.summary.holdLosers} on losers`}
          tone="pos"
        />
        <StatCard
          label="Current streak"
          value={`${PERF.summary.streak} wins`}
          sub={`Best ${PERF.summary.bestStreak} · Worst ${PERF.summary.worstStreak}`}
          tone="signal"
        />
        <StatCard label="Long P&amp;L" value={<Pnl value={PERF.summary.longPnl} />} tone="pos" />
        <StatCard label="Short P&amp;L" value={<Pnl value={PERF.summary.shortPnl} />} tone="pos" />
      </div>

      {/* key metrics */}
      <Panel eyebrow="Aggregate" title="Key metrics">
        <div className="p-grid-4">
          {PERF.metrics.map((m: { k: string; v: string }) => (
            <div key={m.k}>
              <div className="p-stat__label">{m.k}</div>
              <div className="stat-num" style={{ fontSize: "1.45rem" }}>{m.v}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* charts */}
      <div className="p-grid-2" style={{ margin: "1.2rem 0" }}>
        <Panel eyebrow="Timing" title="P&amp;L by hour">
          <Bars
            data={PERF.byHour.map((h: { time: string; pnl: number; trades: number }) => ({
              label: h.time,
              value: h.pnl,
            }))}
            height={160}
          />
        </Panel>

        <Panel eyebrow="Timing" title="P&amp;L by weekday">
          <Bars
            data={PERF.byWeekday.map((d: { day: string; pnl: number; trades: number }) => ({
              label: d.day,
              value: d.pnl,
            }))}
            height={160}
          />
        </Panel>

        <Panel eyebrow="Risk" title="Drawdown">
          <AreaChart
            points={PERF.drawdown.map((d: { date: string; label: string; drawdown: number }) => d.drawdown)}
            height={160}
          />
        </Panel>

        <Panel eyebrow="Instruments" title="P&amp;L by symbol">
          <Bars
            data={PERF.bySymbol.map((s: { symbol: string; pnl: number; trades: number; winRate: number }) => ({
              label: s.symbol,
              value: s.pnl,
            }))}
            axis="y"
          />
        </Panel>
      </div>

      {/* best / worst */}
      <div className="p-grid-2" style={{ marginBottom: "1.2rem" }}>
        <Panel eyebrow="Outliers" title="Best trades">
          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {PERF.best5.map((t, i: number) => (
              <TradeRow key={t.id} t={t} last={i === PERF.best5.length - 1} />
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Outliers" title="Worst trades">
          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {PERF.worst5.map((t, i: number) => (
              <TradeRow key={t.id} t={t} last={i === PERF.worst5.length - 1} />
            ))}
          </div>
        </Panel>
      </div>

      {/* equity */}
      <Panel eyebrow="Portfolio" title="Equity curve" action={<span className="tag">Last 90 days</span>}>
        <AreaChart points={EQUITY.map((e) => e.equity)} height={200} />
      </Panel>
    </>
  );
}
