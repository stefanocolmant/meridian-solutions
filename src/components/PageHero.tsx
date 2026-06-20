import React from "react";

export function PageHero({
  eyebrow,
  title,
  lead,
  bg = "/bg/nebula-1.webp",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  bg?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="phero">
      {bg && (
        <div className="phero__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bg} alt="" data-parallax="0.1" />
        </div>
      )}
      <div className="container">
        <p className="eyebrow"><span className="dot" /> {eyebrow}</p>
        <h1 className="display d-xl phero__title balance" data-split data-split-load>
          {title}
        </h1>
        {lead && <p className="lead phero__lead muted pretty">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
