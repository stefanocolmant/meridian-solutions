"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ShieldAlert, ShoppingCart, Ban, Lock, EyeOff, Search, Inbox, Check, UserRound,
} from "lucide-react";
import { PageHead, Panel, StatCard, Badge, TierTag, EmptyState, cn } from "@/portal/ui";
import { ALGO_ASSIGN, ALGO_OPTIONS, SESSION_PRESETS, type AlgoAssignUser } from "@/portal/admin-data";

type AssignFilter = "All" | "Assigned" | "Not assigned";
interface AlgoOption { key: string; name: string; desc: string }

const RED = "#c0453b";
const RED_LINE = "rgba(192,69,59,0.35)";
const RED_BG = "rgba(192,69,59,0.07)";

const RULES: { Icon: typeof ShoppingCart; title: string; desc: string }[] = [
  { Icon: ShoppingCart, title: "Purchase-based fulfilment", desc: "Assign only what the member purchased. Tier access is granted, never recommended." },
  { Icon: Ban, title: "No suitability advice", desc: "Do not advise whether an algorithm fits a member's goals, risk tolerance or situation." },
  { Icon: Lock, title: "Immutable audit log", desc: "Every change is written once to a permanent, tamper-evident record with operator and reason." },
  { Icon: EyeOff, title: "No performance framing", desc: "Never describe an assignment using past, hypothetical or projected returns." },
];

const TIERS: string[] = Array.from(new Set(ALGO_ASSIGN.map((u: AlgoAssignUser) => u.tier)));

function defaultAlgoKey(tier: string): string {
  const match = ALGO_OPTIONS.find((o: AlgoOption) => o.name.toLowerCase() === tier.toLowerCase());
  return match ? match.key : ALGO_OPTIONS[0].key;
}

function KV({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "0.65rem 0.8rem", background: "rgba(0,0,0,0.15)" }}>
      <div className="p-stat__label">{label}</div>
      <div style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>{value}</div>
    </div>
  );
}

