"use client";

import { useState, type ChangeEvent, type CSSProperties } from "react";
import { AlertTriangle, Save, Send, Archive } from "lucide-react";
import { PageHead, Panel, StatCard, Badge, TierTag, EmptyState, cn } from "@/portal/ui";
import {
  TESTIMONIALS_ADMIN,
  TESTIMONIAL_STAGES,
  type Testimonial,
  type Stage,
} from "@/portal/admin-data";

type BadgeTone = "pos" | "neg" | "warn" | "info" | "flat" | "signal";

const STAGE_TONE: Record<Stage, BadgeTone> = {
  "New interest": "info",
  "Brief sent": "info",
  "Awaiting video": "warn",
  "Compliance review": "signal",
  Approved: "pos",
  Published: "pos",
};

function consentTone(c: Testimonial["consent"]): BadgeTone {
  return c === "Signed" ? "pos" : c === "Pending" ? "warn" : "flat";
}

const COMPLIANCE_RULES: string[] = [
  "No publish without a signed consent form AND documented compliance approval.",
  "No P&L figures, dollar amounts, or performance metrics inside any member quote.",
  "Every published testimonial carries the equal-weight standardized-results disclaimer.",
  "Flag clearly that the result shown is not representative of all members.",
  "Disclose any compensation, discount, or incentive given for the testimonial.",
];

const TIERS = ["Compass", "Quadrant", "Polaris"] as const;

const selectStyle: CSSProperties = {
  background: "rgba(0,0,0,0.25)",
  border: "1px solid var(--line)",
  borderRadius: 8,
  color: "var(--text, inherit)",
  padding: "0.45rem 0.6rem",
  fontSize: "0.78rem",
  fontFamily: "var(--font-mono, monospace)",
  minWidth: 160,
};

