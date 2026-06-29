"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, CheckCircle2, History, Search, X } from "lucide-react";
import { PageHead, Panel, StatCard, Badge, Pnl, EmptyState } from "@/portal/ui";
import { usd, num } from "@/portal/format";
import { TRADES, POSITION_COUNTS, ACCOUNTS, type Trade } from "@/portal/data";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`;
}

type SideFilter = "All" | "Long" | "Short";

export default function TradesPage() {
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<SideFilter>("All");
  const [account, setAccount] = useState("All");
  const [selected, setSelected] = useState<Trade | null>(null);

  const filtered = useMemo<Trade[]>(() => {
    const q = symbol.trim().toUpperCase();
    return TRADES.filter((t) => {
      if (q && !t.symbol.toUpperCase().includes(q)) return false;
      if (side !== "All" && t.side !== side) return false;
      if (account !== "All" && t.account !== account) return false;
      return true;
    });
  }, [symbol, side, account]);

  const rows = filtered.slice(0, 30);
  const filtersActive = symbol.trim() !== "" || side !== "All" || account !== "All";

  function clearFilters(): void {
    setSymbol("");
    setSide("All");
    setAccount("All");
  }

  // Esc closes the detail modal.
  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <PageHead
        eyebrow="History"
        title="Trade Log"
        sub="Every fill routed through your accounts — searchable, with full per-trade breakdowns."
        actions={<span className="tag">{TRADES.length} fills · last 34 days</span>}
      />

      <div className="p-grid-3" style={{ marginBottom: "1.2rem" }}>
        <StatCard
          label="Open positions"
          value={num(POSITION_COUNTS.open)}
          tone="signal"
          sub="Live across all accounts"
          icon={<Activity size={15} />}
        />
        <StatCard
          label="Closed today"
          value={num(POSITION_COUNTS.closedToday)}
          tone="flat"
          sub="Settled this session"
          icon={<CheckCircle2 size={15} />}
        />
        <StatCard
          label="Closed all-time"
          value={num(POSITION_COUNTS.closedAllTime)}
          tone="flat"
          sub="Lifetime executions"
          icon={<History size={15} />}
        />
      </div>

      <Panel
        eyebrow="Ledger"
        title="Filled trades"
        action={
          <span className="muted mono" style={{ fontSize: "0.66rem" }}>
            Showing {rows.length} of {filtered.length}
          </span>
        }
      >
        {/* filter bar */}
        <div
          className="p-row"
          style={{ flexWrap: "wrap", gap: "1rem", alignItems: "flex-end", marginBottom: "1.2rem" }}
        >
          <div className="field" style={{ flex: "1 1 180px" }}>
            <label htmlFor="f-symbol">Symbol</label>
            <input
              id="f-symbol"
              type="text"
              placeholder="NQ, ES…"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: "0 1 150px" }}>
            <label htmlFor="f-side">Side</label>
            <select id="f-side" value={side} onChange={(e) => setSide(e.target.value as SideFilter)}>
              <option value="All">All</option>
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </div>
          <div className="field" style={{ flex: "1 1 220px" }}>
            <label htmlFor="f-account">Account</label>
            <select id="f-account" value={account} onChange={(e) => setAccount(e.target.value)}>
              <option value="All">All accounts</option>
              {ACCOUNTS.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="p-row" style={{ gap: "0.6rem", paddingBottom: "0.1rem" }}>
            <span className="p-btn p-btn--solid" aria-hidden="true">
              <Search size={14} /> Search
            </span>
            <button
              type="button"
              className="p-btn p-btn--ghost"
              onClick={clearFilters}
              disabled={!filtersActive}
            >
              Clear
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={<Search size={20} />}
            title="No trades match"
            body="Adjust the symbol, side or account filters."
          />
        ) : (
          <div className="ptable-wrap">
            <table className="ptable">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th className="num">Entry</th>
                  <th className="num">Exit</th>
                  <th className="num">Qty</th>
                  <th className="num">Net P&amp;L</th>
                  <th className="num">Fees</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t: Trade) => (
                  <tr key={t.id} style={{ cursor: "pointer" }} onClick={() => setSelected(t)}>
                    <td>
                      <span style={{ fontSize: "0.8rem" }}>{t.account}</span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: "0.72rem" }}>
                        {t.weekday} · {fmtDate(t.date)}
                      </span>
                    </td>
                    <td className="t-sym">{t.symbol}</td>
                    <td>
                      <Badge tone={t.side === "Long" ? "info" : "signal"}>{t.side}</Badge>
                    </td>
                    <td className="num">{num(t.entry, 2)}</td>
                    <td className="num">{num(t.exit, 2)}</td>
                    <td className="num">{t.qty}</td>
                    <td className="num">
                      <Pnl value={t.pnl} />
                    </td>
                    <td className="num muted">{usd(t.fees, { cents: true })}</td>
                    <td>
                      <span className="mono" style={{ fontSize: "0.72rem" }}>
                        {t.duration}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Trade detail"
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(7,7,8,0.86)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(1rem,5vw,3rem)",
          }}
        >
          <div
            className="p-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(560px, 100%)", maxHeight: "86vh", overflowY: "auto" }}
          >
            <div className="p-panel__head">
              <div>
                <span className="p-panel__eyebrow">Trade · {selected.id}</span>
                <h2 className="p-panel__title">
                  {selected.symbol} {selected.side}
                </h2>
              </div>
              <button
                type="button"
                className="p-btn p-btn--ghost"
                onClick={() => setSelected(null)}
                aria-label="Close"
                style={{ width: 38, height: 38, padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-panel__body">
              {/* headline P&L */}
              <div
                className="p-row"
                style={{
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--line)",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <div className="p-stat__label">Net P&amp;L</div>
                  <div className="stat-num" style={{ fontSize: "2rem" }}>
                    <Pnl value={selected.pnl} />
                  </div>
                </div>
                <div className="p-row" style={{ gap: "0.5rem" }}>
                  <Badge tone={selected.side === "Long" ? "info" : "signal"}>{selected.side}</Badge>
                  <span className="tag">{selected.assetClass}</span>
                </div>
              </div>

              {/* breakdown grid */}
              <div className="p-grid-2" style={{ gap: "0.9rem" }}>
                <KV label="Account" value={selected.account} />
                <KV label="Date" value={`${selected.weekday}, ${fmtDate(selected.date)}`} />
                <KV label="Quantity" value={`${selected.qty} contracts`} />
                <KV label="Duration" value={selected.duration} />
                <KV label="Entry price" value={num(selected.entry, 2)} mono />
                <KV label="Exit price" value={num(selected.exit, 2)} mono />
                <KV label="Opened" value={`${selected.openedAt} ET`} mono />
                <KV label="Closed" value={`${selected.closedAt} ET`} mono />
                <KV
                  label="R multiple"
                  value={`${selected.rMultiple > 0 ? "+" : ""}${selected.rMultiple.toFixed(2)}R`}
                  mono
                />
                <KV label="Fees" value={usd(selected.fees, { cents: true })} mono />
                <KV
                  label="Gross P&L"
                  value={usd(selected.pnl + selected.fees, { sign: true, cents: true })}
                  mono
                />
                <KV
                  label="Net P&L"
                  value={usd(selected.pnl, { sign: true, cents: true })}
                  mono
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function KV({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 10,
        padding: "0.65rem 0.8rem",
        background: "rgba(0,0,0,0.15)",
      }}
    >
      <div className="p-stat__label">{label}</div>
      <div className={mono ? "mono" : undefined} style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
        {value}
      </div>
    </div>
  );
}
