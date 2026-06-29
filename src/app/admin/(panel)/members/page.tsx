"use client";

import { Fragment, useState } from "react";
import { Search, Cpu, Wallet, Users, ExternalLink, Pencil, PauseCircle } from "lucide-react";
import { PageHead, Panel, Badge, TierTag, EmptyState } from "@/portal/ui";
import { MEMBERS, type Member, type MemberStatus } from "@/portal/admin-data";

const STATUS_TONE: Record<MemberStatus, "pos" | "warn" | "info"> = {
  Active: "pos",
  Onboarding: "warn",
  Paused: "info",
};

export default function MembersPage() {
  const [query, setQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const rows: Member[] = q
    ? MEMBERS.filter(
        (m: Member) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.tier.toLowerCase().includes(q),
      )
    : MEMBERS;

  return (
    <>
      <PageHead
        eyebrow="Roster"
        title="Members"
        sub={`${MEMBERS.length} members across all tiers · click a row to manage.`}
        actions={<span className="tag">Live roster</span>}
      />

      <Panel
        eyebrow="Directory"
        title="All members"
        action={
          <div className="field" style={{ position: "relative", margin: 0, minWidth: 240 }}>
            <Search
              size={14}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or tier…"
              style={{ paddingLeft: 30, width: "100%" }}
            />
          </div>
        }
        pad={false}
      >
        {rows.length === 0 ? (
          <div style={{ padding: "1.2rem" }}>
            <EmptyState icon={<Users size={20} />} title="No members match" body="Try a different name, email or tier." />
          </div>
        ) : (
          <div className="ptable-wrap">
            <table className="ptable">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th className="num">Accounts</th>
                  <th>Joined</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m: Member) => {
                  const open = expandedId === m.id;
                  return (
                    <Fragment key={m.id}>
                      <tr
                        onClick={() => setExpandedId(open ? null : m.id)}
                        className={open ? "is-on" : undefined}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{m.name}</div>
                          <div className="muted" style={{ fontSize: "0.72rem" }}>{m.email}</div>
                        </td>
                        <td><TierTag tier={m.tier} /></td>
                        <td><Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge></td>
                        <td className="num mono">{m.accounts}</td>
                        <td className="muted mono" style={{ fontSize: "0.74rem" }}>{m.joined}</td>
                        <td>
                          <Badge tone={m.payment === "Current" ? "pos" : "neg"}>{m.payment}</Badge>
                        </td>
                      </tr>
                      {open && (
                        <tr className="is-on">
                          <td colSpan={6} style={{ background: "rgba(0,0,0,0.18)", padding: "1rem 1.1rem" }}>
                            <div className="p-row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                              <div className="p-row" style={{ gap: "2rem", flexWrap: "wrap" }}>
                                <div>
                                  <div className="p-stat__label p-row" style={{ gap: "0.35rem", alignItems: "center" }}>
                                    <Cpu size={12} /> Assigned algorithm
                                  </div>
                                  <div style={{ fontSize: "0.9rem", fontWeight: 500, marginTop: "0.25rem" }}>{m.algorithm}</div>
                                </div>
                                <div>
                                  <div className="p-stat__label p-row" style={{ gap: "0.35rem", alignItems: "center" }}>
                                    <Users size={12} /> Accounts
                                  </div>
                                  <div className="stat-num" style={{ fontSize: "1.3rem", marginTop: "0.15rem" }}>{m.accounts}</div>
                                </div>
                                <div>
                                  <div className="p-stat__label p-row" style={{ gap: "0.35rem", alignItems: "center" }}>
                                    <Wallet size={12} /> Payment
                                  </div>
                                  <div style={{ marginTop: "0.3rem" }}>
                                    <Badge tone={m.payment === "Current" ? "pos" : "neg"}>{m.payment}</Badge>
                                  </div>
                                </div>
                                <div>
                                  <div className="p-stat__label">Member ID</div>
                                  <div className="mono" style={{ fontSize: "0.82rem", marginTop: "0.3rem" }}>{m.id}</div>
                                </div>
                              </div>
                              <div className="p-row" style={{ gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                                <button type="button" className="p-btn p-btn--ghost">
                                  <ExternalLink size={13} /> Client view
                                </button>
                                <button type="button" className="p-btn p-btn--ghost">
                                  <Pencil size={13} /> Edit
                                </button>
                                <button type="button" className="p-btn p-btn--danger">
                                  <PauseCircle size={13} /> Pause
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
