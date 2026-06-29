"use client";

import { useState } from "react";
import { Newspaper, ExternalLink, Sparkles, Filter, Radio } from "lucide-react";
import { PageHead, Panel, Badge, EmptyState, cn } from "@/portal/ui";
import { NEWS, NEWS_TAGS, type NewsArticle } from "@/portal/data";

export default function NewsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const visible: NewsArticle[] =
    selectedTag === "All" ? NEWS : NEWS.filter((a) => a.tags.includes(selectedTag));

  const highCount = NEWS.filter((a) => a.relevance >= 8).length;
  const sources = Array.from(new Set(NEWS.map((a) => a.source)));
  const sourceCounts = sources
    .map((s) => ({ source: s, count: NEWS.filter((a) => a.source === s).length }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <PageHead
        eyebrow="Live news"
        title="Dispatches"
        sub="Market-moving headlines filtered for the instruments and macro events that drive your configs."
        actions={
          <span className="tag">
            <Radio size={12} /> {NEWS.length} live
          </span>
        }
      />

      {/* filter chip row */}
      <Panel pad={false}>
        <div
          className="p-row"
          style={{ flexWrap: "wrap", gap: "0.45rem", padding: "0.85rem 1rem", alignItems: "center" }}
        >
          <span className="p-stat__label p-row" style={{ gap: "0.4rem", marginRight: "0.4rem" }}>
            <Filter size={13} /> Tags
          </span>
          {NEWS_TAGS.map((tag: string) => {
            const on = tag === selectedTag;
            return (
              <button
                key={tag}
                type="button"
                className="tag"
                onClick={() => setSelectedTag(tag)}
                aria-pressed={on}
                style={{
                  cursor: "pointer",
                  background: on ? "var(--signal)" : "transparent",
                  borderColor: on ? "var(--signal)" : "var(--line)",
                  color: on ? "#0b0b0b" : "var(--muted)",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="p-split" style={{ marginTop: "1.2rem" }}>
        {/* article feed */}
        <div className="p-stack" style={{ gap: "1rem" }}>
          {visible.length === 0 ? (
            <Panel pad>
              <EmptyState
                icon={<Newspaper size={20} />}
                title="No dispatches for this tag"
                body="Nothing tagged here right now. Switch back to All to see the full feed."
              />
            </Panel>
          ) : (
            visible.map((a: NewsArticle) => (
              <Panel pad key={a.id}>
                <div className="p-row" style={{ justifyContent: "space-between", alignItems: "center", gap: "0.6rem" }}>
                  <span className="p-row" style={{ gap: "0.6rem", alignItems: "center" }}>
                    <span className="tag">{a.source}</span>
                    <span className="muted mono" style={{ fontSize: "0.66rem" }}>{a.ago}</span>
                  </span>
                  {a.relevance >= 8 && (
                    <Badge tone="signal">
                      <Sparkles size={11} style={{ marginRight: 4 }} /> High relevance
                    </Badge>
                  )}
                </div>

                <h3 className="display d-sm" style={{ fontSize: "1.25rem", margin: "0.7rem 0 0.45rem" }}>
                  {a.title}
                </h3>
                <p className="muted" style={{ fontSize: "0.86rem", lineHeight: 1.55, margin: 0 }}>
                  {a.summary}
                </p>

                <div className="p-row" style={{ flexWrap: "wrap", gap: "0.4rem", marginTop: "0.9rem" }}>
                  {a.tags.map((t: string) => {
                    const on = t === selectedTag;
                    return (
                      <button
                        key={t}
                        type="button"
                        className="tag"
                        onClick={() => setSelectedTag(t)}
                        style={{
                          cursor: "pointer",
                          background: on ? "rgba(204,100,55,0.16)" : "transparent",
                          borderColor: on ? "var(--signal)" : "var(--line)",
                          color: on ? "var(--signal)" : "var(--muted)",
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <div
                  className="p-row"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                    paddingTop: "0.8rem",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  <span className="muted mono" style={{ fontSize: "0.66rem" }}>
                    Relevance {a.relevance}/10
                  </span>
                  <a
                    href="#"
                    className="p-copy"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    Read source <ExternalLink size={13} />
                  </a>
                </div>
              </Panel>
            ))
          )}
        </div>

        {/* aside — feed summary */}
        <div className="p-stack" style={{ gap: "1rem" }}>
          <Panel eyebrow="Feed" title="Coverage">
            <div className="p-grid-2" style={{ gap: "0.7rem" }}>
              <div>
                <div className="p-stat__label">Dispatches</div>
                <div className="stat-num" style={{ fontSize: "1.7rem" }}>{NEWS.length}</div>
              </div>
              <div>
                <div className="p-stat__label">High relevance</div>
                <div className="stat-num signal" style={{ fontSize: "1.7rem", color: "var(--signal)" }}>{highCount}</div>
              </div>
              <div>
                <div className="p-stat__label">Showing</div>
                <div className="stat-num" style={{ fontSize: "1.7rem" }}>{visible.length}</div>
              </div>
              <div>
                <div className="p-stat__label">Sources</div>
                <div className="stat-num" style={{ fontSize: "1.7rem" }}>{sources.length}</div>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Wire" title="By source">
            <div className="p-stack" style={{ gap: "0.1rem" }}>
              {sourceCounts.map((s, i: number) => (
                <div
                  key={s.source}
                  className="p-row"
                  style={{
                    justifyContent: "space-between",
                    padding: "0.55rem 0",
                    borderBottom: i < sourceCounts.length - 1 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <span style={{ fontSize: "0.82rem" }}>{s.source}</span>
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--signal)" }}>{s.count}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel pad>
            <div className="p-row" style={{ gap: "0.6rem", alignItems: "flex-start" }}>
              <span className={cn("p-side__avatar")} style={{ width: 30, height: 30, background: "rgba(204,100,55,0.16)", color: "var(--signal)", flexShrink: 0 }}>
                <Sparkles size={14} />
              </span>
              <p className="muted" style={{ fontSize: "0.78rem", lineHeight: 1.5, margin: 0 }}>
                Relevance is scored against your active instruments and session configs. Items at 8+ are
                flagged so you never miss a catalyst.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
