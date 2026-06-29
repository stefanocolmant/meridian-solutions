"use client";

import { useState } from "react";
import { Lock, Play, CheckCircle2, ChevronDown, GraduationCap } from "lucide-react";
import { PageHead, Panel, ProgressBar, cn } from "@/portal/ui";
import { TRAINING, type TrainingModule } from "@/portal/data";

export default function TrainingPage() {
  const firstOpen = TRAINING.find((m: TrainingModule): boolean => !m.locked);
  const [openId, setOpenId] = useState<number | null>(firstOpen ? firstOpen.n : null);

  const totalVideos = TRAINING.reduce((sum: number, m: TrainingModule): number => sum + m.videos.length, 0);
  const doneVideos = TRAINING.reduce(
    (sum: number, m: TrainingModule): number => sum + m.videos.filter((v) => v.done).length,
    0,
  );
  const pctDone = Math.round((doneVideos / totalVideos) * 100);
  const modulesDone = TRAINING.filter((m: TrainingModule): boolean => !m.locked && m.videos.every((v) => v.done)).length;

  return (
    <>
      <PageHead
        eyebrow="Training"
        title="Academy"
        sub="Master the system module by module — from orientation to scaling funded accounts."
        actions={<span className="tag">{TRAINING.length} modules</span>}
      />

      {/* progress summary */}
      <Panel eyebrow="Your progress" title="Curriculum" action={<span className="mono accent" style={{ fontSize: "0.8rem" }}>{pctDone}% complete</span>}>
        <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.9rem", flexWrap: "wrap", gap: "0.8rem" }}>
          <div>
            <div className="p-stat__label">Videos watched</div>
            <div className="stat-num" style={{ fontSize: "2rem" }}>
              {doneVideos}<span className="muted" style={{ fontSize: "1.1rem" }}> / {totalVideos}</span>
            </div>
          </div>
          <div>
            <div className="p-stat__label">Modules complete</div>
            <div className="stat-num" style={{ fontSize: "2rem" }}>
              {modulesDone}<span className="muted" style={{ fontSize: "1.1rem" }}> / {TRAINING.length}</span>
            </div>
          </div>
          <div style={{ alignSelf: "center" }}>
            <span className="p-side__avatar" style={{ width: 44, height: 44, background: "rgba(204,100,55,0.16)", color: "var(--signal)" }}>
              <GraduationCap size={20} />
            </span>
          </div>
        </div>
        <ProgressBar value={doneVideos} max={totalVideos} tone="signal" />
      </Panel>

      {/* accordion of modules */}
      <div className="p-stack" style={{ gap: "0.7rem", marginTop: "1.2rem" }}>
        {TRAINING.map((mod: TrainingModule) => {
          const done = mod.videos.filter((v) => v.done).length;
          const total = mod.videos.length;
          const allDone = !mod.locked && done === total;
          const isOpen = !mod.locked && openId === mod.n;

          return (
            <section
              key={mod.n}
              className="p-panel"
              style={{ opacity: mod.locked ? 0.5 : 1, padding: 0 }}
            >
              <button
                type="button"
                onClick={() => {
                  if (mod.locked) return;
                  setOpenId((cur: number | null): number | null => (cur === mod.n ? null : mod.n));
                }}
                className="p-row"
                style={{
                  width: "100%",
                  gap: "0.9rem",
                  padding: "1rem 1.2rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: mod.locked ? "default" : "pointer",
                  color: "inherit",
                }}
                aria-expanded={isOpen}
                disabled={mod.locked}
              >
                <span
                  className="p-side__avatar"
                  style={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    background: mod.locked
                      ? "rgba(237,235,231,0.05)"
                      : allDone
                        ? "rgba(95,167,119,0.16)"
                        : "rgba(204,100,55,0.16)",
                    color: mod.locked ? "var(--muted)" : allDone ? "var(--color-up)" : "var(--signal)",
                  }}
                >
                  {mod.locked ? <Lock size={15} /> : <span className="mono" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{mod.n}</span>}
                </span>

                <span style={{ minWidth: 0, flex: 1 }}>
                  <span className="display d-sm" style={{ display: "block", fontSize: "1.05rem", lineHeight: 1.2 }}>{mod.title}</span>
                  <span className="muted mono" style={{ fontSize: "0.72rem" }}>
                    {mod.locked ? "Complete previous module to unlock" : `${done}/${total} videos`}
                  </span>
                </span>

                {allDone && (
                  <span className="p-badge pos" style={{ flexShrink: 0 }}>Complete</span>
                )}

                {!mod.locked && (
                  <ChevronDown
                    size={18}
                    style={{
                      flexShrink: 0,
                      opacity: 0.6,
                      transition: "transform 0.18s ease",
                      transform: isOpen ? "rotate(180deg)" : "none",
                    }}
                  />
                )}
              </button>

              {isOpen && (
                <div style={{ borderTop: "1px solid var(--line)", padding: "0.4rem 1.2rem 0.9rem" }}>
                  {mod.videos.map((v, i: number) => (
                    <div
                      key={i}
                      className="p-row"
                      style={{
                        gap: "0.8rem",
                        padding: "0.7rem 0",
                        borderBottom: i < mod.videos.length - 1 ? "1px solid var(--line)" : "none",
                      }}
                    >
                      <span
                        className="p-side__avatar"
                        style={{
                          width: 28,
                          height: 28,
                          flexShrink: 0,
                          background: v.done ? "rgba(95,167,119,0.16)" : "rgba(237,235,231,0.05)",
                          color: v.done ? "var(--color-up)" : "var(--muted)",
                        }}
                      >
                        {v.done ? <CheckCircle2 size={14} /> : <Play size={13} />}
                      </span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ display: "block", fontSize: "0.84rem", fontWeight: 500 }}>{v.title}</span>
                        <span className="muted" style={{ fontSize: "0.74rem" }}>{v.description}</span>
                      </span>
                      <span className={cn("mono", v.done && "pos")} style={{ fontSize: "0.64rem", flexShrink: 0, color: v.done ? "var(--color-up)" : "var(--muted)" }}>
                        {v.done ? "Watched" : "Watch"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
