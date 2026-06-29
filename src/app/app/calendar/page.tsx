"use client";

import { useState } from "react";
import { CalendarDays, ArrowLeftRight } from "lucide-react";
import { PageHead, Panel, StatCard, Pnl, Badge, EmptyState, cn } from "@/portal/ui";
import { usdShort } from "@/portal/format";
import {
  CALENDAR,
  CAL_MONTH,
  CAL_FIRST_WEEKDAY,
  CAL_TOTAL,
  TRADES,
  type CalDay,
  type Trade,
} from "@/portal/data";

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TRADED = CALENDAR.filter((d: CalDay) => d.trades > 0);
const INITIAL_DATE: string | null = TRADED.length ? TRADED[TRADED.length - 1].date : null;

function sideTone(side: Trade["side"]): "pos" | "neg" {
  return side === "Long" ? "pos" : "neg";
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(INITIAL_DATE);

  const selectedDay: CalDay | undefined = CALENDAR.find((d: CalDay) => d.date === selectedDate);
  const dayTrades: Trade[] = selectedDate ? TRADES.filter((t: Trade) => t.date === selectedDate) : [];
  const recent: Trade[] = TRADES.slice(0, 12);

  return (
    <>
      <PageHead
        eyebrow={CAL_MONTH.label}
        title="Logbook"
        sub="Every session, plotted day by day — green tides up, red tides down."
        actions={<span className="tag">{CAL_TOTAL.trades} trades logged</span>}
      />

      {/* month totals */}
      <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
        <StatCard
          label="Month P&amp;L"
          value={<Pnl value={CAL_TOTAL.pnl} />}
          tone={CAL_TOTAL.pnl >= 0 ? "pos" : "neg"}
          sub={CAL_MONTH.label}
          icon={<CalendarDays size={15} />}
        />
        <StatCard label="Trades" value={CAL_TOTAL.trades} sub="Closed this month" />
        <StatCard label="Green days" value={CAL_TOTAL.green} tone="pos" sub="Net positive sessions" />
        <StatCard label="Red days" value={CAL_TOTAL.red} tone="neg" sub="Net negative sessions" />
      </div>

      <div className="p-split">
        {/* LEFT — calendar grid + day detail */}
        <Panel eyebrow="Heatmap" title="Calendar" action={<span className="muted mono" style={{ fontSize: "0.66rem" }}>{CAL_MONTH.label}</span>}>
          {/* weekday header */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.4rem", marginBottom: "0.5rem" }}>
            {WD.map((w: string) => (
              <span key={w} className="muted mono" style={{ fontSize: "0.6rem", textAlign: "center", letterSpacing: "0.08em" }}>
                {w}
              </span>
            ))}
          </div>

          {/* month grid */}
          <div className="cal" style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.4rem" }}>
            {Array.from({ length: CAL_FIRST_WEEKDAY }).map((_, i: number) => (
              <span key={`lead-${i}`} />
            ))}
            {CALENDAR.map((d: CalDay) => {
              const has = d.trades > 0;
              const isSel = d.date === selectedDate;
              return (
                <div
                  key={d.date}
                  className={cn("cal__cell", d.pnl > 0 && "pos", d.pnl < 0 && "neg")}
                  onClick={() => has && setSelectedDate(d.date)}
                  style={{
                    cursor: has ? "pointer" : "default",
                    opacity: has ? 1 : 0.4,
                    outline: isSel ? "1px solid var(--signal)" : undefined,
                    boxShadow: isSel ? "0 0 0 1px var(--signal)" : undefined,
                  }}
                >
                  <span className="cal__day mono" style={{ fontSize: "0.66rem" }}>{d.day}</span>
                  {has && (
                    <>
                      <span
                        className="cal__pnl mono"
                        style={{ fontSize: "0.72rem", fontWeight: 600, color: d.pnl > 0 ? "var(--color-up)" : d.pnl < 0 ? "var(--signal-soft)" : undefined }}
                      >
                        {usdShort(d.pnl)}
                      </span>
                      <span className="muted mono" style={{ fontSize: "0.56rem" }}>{d.trades}t</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* day detail */}
          <div style={{ marginTop: "1.2rem", borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
            {selectedDay ? (
              <>
                <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.8rem" }}>
                  <div>
                    <span className="p-stat__label">Session detail</span>
                    <div className="display d-sm" style={{ fontSize: "1.1rem" }}>
                      {CAL_MONTH.label.split(" ")[0]} {selectedDay.day}
                    </div>
                  </div>
                  <div className="p-row" style={{ gap: "0.5rem" }}>
                    <Badge tone="pos">{selectedDay.wins}W</Badge>
                    <Badge tone="neg">{selectedDay.losses}L</Badge>
                    <Pnl value={selectedDay.pnl} />
                  </div>
                </div>

                {dayTrades.length ? (
                  <div className="ptable-wrap">
                    <table className="ptable">
                      <thead>
                        <tr>
                          <th>Side</th>
                          <th>Symbol</th>
                          <th>Window</th>
                          <th className="num">Qty</th>
                          <th className="num">P&amp;L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayTrades.map((t: Trade) => (
                          <tr key={t.id}>
                            <td><Badge tone={sideTone(t.side)}>{t.side}</Badge></td>
                            <td className="t-sym">{t.symbol}</td>
                            <td className="mono muted" style={{ fontSize: "0.72rem" }}>{t.openedAt}–{t.closedAt}</td>
                            <td className="num mono">{t.qty}</td>
                            <td className="num"><Pnl value={t.pnl} short /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState icon={<CalendarDays size={20} />} title="No trades this day" body="The desk sat on its hands." />
                )}
              </>
            ) : (
              <EmptyState icon={<CalendarDays size={20} />} title="Pick a day" body="Select any lit cell to inspect that session." />
            )}
          </div>
        </Panel>

        {/* RIGHT — recent trades */}
        <Panel eyebrow="Tape" title="Recent trades" action={<ArrowLeftRight size={15} style={{ opacity: 0.6 }} />}>
          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {recent.map((t: Trade, i: number) => (
              <div
                key={t.id}
                className="p-row"
                style={{
                  padding: "0.6rem 0",
                  borderBottom: i < recent.length - 1 ? "1px solid var(--line)" : "none",
                  gap: "0.6rem",
                }}
              >
                <Badge tone={sideTone(t.side)}>{t.side}</Badge>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span className="t-sym" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600 }}>{t.symbol}</span>
                  <span className="muted mono" style={{ fontSize: "0.66rem" }}>{t.account} · {t.closedAt}</span>
                </span>
                <Pnl value={t.pnl} short />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
