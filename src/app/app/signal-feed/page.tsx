"use client";

import { useState } from "react";
import { Radio, CheckCircle2, XCircle, Clock, ChevronRight, ChevronDown } from "lucide-react";
import { PageHead, Panel, StatCard, Badge, TierTag, ProgressBar, cn } from "@/portal/ui";
import { Segmented } from "@/portal/ui-client";
import { num } from "@/portal/format";
import { SIGNALS, SIGNAL_SUMMARY, STRATEGY_ACTIVITY, type Signal, type ForwardLog } from "@/portal/data";

type TierFilter = "All" | "Vega" | "Polaris";

export default function SignalFeedPage() {
  const [filter, setFilter] = useState<TierFilter>("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const rows: Signal[] = filter === "All" ? SIGNALS : SIGNALS.filter((s) => s.tier === filter);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <PageHead
        eyebrow="Live routing"
        title="Signal Feed"
        sub="Every alert your algorithms fire, routed to your platforms in real time — with the full delivery trail."
        actions={<span className="tag">{SIGNALS.length} recent</span>}
      />

      {/* summary band */}
      <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
        <StatCard
          label="Signals today"
          value={num(SIGNAL_SUMMARY.today)}
          tone="signal"
          sub={`${num(SIGNAL_SUMMARY.total)} total routed`}
          icon={<Radio size={15} />}
        />
        <StatCard
          label="Success rate"
          value={`${SIGNAL_SUMMARY.successRate}%`}
          tone="pos"
          sub={`${num(SIGNAL_SUMMARY.delivered)} delivered`}
          icon={<CheckCircle2 size={15} />}
        />
        <StatCard
          label="Failed"
          value={num(SIGNAL_SUMMARY.failed)}
          tone="neg"
          sub="Auto-retried"
          icon={<XCircle size={15} />}
        />
        <StatCard
          label="Last signal"
          value={SIGNAL_SUMMARY.lastSignal}
          sub="Newest delivery"
          icon={<Clock size={15} />}
        />
      </div>

      {/* strategy activity */}
      <Panel eyebrow="Routing" title="Strategy activity">
        <div className="p-stack" style={{ gap: "1rem" }}>
          {STRATEGY_ACTIVITY.map((s) => {
            const tierLabel = s.tone.charAt(0).toUpperCase() + s.tone.slice(1);
            const pctVal = Math.round((s.count / s.total) * 100);
            return (
              <div key={s.name}>
                <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.5rem", gap: "0.6rem" }}>
                  <span className="p-row" style={{ gap: "0.55rem", minWidth: 0 }}>
                    <TierTag tier={tierLabel} />
                    <span style={{ fontSize: "0.85rem" }}>{s.name}</span>
                  </span>
                  <span className="mono muted" style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                    {s.count} / {s.total} · {pctVal}%
                  </span>
                </div>
                <ProgressBar value={s.count} max={s.total} tone="signal" />
              </div>
            );
          })}
        </div>
      </Panel>

      {/* signal table */}
      <div style={{ height: "1.2rem" }} />
      <Panel
        eyebrow="Feed"
        title="Signals"
        action={
          <Segmented<TierFilter>
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "All", label: "All" },
              { value: "Vega", label: "Vega" },
              { value: "Polaris", label: "Polaris" },
            ]}
          />
        }
        pad={false}
      >
        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th>Time</th>
                <th>Symbol</th>
                <th>Tier</th>
                <th>Direction</th>
                <th>Action</th>
                <th>TF</th>
                <th className="num">Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const open = expanded.has(s.id);
                return (
                  <SignalRows key={s.id} signal={s} open={open} onToggle={() => toggle(s.id)} />
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="p-empty">
                      <p className="p-empty__title">No signals for this tier</p>
                      <p className="muted">Switch the filter to see routed alerts.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function SignalRows({ signal, open, onToggle }: { signal: Signal; open: boolean; onToggle: () => void }) {
  const dirTone = signal.direction === "Long" ? "pos" : "neg";
  const statusTone = signal.status === "Forwarded" ? "pos" : signal.status === "Failed" ? "neg" : "warn";
  return (
    <>
      <tr onClick={onToggle} style={{ cursor: "pointer" }} aria-expanded={open}>
        <td>
          <span className="p-row" style={{ gap: "0.4rem", alignItems: "center" }}>
            {open ? <ChevronDown size={13} style={{ opacity: 0.7 }} /> : <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            <span className="mono" style={{ fontSize: "0.74rem" }}>{signal.ago}</span>
          </span>
        </td>
        <td className="t-sym">{signal.symbol}</td>
        <td><TierTag tier={signal.tier} /></td>
        <td><Badge tone={dirTone}>{signal.direction}</Badge></td>
        <td><span style={{ fontSize: "0.82rem" }}>{signal.action}</span></td>
        <td><span className="mono muted" style={{ fontSize: "0.72rem" }}>{signal.timeframe}</span></td>
        <td className="num">{num(signal.price, 2)}</td>
        <td><Badge tone={statusTone}>{signal.status}</Badge></td>
      </tr>
      {open && (
        <tr>
          <td colSpan={8} style={{ background: "rgba(0,0,0,0.18)", padding: "0 0.9rem 0.9rem" }}>
            <div className="p-stack" style={{ gap: "0.7rem", paddingTop: "0.7rem" }}>
              <div className="p-row" style={{ gap: "1.4rem", flexWrap: "wrap" }}>
                <span className="muted mono" style={{ fontSize: "0.68rem" }}>
                  ID <span className="accent">{signal.id}</span>
                </span>
                <span className="muted mono" style={{ fontSize: "0.68rem" }}>
                  ALGO <span style={{ color: "var(--fg)" }}>{signal.algo}</span>
                </span>
                <span className="muted mono" style={{ fontSize: "0.68rem" }}>
                  LATENCY <span style={{ color: "var(--fg)" }}>{signal.latencyMs} ms</span>
                </span>
                <span className="muted mono" style={{ fontSize: "0.68rem" }}>
                  ATTEMPTS <span style={{ color: "var(--fg)" }}>{signal.logs.length}</span>
                </span>
              </div>
              <p className="eyebrow" style={{ margin: 0 }}><span className="dot" /> Delivery trail</p>
              <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
                <table className="ptable" style={{ fontSize: "0.78rem" }}>
                  <thead>
                    <tr>
                      <th>Attempt</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th className="num">Code</th>
                      <th className="num">Latency</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signal.logs.map((log: ForwardLog) => (
                      <tr key={log.attempt}>
                        <td><span className="mono">#{log.attempt}</span></td>
                        <td><span style={{ fontSize: "0.78rem" }}>{log.destination}</span></td>
                        <td>
                          <Badge tone={log.status === "Delivered" ? "pos" : log.status === "Failed" ? "neg" : "warn"}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className={cn("num mono", log.code >= 400 && "neg")}>{log.code}</td>
                        <td className="num mono">{log.latencyMs} ms</td>
                        <td>
                          {log.error
                            ? <span className="neg" style={{ fontSize: "0.74rem" }}>{log.error}</span>
                            : <span className="muted">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
