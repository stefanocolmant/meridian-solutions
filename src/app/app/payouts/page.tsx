"use client";

import { useState } from "react";
import { HandCoins, Clock3, FileText, CheckCircle2, X } from "lucide-react";
import { PageHead, Panel, StatCard, Badge } from "@/portal/ui";
import { usd } from "@/portal/format";
import { PAYOUTS, PAYOUT_SUMMARY, ACCOUNTS, type Payout } from "@/portal/data";

const STATUS_TONE: Record<Payout["status"], "pos" | "warn" | "neg"> = {
  Paid: "pos",
  Pending: "warn",
  Rejected: "neg",
};

export default function PayoutsPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [account, setAccount] = useState(ACCOUNTS[0].name);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowForm(false);
    setSubmitted(true);
    setAmount("");
    setNotes("");
  }

  return (
    <>
      <PageHead
        eyebrow="Withdrawals"
        title="Payouts"
        sub="Request withdrawals from your funded accounts and track every disbursement."
        actions={
          <button
            type="button"
            className="p-btn p-btn--solid"
            onClick={() => {
              setSubmitted(false);
              setShowForm((v) => !v);
            }}
          >
            {showForm ? "Close" : "Request payout"}
          </button>
        }
      />

      {submitted && (
        <div
          className="p-panel"
          style={{
            display: "flex",
            gap: "0.7rem",
            alignItems: "center",
            padding: "0.75rem 1rem",
            marginBottom: "1.2rem",
            borderColor: "var(--color-up)",
          }}
        >
          <CheckCircle2 size={17} style={{ color: "var(--color-up)", flexShrink: 0 }} />
          <span style={{ fontSize: "0.85rem" }}>
            Payout request submitted for review. The desk will confirm within 1&ndash;2 business days.
          </span>
          <button
            type="button"
            className="p-copy"
            style={{ marginLeft: "auto" }}
            onClick={() => setSubmitted(false)}
          >
            <X size={14} /> Dismiss
          </button>
        </div>
      )}

      <div className="p-grid-3" style={{ marginBottom: "1.2rem" }}>
        <StatCard
          label="Total paid"
          value={usd(PAYOUT_SUMMARY.totalPaid)}
          tone="pos"
          sub="Lifetime disbursed"
          icon={<HandCoins size={15} />}
        />
        <StatCard
          label="Pending"
          value={usd(PAYOUT_SUMMARY.pending)}
          tone={PAYOUT_SUMMARY.pending > 0 ? "signal" : "flat"}
          sub="Awaiting review"
          icon={<Clock3 size={15} />}
        />
        <StatCard
          label="Requests"
          value={PAYOUT_SUMMARY.requests}
          sub="All time"
          icon={<FileText size={15} />}
        />
      </div>

      {showForm && (
        <Panel
          eyebrow="New request"
          title="Request a payout"
          className="p-stack"
          action={<span className="tag">Demo</span>}
        >
          <form className="form" onSubmit={onSubmit}>
            <div className="form__row">
              <label className="field">
                <span className="field__label">Account</span>
                <select
                  className="field__input"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                >
                  {ACCOUNTS.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field__label">Amount (USD)</span>
                <input
                  className="field__input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={100}
                  placeholder="2,500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </label>
            </div>
            <label className="field">
              <span className="field__label">Notes</span>
              <textarea
                className="field__input"
                rows={3}
                placeholder="Optional context for the desk (e.g. monthly draw)."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="p-row" style={{ justifyContent: "flex-end", gap: "0.6rem" }}>
              <button type="button" className="p-btn p-btn--ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="p-btn p-btn--solid">
                Submit request
              </button>
            </div>
          </form>
        </Panel>
      )}

      <Panel
        eyebrow="Ledger"
        title="Payout history"
        action={<span className="muted mono" style={{ fontSize: "0.7rem" }}>{PAYOUTS.length} records</span>}
        pad={false}
      >
        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th>Status</th>
                <th>Date</th>
                <th>Account</th>
                <th className="num">Amount</th>
                <th>Notes</th>
                <th>Paid on</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p: Payout) => (
                <tr key={p.id}>
                  <td>
                    <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="mono">{p.requestedAt}</td>
                  <td>{p.account}</td>
                  <td className="num">{usd(p.amount)}</td>
                  <td className="muted">{p.notes || "—"}</td>
                  <td className="mono">{p.paidAt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
