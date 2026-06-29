"use client";

import { useMemo, useState } from "react";
import { Search, Mail, LifeBuoy, ArrowUpRight } from "lucide-react";
import { PageHead, Panel, EmptyState } from "@/portal/ui";
import { PORTAL_FAQ } from "@/portal/data";

const DESK_EMAIL = "desk@meridiansolutions.co";

export default function FaqPage() {
  const [open, setOpen] = useState<Set<string>>(() => new Set<string>(["0-0"]));
  const [query, setQuery] = useState<string>("");

  const q = query.trim().toLowerCase();

  const allKeys = useMemo<string[]>(
    () => PORTAL_FAQ.flatMap((cat, ci: number) => cat.items.map((_item, ii: number) => `${ci}-${ii}`)),
    [],
  );
  const totalItems = allKeys.length;

  const filtered = useMemo(() => {
    return PORTAL_FAQ.map((cat, ci: number) => ({
      ci,
      title: cat.title,
      items: cat.items
        .map((it, ii: number) => ({ it, ii }))
        .filter(({ it }) => !q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [q]);

  const matchCount = filtered.reduce((n: number, g) => n + g.items.length, 0);

  const isOpen = (key: string): boolean => (q ? true : open.has(key));

  const toggle = (key: string): void =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const jumpTo = (ci: number): void => {
    const el = document.getElementById(`topic-${ci}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHead
        eyebrow="Help"
        title="FAQ"
        sub={`${totalItems} answers across ${PORTAL_FAQ.length} topics — signals, safeguards and account setup.`}
        actions={
          <a href={`mailto:${DESK_EMAIL}`} className="p-btn p-btn--solid">
            <Mail size={14} /> Email the desk
          </a>
        }
      />

      {/* toolbar: search + bulk controls */}
      <div
        className="p-row"
        style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "1rem" }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 240, maxWidth: 420 }}>
          <Search
            size={15}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            aria-label="Search the FAQ"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "0.7rem 1rem 0.7rem 2.3rem",
              color: "var(--fg)",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
            }}
          />
        </div>
        <div className="p-row" style={{ gap: "0.5rem", alignItems: "center" }}>
          <span className="muted mono" style={{ fontSize: "0.7rem" }}>
            {q ? `${matchCount} match${matchCount === 1 ? "" : "es"}` : `${totalItems} answers`}
          </span>
          <button type="button" className="p-btn p-btn--ghost" onClick={() => setOpen(new Set(allKeys))}>
            Expand all
          </button>
          <button type="button" className="p-btn p-btn--ghost" onClick={() => setOpen(new Set<string>())}>
            Collapse all
          </button>
        </div>
      </div>

      {/* quick-jump chips (full list only) */}
      {!q && (
        <div className="p-row" style={{ flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.2rem" }}>
          {PORTAL_FAQ.map((cat, ci: number) => (
            <button
              key={ci}
              type="button"
              className="tag"
              onClick={() => jumpTo(ci)}
              style={{ cursor: "pointer", background: "transparent" }}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {/* categories */}
      {matchCount === 0 ? (
        <Panel pad>
          <EmptyState
            icon={<Search size={20} />}
            title="No matching answers"
            body={`Nothing matches your search. Try a different term, or email the desk and a human will answer.`}
          />
        </Panel>
      ) : (
        <div className="p-stack" style={{ gap: "1.2rem" }}>
          {filtered.map((g) => (
            <div id={`topic-${g.ci}`} key={g.ci}>
              <Panel
                eyebrow={`Topic ${String(g.ci + 1).padStart(2, "0")}`}
                title={g.title}
                action={
                  <span className="tag">
                    {g.items.length} {g.items.length === 1 ? "question" : "questions"}
                  </span>
                }
              >
                <div>
                  {g.items.map(({ it, ii }) => {
                    const key = `${g.ci}-${ii}`;
                    const openNow = isOpen(key);
                    return (
                      <div className="acc-item" data-open={openNow} key={key}>
                        <button
                          type="button"
                          className="acc-head"
                          onClick={() => toggle(key)}
                          aria-expanded={openNow}
                          style={{
                            padding: "1rem 0",
                            background: "transparent",
                            border: "none",
                            color: "inherit",
                            font: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.3 }}>{it.q}</span>
                          <span className="acc-icon" style={{ color: openNow ? "var(--signal)" : "var(--muted)" }} />
                        </button>
                        <div className="acc-body">
                          <div>
                            <p className="acc-answer" style={{ margin: 0 }}>
                              {it.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          ))}
        </div>
      )}

      {/* still-need-help footer */}
      <Panel className="p-faq-help" pad>
        <div
          className="p-row"
          style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}
        >
          <div className="p-row" style={{ gap: "0.8rem", alignItems: "center" }}>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(204,100,55,0.14)",
                color: "var(--signal)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              <LifeBuoy size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>Still need a hand?</div>
              <div className="muted" style={{ fontSize: "0.82rem" }}>
                The desk replies within one trading session — {DESK_EMAIL}.
              </div>
            </div>
          </div>
          <a href={`mailto:${DESK_EMAIL}`} className="p-btn p-btn--solid">
            <Mail size={14} /> Contact the desk <ArrowUpRight size={14} />
          </a>
        </div>
      </Panel>
    </>
  );
}
