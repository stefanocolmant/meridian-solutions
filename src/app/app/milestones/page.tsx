"use client";

import { useState } from "react";
import {
  Flag,
  Image as ImageIcon,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  Link2,
  Trophy,
} from "lucide-react";
import { PageHead, Panel, StatCard, Badge, TierTag, Pnl } from "@/portal/ui";
import { usd } from "@/portal/format";
import {
  MILESTONES,
  MILESTONE_TYPES,
  ACCOUNTS,
  type Milestone,
  type Account,
} from "@/portal/data";

export default function MilestonesPage() {
  /* ---- derived summary (deterministic) ---- */
  const approved = MILESTONES.filter((m: Milestone) => m.status === "Approved");
  const pending = MILESTONES.filter((m: Milestone) => m.status === "Pending");
  const rejected = MILESTONES.filter((m: Milestone) => m.status === "Rejected");
  const verifiedGain = approved.reduce(
    (s: number, m: Milestone) => s + (m.currentBalance - m.startingBalance),
    0,
  );
  const firms = Array.from(new Set(ACCOUNTS.map((a: Account) => a.firm)));

  /* ---- form state ---- */
  const [account, setAccount] = useState("");
  const [firm, setFirm] = useState("");
  const [type, setType] = useState("");
  const [startBal, setStartBal] = useState("");
  const [currentBal, setCurrentBal] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [compliant, setCompliant] = useState(false);
  const [notes, setNotes] = useState("");
  const [shotName, setShotName] = useState<string | null>(null);
  const [exportName, setExportName] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const sNum = parseFloat(startBal);
  const cNum = parseFloat(currentBal);
  const gainValid = !Number.isNaN(sNum) && !Number.isNaN(cNum);
  const gain = gainValid ? cNum - sNum : 0;

  function linkAccount(id: string) {
    setAccount(id);
    const acc = ACCOUNTS.find((a: Account) => a.id === id);
    if (acc) {
      setFirm(acc.firm);
      setStartBal(String(acc.startingBalance));
      setCurrentBal(String(acc.netLiq));
    }
  }

  function reset() {
    setSent(false);
    setAccount("");
    setFirm("");
    setType("");
    setStartBal("");
    setCurrentBal("");
    setVideoUrl("");
    setCompliant(false);
    setNotes("");
    setShotName(null);
    setExportName(null);
  }

  return (
    <>
      <PageHead
        eyebrow="Milestones"
        title="Waypoints"
        sub="Log every funded pass, payout and benchmark. Verified waypoints chart your course up the tiers."
        actions={<span className="tag">{MILESTONES.length} on record</span>}
      />

      {/* summary strip */}
      <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
        <StatCard
          label="Approved"
          value={approved.length}
          tone="pos"
          sub="Verified by the desk"
          icon={<Trophy size={15} />}
        />
        <StatCard
          label="In review"
          value={pending.length}
          tone="signal"
          sub="Awaiting verification"
          icon={<Flag size={15} />}
        />
        <StatCard
          label="Rejected"
          value={rejected.length}
          tone="neg"
          sub="Resubmit required"
        />
        <StatCard
          label="Verified gain"
          value={usd(verifiedGain, { sign: true })}
          tone="pos"
          sub="Across approved waypoints"
        />
      </div>

      <div className="p-split" style={{ marginBottom: "1.2rem" }}>
        {/* ------------------------- submit form ------------------------- */}
        <Panel eyebrow="New entry" title="Submit a milestone">
          {sent ? (
            <div className="form__ok">
              <p className="eyebrow" style={{ justifyContent: "center", marginBottom: "1rem" }}>
                <span className="dot" /> Milestone submitted
              </p>
              <h3 className="display d-sm" style={{ marginBottom: "0.8rem" }}>
                Logged for review.
              </h3>
              <p className="muted" style={{ maxWidth: "44ch", margin: "0 auto 1rem" }}>
                Your {type ? <span className="accent">{type.toLowerCase()}</span> : "milestone"}
                {firm ? <> at <span className="accent">{firm}</span></> : null} is queued for desk
                verification. You&apos;ll be notified once it&apos;s confirmed.
              </p>
              {gainValid && (
                <div style={{ marginBottom: "1.2rem" }}>
                  <Pnl value={gain} sign />
                  <span className="muted" style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }}>
                    net gain reported
                  </span>
                </div>
              )}
              <button type="button" className="p-btn p-btn--ghost" onClick={reset}>
                Submit another
              </button>
            </div>
          ) : (
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="field">
                <label htmlFor="link">Link a funded account (optional)</label>
                <select
                  id="link"
                  value={account}
                  onChange={(e) => linkAccount(e.target.value)}
                >
                  <option value="">Manual entry…</option>
                  {ACCOUNTS.map((a: Account) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.firm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form__row">
                <div className="field">
                  <label htmlFor="firm">Capital platform / firm</label>
                  <input
                    id="firm"
                    list="firm-list"
                    value={firm}
                    onChange={(e) => setFirm(e.target.value)}
                    placeholder="Apex, Topstep…"
                    required
                  />
                  <datalist id="firm-list">
                    {firms.map((f: string) => (
                      <option key={f} value={f} />
                    ))}
                  </datalist>
                </div>
                <div className="field">
                  <label htmlFor="type">Milestone type</label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {MILESTONE_TYPES.map((t: string) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form__row">
                <div className="field">
                  <label htmlFor="start">Starting balance</label>
                  <input
                    id="start"
                    type="number"
                    inputMode="numeric"
                    value={startBal}
                    onChange={(e) => setStartBal(e.target.value)}
                    placeholder="50000"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="current">Current balance</label>
                  <input
                    id="current"
                    type="number"
                    inputMode="numeric"
                    value={currentBal}
                    onChange={(e) => setCurrentBal(e.target.value)}
                    placeholder="56720"
                    required
                  />
                </div>
              </div>

              {gainValid && (
                <div
                  className="p-row"
                  style={{
                    justifyContent: "space-between",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    padding: "0.7rem 0.9rem",
                    background: "rgba(0,0,0,0.15)",
                  }}
                >
                  <span className="p-stat__label">Net gain reported</span>
                  <Pnl value={gain} sign />
                </div>
              )}

              <div className="form__row">
                <div className="field">
                  <label>Dashboard screenshot</label>
                  <button
                    type="button"
                    className="p-btn p-btn--ghost"
                    style={{ width: "100%", justifyContent: "flex-start" }}
                    onClick={() => setShotName("dashboard-screenshot.png")}
                  >
                    {shotName ? <Check size={14} /> : <ImageIcon size={14} />}
                    {shotName ?? "Upload screenshot"}
                  </button>
                </div>
                <div className="field">
                  <label>Trade export (CSV)</label>
                  <button
                    type="button"
                    className="p-btn p-btn--ghost"
                    style={{ width: "100%", justifyContent: "flex-start" }}
                    onClick={() => setExportName("trade-export.csv")}
                  >
                    {exportName ? <Check size={14} /> : <FileSpreadsheet size={14} />}
                    {exportName ?? "Upload export"}
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="video">Video walkthrough URL (optional)</label>
                <input
                  id="video"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>

              <label
                className="p-row"
                style={{ gap: "0.6rem", alignItems: "flex-start", cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={compliant}
                  onChange={(e) => setCompliant(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--signal)", marginTop: 2 }}
                />
                <span style={{ fontSize: "0.82rem" }}>
                  I confirm this milestone was reached using only strategy-compliant configs &mdash;
                  no copy-trading, no manual overrides outside the published rules.
                </span>
              </label>

              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything the desk should know…"
                />
              </div>

              <button
                type="submit"
                className="p-btn p-btn--solid"
                style={{ width: "100%" }}
                disabled={!compliant}
              >
                Submit milestone
              </button>
              <p className="form__note">
                Every waypoint is verified by hand against your dashboard and trade export. Submitting
                a milestone you didn&apos;t reach within the rules forfeits standing.
              </p>
            </form>
          )}
        </Panel>

        {/* --------------------------- guidance --------------------------- */}
        <Panel eyebrow="Verification" title="What the desk checks">
          <div className="p-stack" style={{ gap: "0.9rem" }}>
            {[
              {
                icon: <ImageIcon size={15} />,
                t: "Dashboard screenshot",
                d: "Account ID, balance and trailing floor must be legible.",
              },
              {
                icon: <FileSpreadsheet size={15} />,
                t: "Trade export",
                d: "A full CSV so timestamps and sizing reconcile with signals.",
              },
              {
                icon: <ShieldCheck size={15} />,
                t: "Rule compliance",
                d: "No manual overrides or copy-trading outside published configs.",
              },
              {
                icon: <Link2 size={15} />,
                t: "Account match",
                d: "Firm and balances tie back to a linked Meridian account.",
              },
            ].map((row) => (
              <div key={row.t} className="p-row" style={{ gap: "0.7rem", alignItems: "flex-start" }}>
                <span
                  className="p-stat__icon"
                  style={{
                    width: 30,
                    height: 30,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    background: "rgba(204,100,55,0.12)",
                    color: "var(--signal)",
                    flexShrink: 0,
                  }}
                >
                  {row.icon}
                </span>
                <span>
                  <span style={{ display: "block", fontSize: "0.84rem", fontWeight: 500 }}>{row.t}</span>
                  <span className="muted" style={{ fontSize: "0.74rem" }}>{row.d}</span>
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "1.3rem",
              paddingTop: "1.1rem",
              borderTop: "1px solid var(--line)",
            }}
          >
            <span className="p-stat__label">Verified waypoints raise your standing</span>
            <div className="p-row" style={{ gap: "0.5rem", marginTop: "0.7rem" }}>
              <TierTag tier="Compass" />
              <span className="muted">→</span>
              <TierTag tier="Quadrant" />
              <span className="muted">→</span>
              <TierTag tier="Polaris" />
            </div>
          </div>
        </Panel>
      </div>

      {/* --------------------------- history table --------------------------- */}
      <Panel
        eyebrow="History"
        title="Previous submissions"
        action={<span className="tag">{approved.length} verified</span>}
      >
        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th>Status</th>
                <th>Firm</th>
                <th>Type</th>
                <th className="num">Balance</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {MILESTONES.map((m: Milestone) => (
                <tr key={m.id}>
                  <td>
                    <Badge tone={m.status === "Approved" ? "pos" : m.status === "Pending" ? "warn" : "neg"}>
                      {m.status}
                    </Badge>
                  </td>
                  <td style={{ fontWeight: 500 }}>{m.firm}</td>
                  <td className="muted">{m.type}</td>
                  <td className="num">
                    <span style={{ whiteSpace: "nowrap" }}>
                      {usd(m.startingBalance)} <span className="muted">→</span> {usd(m.currentBalance)}
                    </span>
                    <div style={{ marginTop: 2 }}>
                      <Pnl value={m.currentBalance - m.startingBalance} short sign />
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: "0.74rem", whiteSpace: "nowrap" }}>
                    {m.submittedAt}
                  </td>
                  <td className="muted" style={{ fontSize: "0.78rem" }}>
                    {m.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
