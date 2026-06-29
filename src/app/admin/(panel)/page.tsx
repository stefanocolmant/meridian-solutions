import Link from "next/link";
import { PageHead, Panel, StatCard, Badge, TierTag, cn } from "@/portal/ui";
import { ADMIN_KPIS, PIPELINE, ADMIN_ACTIVITY, APPLICATIONS, SUPPORT_THREADS } from "@/portal/admin-data";

export default function AdminHome() {
  const recentApps = APPLICATIONS.slice(0, 4);

  return (
    <>
      <PageHead
        eyebrow="Operations"
        title="Operations console"
        sub="Member lifecycle, applications and support — at a glance."
        actions={<Link href="/admin/applications" className="p-btn p-btn--solid">Review applications</Link>}
      />

      <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
        {ADMIN_KPIS.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} tone={k.tone} sub={k.delta} />
        ))}
      </div>

      <div className="p-split" style={{ marginBottom: "1.2rem" }}>
        <Panel eyebrow="Onboarding" title="Pipeline">
          <div className="p-grid-4" style={{ gap: "0.7rem" }}>
            {PIPELINE.map((stage) => (
              <div key={stage.key} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "0.7rem", background: "rgba(0,0,0,0.15)" }}>
                <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <span className="p-stat__label">{stage.label}</span>
                  <span className="mono" style={{ fontSize: "0.7rem", color: "var(--signal)" }}>{stage.members.length}</span>
                </div>
                <div className="p-stack" style={{ gap: "0.4rem" }}>
                  {stage.members.map((m, i) => (
                    <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "0.5rem 0.6rem" }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 500 }}>{m.name}</div>
                      <div className="p-row" style={{ justifyContent: "space-between", marginTop: "0.3rem" }}>
                        <TierTag tier={m.tier} />
                        <span className="muted mono" style={{ fontSize: "0.6rem" }}>{m.ago}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Live" title="Recent activity">
          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {ADMIN_ACTIVITY.map((a, i) => (
              <div key={i} className="p-row" style={{ padding: "0.6rem 0", borderBottom: i < ADMIN_ACTIVITY.length - 1 ? "1px solid var(--line)" : "none", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.82rem" }}><b>{a.who}</b> <span className="muted">{a.what}</span></span>
                <span className="muted mono" style={{ fontSize: "0.66rem" }}>{a.ago}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="p-grid-2">
        <Panel eyebrow="Inbox" title="New applications" action={<Link href="/admin/applications" className="p-copy">All</Link>}>
          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {recentApps.map((a) => (
              <div key={a.id} className="p-row" style={{ padding: "0.6rem 0", borderBottom: "1px solid var(--line)", justifyContent: "space-between", gap: "0.6rem" }}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "0.84rem", fontWeight: 500 }}>{a.name}</span>
                  <span className="muted" style={{ fontSize: "0.72rem" }}>{a.email}</span>
                </span>
                <span className="p-row" style={{ gap: "0.5rem" }}>
                  <TierTag tier={a.tier} />
                  <Badge tone={a.status === "Pending" ? "warn" : a.status === "Approved" ? "pos" : a.status === "Rejected" ? "neg" : "info"}>{a.status}</Badge>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Support" title="Open threads" action={<span className="p-badge neg">{SUPPORT_THREADS.filter((t) => t.unread).length} unread</span>}>
          <div className="p-stack" style={{ gap: "0.1rem" }}>
            {SUPPORT_THREADS.map((t) => (
              <div key={t.id} className="p-row" style={{ padding: "0.6rem 0", borderBottom: "1px solid var(--line)", gap: "0.6rem" }}>
                <span className={cn("p-side__avatar")} style={{ width: 30, height: 30, background: t.unread ? "rgba(204,100,55,0.16)" : "rgba(237,235,231,0.05)", color: t.unread ? "var(--signal)" : "var(--muted)" }}>
                  {t.member.split(" ").map((p) => p[0]).join("")}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "block", fontSize: "0.8rem", fontWeight: t.unread ? 600 : 400 }}>{t.member}</span>
                  <span className="muted" style={{ fontSize: "0.72rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{t.preview}</span>
                </span>
                <span className="muted mono" style={{ fontSize: "0.64rem" }}>{t.ago}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
