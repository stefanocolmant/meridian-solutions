import { ExternalLink } from "lucide-react";
import { PageHead } from "@/portal/ui";
import { QUICK_LINKS, type QuickLink } from "@/portal/data";

export default function QuickLinksPage() {
  // Preserve first-seen group order (deterministic — no sorting on render data).
  const groups: string[] = [];
  for (const link of QUICK_LINKS) {
    if (!groups.includes(link.group)) groups.push(link.group);
  }

  return (
    <>
      <PageHead
        eyebrow="Resources"
        title="Quick Links"
        sub="Bookmarks for the platforms and tools the desk runs on — opens in a new tab."
        actions={<span className="tag">{QUICK_LINKS.length} links</span>}
      />

      {groups.map((group: string) => {
        const links = QUICK_LINKS.filter((l: QuickLink) => l.group === group);
        return (
          <section key={group} style={{ marginBottom: "1.8rem" }}>
            <div
              className="p-row"
              style={{ justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.9rem" }}
            >
              <h2 className="display d-sm" style={{ fontSize: "1.3rem" }}>{group}</h2>
              <span className="muted mono" style={{ fontSize: "0.66rem" }}>
                {links.length} {links.length === 1 ? "link" : "links"}
              </span>
            </div>

            <div className="p-grid-3">
              {links.map((l: QuickLink) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card"
                  style={{ display: "block", padding: "1.1rem 1.15rem", textDecoration: "none" }}
                >
                  <div
                    className="p-row"
                    style={{ justifyContent: "space-between", alignItems: "flex-start", gap: "0.8rem" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        textTransform: "uppercase",
                        letterSpacing: "-0.01em",
                        fontSize: "1.05rem",
                        color: "var(--fg)",
                      }}
                    >
                      {l.title}
                    </span>
                    <ExternalLink
                      size={15}
                      style={{ color: "var(--muted)", flex: "none", marginTop: 2 }}
                    />
                  </div>
                  <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.45rem" }}>
                    {l.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
