"use client";

import { useState } from "react";
import { Mail, Phone, Send, Inbox, CheckCircle2, XCircle, MessageSquare, Compass } from "lucide-react";
import { PageHead, Panel, Badge, TierTag, cn } from "@/portal/ui";
import { APPLICATIONS, APP_SOURCES, type Application, type AppStatus } from "@/portal/admin-data";

const STATUS_FILTERS = ["All", "Pending", "Contacted", "Approved", "Rejected"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const SOURCE_LABEL: Record<string, string> = {
  meta: "Meta Ads",
  google: "Google",
  direct: "Direct",
  referral: "Referral",
};

function statusTone(s: AppStatus): "pos" | "neg" | "warn" | "info" {
  return s === "Approved" ? "pos" : s === "Rejected" ? "neg" : s === "Pending" ? "warn" : "info";
}

const ACTIONS: { label: string; status: AppStatus; danger?: boolean }[] = [
  { label: "Pending", status: "Pending" },
  { label: "Contacted", status: "Contacted" },
  { label: "Approve", status: "Approved" },
  { label: "Reject", status: "Rejected", danger: true },
];

/* Reply composer — keyed per application so its local state resets on selection. */
function ReplyComposer({ app }: { app: Application }) {
  const [subject, setSubject] = useState<string>(`Your Meridian application · ${app.tier}`);
  const [body, setBody] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  if (sent) {
    return (
      <div className="form__ok">
        <CheckCircle2 size={22} style={{ color: "var(--color-up)", marginBottom: "0.6rem" }} />
        <p style={{ fontSize: "0.9rem", marginBottom: "0.2rem" }}>Reply sent to {app.name.split(" ")[0]}.</p>
        <p className="muted" style={{ fontSize: "0.76rem" }}>{app.email}</p>
        <button type="button" className="p-btn p-btn--ghost" style={{ marginTop: "1rem" }} onClick={() => setSent(false)}>
          Compose another
        </button>
      </div>
    );
  }

  return (
    <div className="form">
      <div className="field">
        <label>Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Hi ${app.name.split(" ")[0]}, thanks for applying to Meridian…`}
        />
      </div>
      <div className="p-row" style={{ justifyContent: "space-between" }}>
        <span className="muted mono" style={{ fontSize: "0.66rem" }}>To {app.email}</span>
        <button type="button" className="p-btn p-btn--solid" disabled={body.trim().length === 0} onClick={() => setSent(true)}>
          <Send size={13} /> Send reply
        </button>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>(() =>
    Object.fromEntries(APPLICATIONS.map((a) => [a.id, a.status])),
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(APPLICATIONS.map((a) => [a.id, a.notes])),
  );
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [source, setSource] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>(APPLICATIONS[0].id);

  const count = (f: StatusFilter): number =>
    f === "All" ? APPLICATIONS.length : APPLICATIONS.filter((a) => statuses[a.id] === f).length;

  const list = APPLICATIONS.filter((a) => {
    if (filter !== "All" && statuses[a.id] !== filter) return false;
    if (source && a.source !== source) return false;
    return true;
  });

  const selected: Application = APPLICATIONS.find((a) => a.id === selectedId) ?? APPLICATIONS[0];
  const selStatus: AppStatus = statuses[selected.id];

  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title="Applications"
        sub={`${count("Pending")} pending review · ${APPLICATIONS.length} total in the funnel.`}
        actions={<span className="tag">Updated live</span>}
      />

      {/* status filter — count cards */}
      <div className="p-row" style={{ flexWrap: "wrap", marginBottom: "1.1rem", alignItems: "stretch" }}>
        {STATUS_FILTERS.map((f) => {
          const on = filter === f;
          return (
            <button
              key={f}
              type="button"
              className="p-stat"
              onClick={() => setFilter(f)}
              style={{
                flex: "1 1 130px",
                textAlign: "left",
                cursor: "pointer",
                color: "inherit",
                borderColor: on ? "var(--signal)" : undefined,
                background: on ? "rgba(204,100,55,0.08)" : undefined,
              }}
            >
              <div className="p-stat__label">{f}</div>
              <div className="p-stat__value" style={{ color: on ? "var(--signal)" : undefined }}>{count(f)}</div>
            </button>
          );
        })}
      </div>

      {/* by-source pill row */}
      <div className="p-row" style={{ flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.2rem" }}>
        <span className="p-stat__label" style={{ marginRight: "0.2rem" }}>By source</span>
        <button
          type="button"
          className={cn("p-tab", source === null && "is-on")}
          style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "0.35rem 0.8rem" }}
          onClick={() => setSource(null)}
        >
          All
        </button>
        {APP_SOURCES.map((s) => {
          const n = APPLICATIONS.filter((a) => a.source === s).length;
          return (
            <button
              key={s}
              type="button"
              className={cn("p-tab", source === s && "is-on")}
              style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "0.35rem 0.8rem" }}
              onClick={() => setSource(source === s ? null : s)}
            >
              {SOURCE_LABEL[s] ?? s} · {n}
            </button>
          );
        })}
      </div>

      <div className="p-split">
        {/* LEFT — applications table */}
        <Panel eyebrow="Queue" title={`${list.length} application${list.length === 1 ? "" : "s"}`} pad={false}>
          {list.length === 0 ? (
            <div className="p-empty" style={{ padding: "2.4rem 1rem" }}>
              <div className="p-empty__icon"><Inbox size={22} /></div>
              <p className="p-empty__title">No applications match</p>
              <p className="muted">Adjust the status or source filters.</p>
            </div>
          ) : (
            <div className="ptable-wrap">
              <table className="ptable">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Source</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((a) => {
                    const on = a.id === selectedId;
                    const st = statuses[a.id];
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        style={{ cursor: "pointer", background: on ? "rgba(204,100,55,0.07)" : undefined }}
                      >
                        <td>
                          <div style={{ fontSize: "0.84rem", fontWeight: 500 }}>{a.name}</div>
                          <div className="muted" style={{ fontSize: "0.72rem" }}>{a.email}</div>
                        </td>
                        <td className="muted mono" style={{ fontSize: "0.72rem" }}>{SOURCE_LABEL[a.source] ?? a.source}</td>
                        <td className="muted mono" style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}>{a.submittedAt}</td>
                        <td><Badge tone={statusTone(st)}>{st}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* RIGHT — detail */}
        <Panel eyebrow={selected.id} title="Applicant detail" action={<TierTag tier={selected.tier} />}>
          {/* header */}
          <div className="p-row" style={{ gap: "0.7rem", marginBottom: "1rem" }}>
            <span className="p-side__avatar" style={{ width: 40, height: 40, background: "rgba(204,100,55,0.14)", color: "var(--signal)", fontFamily: "var(--font-display)" }}>
              {selected.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "0.96rem", fontWeight: 600 }}>{selected.name}</div>
              <div className="p-row" style={{ gap: "1rem", marginTop: "0.25rem" }}>
                <span className="muted p-row" style={{ gap: "0.35rem", fontSize: "0.74rem" }}><Mail size={12} /> {selected.email}</span>
              </div>
              <span className="muted p-row" style={{ gap: "0.35rem", fontSize: "0.74rem", marginTop: "0.2rem" }}><Phone size={12} /> {selected.phone}</span>
            </div>
          </div>

          {/* status actions */}
          <div className="p-stat__label" style={{ marginBottom: "0.5rem" }}>Set status</div>
          <div className="p-row" style={{ flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.3rem" }}>
            {ACTIONS.map((act) => {
              const on = selStatus === act.status;
              return (
                <button
                  key={act.status}
                  type="button"
                  className={cn("p-btn", on ? "p-btn--solid" : act.danger ? "p-btn--danger" : "p-btn--ghost")}
                  onClick={() => setStatuses((prev) => ({ ...prev, [selected.id]: act.status }))}
                >
                  {act.label === "Approve" && <CheckCircle2 size={13} />}
                  {act.label === "Reject" && <XCircle size={13} />}
                  {act.label}
                </button>
              );
            })}
          </div>

          {/* attribution */}
          <div style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "0.8rem 0.9rem", marginBottom: "1rem" }}>
            <div className="p-stat__label" style={{ marginBottom: "0.6rem" }}>Attribution</div>
            <div className="p-row" style={{ justifyContent: "space-between" }}>
              <span className="muted" style={{ fontSize: "0.78rem" }}>Source</span>
              <Badge tone="signal">{SOURCE_LABEL[selected.source] ?? selected.source}</Badge>
            </div>
            <div className="p-row" style={{ justifyContent: "space-between", marginTop: "0.5rem" }}>
              <span className="muted" style={{ fontSize: "0.78rem" }}>Submitted</span>
              <span className="mono" style={{ fontSize: "0.74rem" }}>{selected.submittedAt}</span>
            </div>
          </div>

          {/* application details */}
          <div style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "0.8rem 0.9rem", marginBottom: "1.3rem" }}>
            <div className="p-stat__label" style={{ marginBottom: "0.6rem" }}>Application details</div>
            <div className="p-stack" style={{ gap: "0.5rem" }}>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted p-row" style={{ gap: "0.35rem", fontSize: "0.78rem" }}><Compass size={12} /> Requested tier</span>
                <TierTag tier={selected.tier} />
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted" style={{ fontSize: "0.78rem" }}>Experience</span>
                <span style={{ fontSize: "0.8rem" }}>{selected.experience}</span>
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted" style={{ fontSize: "0.78rem" }}>Deploy on</span>
                <span style={{ fontSize: "0.8rem" }}>{selected.deploy}</span>
              </div>
            </div>
          </div>

          {/* reply composer */}
          <div className="p-row" style={{ gap: "0.4rem", marginBottom: "0.7rem" }}>
            <MessageSquare size={14} style={{ color: "var(--signal)" }} />
            <span className="p-panel__title" style={{ fontSize: "0.92rem" }}>Reply</span>
          </div>
          <ReplyComposer key={selected.id} app={selected} />

          {/* internal notes */}
          <div className="field" style={{ marginTop: "1.3rem" }}>
            <label>Internal notes</label>
            <textarea
              rows={3}
              value={notes[selected.id] ?? ""}
              placeholder="Visible to the operations team only…"
              onChange={(e) => setNotes((prev) => ({ ...prev, [selected.id]: e.target.value }))}
            />
          </div>
        </Panel>
      </div>
    </>
  );
}