export default function AlgorithmAssignmentPage() {
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [assignFilter, setAssignFilter] = useState<AssignFilter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // assignment form state
  const [algoKey, setAlgoKey] = useState<string>(ALGO_OPTIONS[0].key);
  const [reason, setReason] = useState("");
  const [presets, setPresets] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [triedSave, setTriedSave] = useState(false);

  const total = ALGO_ASSIGN.length;
  const assignedCount = ALGO_ASSIGN.filter((u: AlgoAssignUser) => u.current !== "Unassigned").length;
  const pendingCount = total - assignedCount;

  const filtered = useMemo<AlgoAssignUser[]>(() => {
    const q = query.trim().toLowerCase();
    return ALGO_ASSIGN.filter((u: AlgoAssignUser) => {
      if (q && !(u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))) return false;
      if (tierFilter !== "All" && u.tier !== tierFilter) return false;
      const isAssigned = u.current !== "Unassigned";
      if (assignFilter === "Assigned" && !isAssigned) return false;
      if (assignFilter === "Not assigned" && isAssigned) return false;
      return true;
    });
  }, [query, tierFilter, assignFilter]);

  const filtersActive = query.trim() !== "" || tierFilter !== "All" || assignFilter !== "All";
  const selected = ALGO_ASSIGN.find((u: AlgoAssignUser) => u.id === selectedId) ?? null;
  const chosenOption = ALGO_OPTIONS.find((o: AlgoOption) => o.key === algoKey) ?? ALGO_OPTIONS[0];

  function clearFilters(): void {
    setQuery("");
    setTierFilter("All");
    setAssignFilter("All");
  }

  function selectUser(u: AlgoAssignUser): void {
    setSelectedId(u.id);
    setAlgoKey(defaultAlgoKey(u.tier));
    setReason("");
    setPresets([]);
    setSaved(false);
    setTriedSave(false);
  }

  function togglePreset(p: string): void {
    setPresets((prev: string[]) => (prev.includes(p) ? prev.filter((x: string) => x !== p) : [...prev, p]));
  }

  function handleSave(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (reason.trim() === "") {
      setTriedSave(true);
      return;
    }
    setSaved(true);
  }

  return (
    <>
      <PageHead
        eyebrow="Fulfilment"
        title="Algorithm Assignment"
        sub="Grant tier access against a purchase. A search-driven console — no advice, fully audited."
        actions={<span className="tag">{total} eligible members</span>}
      />

      {/* compliance callout */}
      <div className="p-panel" style={{ borderColor: RED_LINE, background: RED_BG, marginBottom: "1.2rem" }}>
        <div className="p-panel__head">
          <div>
            <span className="p-panel__eyebrow" style={{ color: RED }}>Compliance · non-negotiable</span>
            <h2 className="p-panel__title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldAlert size={18} style={{ color: RED }} /> Fulfilment rules
            </h2>
          </div>
        </div>
        <div className="p-panel__body">
          <div className="p-grid-4">
            {RULES.map((r) => (
              <div key={r.title} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <span style={{ color: RED, marginTop: 2, flexShrink: 0 }}><r.Icon size={16} /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.84rem" }}>{r.title}</div>
                  <div className="muted" style={{ fontSize: "0.74rem", marginTop: "0.2rem", lineHeight: 1.4 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* count strip */}
      <div className="p-grid-3" style={{ marginBottom: "1.2rem" }}>
        <StatCard label="Eligible members" value={total} tone="flat" sub="With an active purchase" icon={<UserRound size={15} />} />
        <StatCard label="Assigned" value={assignedCount} tone="pos" sub="Access provisioned" icon={<Check size={15} />} />
        <StatCard label="Awaiting assignment" value={pendingCount} tone="signal" sub="Purchased, not yet granted" icon={<Inbox size={15} />} />
      </div>

      {/* search + results */}
      <Panel
        eyebrow="Directory"
        title="Find a member"
        action={<span className="muted mono" style={{ fontSize: "0.66rem" }}>Showing {filtered.length} of {total}</span>}
      >
        <div className="p-row" style={{ flexWrap: "wrap", gap: "1rem", alignItems: "flex-end", marginBottom: "1.2rem" }}>
          <div className="field" style={{ flex: "1 1 220px" }}>
            <label htmlFor="f-q">Search</label>
            <input
              id="f-q"
              type="text"
              placeholder="Name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: "0 1 160px" }}>
            <label htmlFor="f-tier">Tier</label>
            <select id="f-tier" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
              <option value="All">All tiers</option>
              {TIERS.map((t: string) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: "0 1 180px" }}>
            <label htmlFor="f-assign">Assignment</label>
            <select id="f-assign" value={assignFilter} onChange={(e) => setAssignFilter(e.target.value as AssignFilter)}>
              <option value="All">All</option>
              <option value="Assigned">Assigned</option>
              <option value="Not assigned">Not assigned</option>
            </select>
          </div>
          <div className="p-row" style={{ gap: "0.6rem", paddingBottom: "0.1rem" }}>
            <span className="p-btn p-btn--solid" aria-hidden="true"><Search size={14} /> Search</span>
            <button type="button" className="p-btn p-btn--ghost" onClick={clearFilters} disabled={!filtersActive}>Clear</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Search size={20} />} title="No members match" body="Adjust the search text, tier or assignment filter." />
        ) : (
          <div className="ptable-wrap">
            <table className="ptable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Tier</th>
                  <th>Current algorithm</th>
                  <th>Last assigned</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: AlgoAssignUser) => {
                  const isSel = u.id === selectedId;
                  const unassigned = u.current === "Unassigned";
                  return (
                    <tr
                      key={u.id}
                      onClick={() => selectUser(u)}
                      style={{ cursor: "pointer", background: isSel ? "rgba(204,100,55,0.1)" : undefined }}
                    >
                      <td><span style={{ fontWeight: 500, fontSize: "0.84rem" }}>{u.name}</span></td>
                      <td><span className="muted" style={{ fontSize: "0.78rem" }}>{u.email}</span></td>
                      <td><TierTag tier={u.tier} /></td>
                      <td>{unassigned ? <Badge tone="warn">Unassigned</Badge> : <span style={{ fontSize: "0.82rem" }}>{u.current}</span>}</td>
                      <td><span className="mono muted" style={{ fontSize: "0.72rem" }}>{u.lastAssigned}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div style={{ marginTop: "1.2rem" }}>
        {!selected ? (
          <Panel pad={false}>
            <EmptyState icon={<Inbox size={20} />} title="Select a member" body="Pick a row above to review their current access and record a new assignment." />
          </Panel>
        ) : (
          <Panel
            eyebrow={`Member · ${selected.id}`}
            title="Assignment record"
            action={<TierTag tier={selected.tier} />}
          >
            {/* member header */}
            <div className="p-row" style={{ gap: "0.8rem", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid var(--line)", marginBottom: "1rem" }}>
              <span className="p-side__avatar" style={{ width: 40, height: 40, background: "rgba(204,100,55,0.16)", color: "var(--signal)" }}>
                {selected.name.split(" ").map((p: string) => p[0]).join("")}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{selected.name}</div>
                <div className="muted" style={{ fontSize: "0.78rem" }}>{selected.email}</div>
              </div>
            </div>

            {/* current assignment */}
            <div className="p-grid-3" style={{ marginBottom: "1.4rem" }}>
              <KV label="Current algorithm" value={selected.current === "Unassigned" ? <Badge tone="warn">Unassigned</Badge> : selected.current} />
              <KV label="Last assigned" value={<span className="mono" style={{ fontSize: "0.82rem" }}>{selected.lastAssigned}</span>} />
              <KV label="Account ID" value={<span className="mono" style={{ fontSize: "0.82rem" }}>{selected.id}</span>} />
            </div>

            {saved ? (
              <div className="form__ok">
                <Badge tone="pos">Assignment saved</Badge>
                <p className="form__note" style={{ marginTop: "0.8rem", maxWidth: "60ch" }}>
                  &apos;{chosenOption.name}&apos; access is queued for {selected.name}
                  {presets.length > 0 ? ` across ${presets.length} session preset${presets.length === 1 ? "" : "s"}` : ""}.
                  Written to the immutable audit log with your reason. This is a demo &mdash; nothing was sent.
                </p>
                <button
                  type="button"
                  className="p-btn p-btn--solid"
                  style={{ marginTop: "1.1rem" }}
                  onClick={() => setSelectedId(null)}
                >
                  Assign another member
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={handleSave}>
                <div className="field">
                  <label>New assignment</label>
                  <div className="p-stack" style={{ gap: "0.6rem" }}>
                    {ALGO_OPTIONS.map((o: AlgoOption) => {
                      const on = algoKey === o.key;
                      return (
                        <button
                          key={o.key}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setAlgoKey(o.key)}
                          style={{
                            display: "flex", gap: "0.7rem", alignItems: "flex-start", textAlign: "left", width: "100%",
                            border: `1px solid ${on ? "var(--signal)" : "var(--line)"}`, borderRadius: 10,
                            padding: "0.7rem 0.8rem", background: on ? "rgba(204,100,55,0.08)" : "rgba(0,0,0,0.15)", cursor: "pointer",
                          }}
                        >
                          <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${on ? "var(--signal)" : "var(--line-strong)"}`, flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {on && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--signal)" }} />}
                          </span>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: "block", fontWeight: 600, fontSize: "0.88rem" }}>{o.name}</span>
                            <span className="muted" style={{ display: "block", fontSize: "0.76rem", marginTop: "0.15rem" }}>{o.desc}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="reason">Reason for change <span style={{ color: RED }}>*</span></label>
                  <textarea
                    id="reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => { setReason(e.target.value); if (triedSave) setTriedSave(false); }}
                    placeholder="Reference the purchase / order this fulfilment is based on."
                    style={triedSave && reason.trim() === "" ? { borderColor: RED } : undefined}
                  />
                  {triedSave && reason.trim() === "" && (
                    <span style={{ color: RED, fontSize: "0.74rem", marginTop: "0.35rem", display: "block" }}>
                      A reason is required &mdash; it is recorded permanently in the audit log.
                    </span>
                  )}
                </div>

                <div className="field">
                  <label>Session presets <span className="muted">(optional)</span></label>
                  <div className="p-row" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
                    {SESSION_PRESETS.map((p: string) => {
                      const on = presets.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          className={cn("tag")}
                          aria-pressed={on}
                          onClick={() => togglePreset(p)}
                          style={{ cursor: "pointer", borderColor: on ? "var(--signal)" : undefined, color: on ? "var(--signal)" : undefined, background: on ? "rgba(204,100,55,0.1)" : undefined }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-row" style={{ justifyContent: "flex-end", gap: "0.6rem" }}>
                  <button type="button" className="p-btn p-btn--ghost" onClick={() => setSelectedId(null)}>Cancel</button>
                  <button type="submit" className="p-btn p-btn--solid"><Check size={14} /> Save assignment</button>
                </div>
              </form>
            )}
          </Panel>
        )}
      </div>
    </>
  );
}
