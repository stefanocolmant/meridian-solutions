"use client";

import { useState, type FormEvent } from "react";
import { Plus, Star, TrendingUp, Target, BookOpen } from "lucide-react";
import {
  PageHead, Panel, StatCard, Badge, Pnl, ProgressBar, EmptyState, cn,
} from "@/portal/ui";
import { Segmented } from "@/portal/ui-client";
import { JOURNAL, STRATEGIES, JOURNAL_STATS, type JournalEntry, type Strategy } from "@/portal/data";

type TabKey = "entries" | "insights";
type RatingFilter = "all" | "5" | "4" | "3";

interface Draft {
  symbol: string;
  strategy: string;
  title: string;
  side: "Long" | "Short";
  rating: string;
  notes: string;
}

const BLANK: Draft = { symbol: "", strategy: STRATEGIES[0].name, title: "", side: "Long", rating: "4", notes: "" };

function stars(n: number): string {
  return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
}

export default function JournalPage() {
  const [tab, setTab] = useState<TabKey>("entries");
  const [rating, setRating] = useState<RatingFilter>("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Draft>(BLANK);

  const minRating = rating === "all" ? 0 : Number(rating);
  const shown = JOURNAL.filter((e: JournalEntry) => e.rating >= minRating);
  const winners = JOURNAL.filter((e: JournalEntry) => e.pnl > 0).length;

  const byStrategy = STRATEGIES.map((s: Strategy) => {
    const es = JOURNAL.filter((e: JournalEntry) => e.strategy === s.name);
    const pnl = es.reduce((a: number, e: JournalEntry) => a + e.pnl, 0);
    const met = es.reduce((a: number, e: JournalEntry) => a + e.rulesMet, 0);
    const tot = es.reduce((a: number, e: JournalEntry) => a + e.rulesTotal, 0);
    const adherence = tot ? Math.round((met / tot) * 100) : 0;
    return { id: s.id, name: s.name, rules: s.items.length, count: es.length, pnl, adherence };
  });

  function handleSubmit(ev: FormEvent<HTMLFormElement>): void {
    ev.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <PageHead
        eyebrow="Trade journal"
        title="Journal"
        sub="Log every trade, grade your execution, and let the patterns surface."
        actions={
          <button
            type="button"
            className="p-btn p-btn--solid"
            onClick={() => { setComposerOpen((v: boolean) => !v); setSaved(false); }}
          >
            <Plus size={14} /> New entry
          </button>
        }
      />

      {composerOpen && (
        <div style={{ marginBottom: "1.2rem" }}>
        <Panel
          eyebrow="Log"
          title="New entry"
          action={
            <button
              type="button"
              className="p-btn p-btn--ghost"
              onClick={() => { setComposerOpen(false); setSaved(false); }}
            >
              Cancel
            </button>
          }
        >
          {saved ? (
            <div className="form__ok">
              <Badge tone="pos">Entry saved</Badge>
              <p className="form__note" style={{ marginTop: "0.8rem" }}>
                Your reflection was added to the log. This is a demo &mdash; nothing was sent.
              </p>
              <button
                type="button"
                className="p-btn p-btn--solid"
                style={{ marginTop: "1.1rem" }}
                onClick={() => { setSaved(false); setForm(BLANK); }}
              >
                <Plus size={14} /> Add another
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
              <div className="form__row">
                <div className="field">
                  <label>Symbol</label>
                  <input
                    value={form.symbol}
                    onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                    placeholder="NQ"
                  />
                </div>
                <div className="field">
                  <label>Strategy</label>
                  <select value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })}>
                    {STRATEGIES.map((s: Strategy) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What was the setup and how did you execute?"
                />
              </div>

              <div className="form__row">
                <div className="field">
                  <label>Side</label>
                  <Segmented
                    options={[{ value: "Long", label: "Long" }, { value: "Short", label: "Short" }]}
                    value={form.side}
                    onChange={(v) => setForm({ ...form, side: v })}
                    size="sm"
                  />
                </div>
                <div className="field">
                  <label>Execution rating</label>
                  <Segmented
                    options={[
                      { value: "1", label: "1★" },
                      { value: "2", label: "2★" },
                      { value: "3", label: "3★" },
                      { value: "4", label: "4★" },
                      { value: "5", label: "5★" },
                    ]}
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })}
                    size="sm"
                  />
                </div>
              </div>

              <div className="field">
                <label>Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="What went right, what to fix next time."
                />
              </div>

              <div className="p-row" style={{ justifyContent: "flex-end" }}>
                <button type="submit" className="p-btn p-btn--solid">Save entry</button>
              </div>
            </form>
          )}
        </Panel>
        </div>
      )}

      <div className="p-tabs" style={{ marginBottom: "1.2rem" }}>
        <button type="button" className={cn("p-tab", tab === "entries" && "is-on")} onClick={() => setTab("entries")}>
          Entries
        </button>
        <button type="button" className={cn("p-tab", tab === "insights" && "is-on")} onClick={() => setTab("insights")}>
          Insights
        </button>
      </div>

      {tab === "entries" ? (
        <>
          <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.7rem" }}>
            <Segmented
              options={[
                { value: "all", label: "All" },
                { value: "5", label: "5★" },
                { value: "4", label: "4★+" },
                { value: "3", label: "3★+" },
              ]}
              value={rating}
              onChange={setRating}
            />
            <span className="muted mono" style={{ fontSize: "0.7rem" }}>
              {shown.length} of {JOURNAL.length} entries
            </span>
          </div>

          {shown.length === 0 ? (
            <Panel pad={false}>
              <EmptyState icon={<BookOpen size={20} />} title="No entries at this rating" body="Lower the filter to see more of your log." />
            </Panel>
          ) : (
            <div className="p-grid-3">
              {shown.map((e: JournalEntry) => {
                const allMet = e.rulesMet === e.rulesTotal;
                return (
                  <Panel key={e.id}>
                    <div className="p-stack" style={{ gap: "0.7rem" }}>
                      <div className="p-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Badge tone={e.side === "Long" ? "pos" : "neg"}>{e.side}</Badge>
                        <span className="accent mono" style={{ fontSize: "0.72rem", letterSpacing: "0.05em" }}>{stars(e.rating)}</span>
                      </div>

                      <div className="p-row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
                        <span className="mono" style={{ fontWeight: 600, fontSize: "0.95rem" }}>{e.symbol}</span>
                        <span className="muted mono" style={{ fontSize: "0.7rem" }}>{e.date}</span>
                      </div>

                      <div style={{ fontSize: "0.92rem", fontWeight: 500, lineHeight: 1.3 }}>{e.title}</div>

                      <div className="p-row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
                        <Pnl value={e.pnl} />
                        <span className="muted" style={{ fontSize: "0.72rem" }}>{e.strategy}</span>
                      </div>

                      <div className="p-row" style={{ flexWrap: "wrap", gap: "0.4rem" }}>
                        {e.tags.map((t: string) => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>

                      <div>
                        <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.4rem" }}>
                          <span className="p-stat__label">Plan adherence</span>
                          <span className="mono" style={{ fontSize: "0.72rem", color: allMet ? "var(--color-up)" : "var(--muted)" }}>
                            {e.rulesMet}/{e.rulesTotal} rules
                          </span>
                        </div>
                        <ProgressBar value={e.rulesMet} max={e.rulesTotal} tone={allMet ? "pos" : "signal"} />
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
            <StatCard label="Avg rating" value={`${JOURNAL_STATS.avgRating.toFixed(1)} ★`} tone="signal" sub="Execution grade" icon={<Star size={14} />} />
            <StatCard label="Total P&L" value={<Pnl value={JOURNAL_STATS.totalPnl} />} tone={JOURNAL_STATS.totalPnl >= 0 ? "pos" : "neg"} sub="Realised, logged" icon={<TrendingUp size={14} />} />
            <StatCard label="Win rate" value={`${JOURNAL_STATS.winRate}%`} tone="pos" sub={`${winners}/${JOURNAL_STATS.entries} green`} icon={<Target size={14} />} />
            <StatCard label="Entries" value={JOURNAL_STATS.entries} tone="flat" sub="In the log" icon={<BookOpen size={14} />} />
          </div>

          <div className="p-grid-2">
            <Panel eyebrow="Playbook" title="By strategy">
              <div className="p-stack" style={{ gap: "1rem" }}>
                {byStrategy.map((s, i: number) => (
                  <div
                    key={s.id}
                    style={{ paddingBottom: i < byStrategy.length - 1 ? "1rem" : 0, borderBottom: i < byStrategy.length - 1 ? "1px solid var(--line)" : "none" }}
                  >
                    <div className="p-row" style={{ justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                      <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{s.name}</span>
                      <Pnl value={s.pnl} short />
                    </div>
                    <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span className="muted" style={{ fontSize: "0.74rem" }}>
                        {s.rules} checklist rules · {s.count} {s.count === 1 ? "entry" : "entries"}
                      </span>
                      <span className="muted mono" style={{ fontSize: "0.7rem" }}>{s.adherence}% adherence</span>
                    </div>
                    <ProgressBar value={s.adherence} tone={s.adherence >= 80 ? "pos" : "signal"} />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Review" title="Reflections">
              <div className="p-stack" style={{ gap: "0.1rem" }}>
                {JOURNAL.map((e: JournalEntry, i: number) => (
                  <div
                    key={e.id}
                    style={{ padding: "0.7rem 0", borderBottom: i < JOURNAL.length - 1 ? "1px solid var(--line)" : "none" }}
                  >
                    <div className="p-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <span className="mono" style={{ fontWeight: 600, fontSize: "0.84rem" }}>{e.symbol} · {e.date}</span>
                      <span className="accent mono" style={{ fontSize: "0.66rem" }}>{stars(e.rating)}</span>
                    </div>
                    <p className="muted" style={{ fontSize: "0.78rem", marginTop: "0.3rem", lineHeight: 1.4 }}>{e.notes}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