export default function AdminTestimonialsPage() {
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>(TESTIMONIALS_ADMIN[0].id);
  const [draftStage, setDraftStage] = useState<Stage>(TESTIMONIALS_ADMIN[0].stage);
  const [notes, setNotes] = useState<string>("");
  const [flash, setFlash] = useState<string | null>(null);

  const counts = TESTIMONIAL_STAGES.map((stage: Stage) => ({
    stage,
    count: TESTIMONIALS_ADMIN.filter((t: Testimonial) => t.stage === stage).length,
  }));

  const filtered = TESTIMONIALS_ADMIN.filter(
    (t: Testimonial) =>
      (stageFilter === "all" || t.stage === stageFilter) &&
      (tierFilter === "all" || t.tier === tierFilter),
  );

  const selected = TESTIMONIALS_ADMIN.find((t: Testimonial) => t.id === selectedId) ?? null;

  function select(t: Testimonial): void {
    setSelectedId(t.id);
    setDraftStage(t.stage);
    setNotes("");
    setFlash(null);
  }

  return (
    <>
      <PageHead
        eyebrow="Compliance pipeline"
        title="Testimonials"
        sub="Move member stories through consent, review and approval before anything goes public."
        actions={<span className="tag">{TESTIMONIALS_ADMIN.length} records</span>}
      />

      {/* pipeline overview */}
      <div className="p-grid-3" style={{ marginBottom: "1.2rem" }}>
        {counts.map(({ stage, count }: { stage: Stage; count: number }) => (
          <StatCard
            key={stage}
            label={stage}
            value={count}
            sub="in stage"
            tone={stage === "Compliance review" ? "signal" : stage === "Published" || stage === "Approved" ? "pos" : "flat"}
          />
        ))}
      </div>

      {/* compliance callout */}
      <Panel
        eyebrow="Mandatory"
        title="Compliance gate"
        className="p-panel--alert"
        action={<Badge tone="neg">Required before publish</Badge>}
      >
        <div
          style={{
            border: "1px solid rgba(204,55,55,0.28)",
            background: "rgba(204,55,55,0.06)",
            borderRadius: 10,
            padding: "0.9rem 1rem",
          }}
        >
          <div className="p-row" style={{ gap: "0.5rem", marginBottom: "0.7rem", color: "#d76b5a" }}>
            <AlertTriangle size={16} />
            <span className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Five non-negotiable rules
            </span>
          </div>
          <ul className="p-stack" style={{ gap: "0.55rem", listStyle: "none", margin: 0, padding: 0 }}>
            {COMPLIANCE_RULES.map((rule: string, i: number) => (
              <li key={i} className="p-row" style={{ gap: "0.6rem", alignItems: "flex-start" }}>
                <span className="mono" style={{ color: "#d76b5a", marginTop: "0.15rem", fontSize: "0.7rem" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "0.82rem", lineHeight: 1.45 }}>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      {/* filters */}
      <div className="p-row" style={{ gap: "0.8rem", margin: "1.2rem 0", flexWrap: "wrap", alignItems: "flex-end" }}>
        <label className="field" style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span className="p-stat__label">Stage</span>
          <select
            value={stageFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStageFilter(e.target.value as Stage | "all")}
            style={selectStyle}
          >
            <option value="all">All stages</option>
            {TESTIMONIAL_STAGES.map((s: Stage) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="field" style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span className="p-stat__label">Tier</span>
          <select
            value={tierFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTierFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All tiers</option>
            {TIERS.map((t: string) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <span className="muted mono" style={{ fontSize: "0.7rem", marginLeft: "auto" }}>
          {filtered.length} of {TESTIMONIALS_ADMIN.length} shown
        </span>
      </div>

      {/* records + detail */}
      <div className="p-split">
        <Panel eyebrow="Records" title="Pipeline" pad={false}>
          {filtered.length === 0 ? (
            <div style={{ padding: "1rem" }}>
              <EmptyState title="No records match" body="Adjust the stage or tier filter to see testimonials." />
            </div>
          ) : (
            <div className="ptable-wrap">
              <table className="ptable">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Tier</th>
                    <th>Stage</th>
                    <th>Consent</th>
                    <th>Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t: Testimonial) => (
                    <tr
                      key={t.id}
                      onClick={() => select(t)}
                      className={cn(t.id === selectedId && "is-on")}
                      style={{
                        cursor: "pointer",
                        background: t.id === selectedId ? "rgba(204,100,55,0.08)" : undefined,
                      }}
                    >
                      <td>
                        <span style={{ display: "block", fontWeight: 500, fontSize: "0.82rem" }}>{t.member}</span>
                        <span className="muted mono" style={{ fontSize: "0.64rem" }}>{t.id}</span>
                      </td>
                      <td><TierTag tier={t.tier} /></td>
                      <td><Badge tone={STAGE_TONE[t.stage]}>{t.stage}</Badge></td>
                      <td><Badge tone={consentTone(t.consent)}>{t.consent}</Badge></td>
                      <td className="mono" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{t.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel eyebrow="Record" title={selected ? selected.member : "No selection"}>
          {selected ? (
            <div className="p-stack" style={{ gap: "1rem" }}>
              <div className="p-row" style={{ justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
                <TierTag tier={selected.tier} />
                <Badge tone={consentTone(selected.consent)}>Consent: {selected.consent}</Badge>
              </div>

              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="p-stat__label">Record</span>
                <span className="mono" style={{ fontSize: "0.72rem" }}>{selected.id}</span>
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="p-stat__label">Last updated</span>
                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{selected.updated}</span>
              </div>

              <label className="field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <span className="p-stat__label">Advance stage</span>
                <select
                  value={draftStage}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => { setDraftStage(e.target.value as Stage); setFlash(null); }}
                  style={{ ...selectStyle, minWidth: 0, width: "100%" }}
                >
                  {TESTIMONIAL_STAGES.map((s: Stage) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <span className="p-stat__label">Content &amp; review notes</span>
                <textarea
                  value={notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setNotes(e.target.value); setFlash(null); }}
                  rows={5}
                  placeholder="Approved quote copy, consent status, compliance notes…"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    color: "inherit",
                    padding: "0.6rem",
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              {flash && <Badge tone="pos">{flash}</Badge>}

              <div className="p-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="p-btn p-btn--solid"
                  onClick={() => setFlash(`Saved ${selected.id} → ${draftStage} (demo).`)}
                >
                  <Save size={14} /> Save
                </button>
                <button
                  type="button"
                  className="p-btn p-btn--ghost"
                  onClick={() => { setDraftStage("Brief sent"); setFlash(`Brief marked sent to ${selected.member} (demo).`); }}
                >
                  <Send size={14} /> Mark brief sent
                </button>
                <button
                  type="button"
                  className="p-btn p-btn--danger"
                  onClick={() => setFlash(`${selected.id} archived (demo).`)}
                >
                  <Archive size={14} /> Archive
                </button>
              </div>
            </div>
          ) : (
            <EmptyState title="Select a record" body="Pick a testimonial from the pipeline to review and advance it." />
          )}
        </Panel>
      </div>
    </>
  );
}
