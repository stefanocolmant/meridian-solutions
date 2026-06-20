import React from "react";

/** Eyebrow + display heading + optional intro, used to open most sections. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  align = "left",
  size = "d-md",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  size?: "d-lg" | "d-md" | "d-sm";
  className?: string;
}) {
  return (
    <div
      className={`sec-head ${align === "center" ? "sec-head--center" : ""} ${className}`}
      data-reveal
    >
      {eyebrow && (
        <p className="eyebrow reveal"><span className="dot" /> {eyebrow}</p>
      )}
      <h2 className={`display ${size} reveal balance`} data-split>
        {title}
      </h2>
      {intro && <p className="lead muted reveal pretty sec-head__intro">{intro}</p>}
    </div>
  );
}

/** A bordered eyebrow tag (mono). */
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}
