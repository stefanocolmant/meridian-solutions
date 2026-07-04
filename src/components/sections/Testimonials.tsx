"use client";

import { useEffect, useState } from "react";
import { TESTIMONIALS, DISCLOSURES } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Testimonials({ cream = true }: { cream?: boolean }) {
  const rotation = TESTIMONIALS;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [nudge, setNudge] = useState(0);

  // The headline quote auto-rotates through every testimonial rather than
  // sitting on one the whole time. Pauses on hover/focus; stays still on
  // reduced-motion. A manual pick (dot) restarts the timer via `nudge`.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % rotation.length), 5600);
    return () => clearInterval(id);
  }, [paused, rotation.length, nudge]);

  const lead = rotation[i];
  const rowA = TESTIMONIALS;
  const rowB = [...TESTIMONIALS].reverse();

  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <SectionHead eyebrow="In their words" title="The discipline is the product." className="reveal" />

        <div
          className="split-feature reveal tquote"
          style={{ marginTop: "clamp(2rem,4vw,3rem)" }}
          data-reveal
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
        >
          <blockquote className="quote-lg tquote__q" style={{ margin: 0 }} key={`q${i}`}>
            &ldquo;{lead.quote}&rdquo;
          </blockquote>
          <div className="tquote__meta">
            <div className="tcard__by" key={`by${i}`}>
              <b>{lead.name}</b>
              <span>{lead.role}</span>
            </div>
            <div className="tquote__dots" role="group" aria-label="Choose a testimonial">
              {rotation.map((t, d) => (
                <button
                  key={t.name}
                  type="button"
                  className={`tquote__dot ${d === i ? "is-on" : ""}`}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-pressed={d === i}
                  onClick={() => { setI(d); setNudge((n) => n + 1); }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* moving testimonial rows */}
      <div className="tmarquee marquee" style={{ marginTop: "clamp(2rem,4vw,3rem)" }} data-marquee data-marquee-speed="36">
        <div className="marquee_track">
          {[...rowA, ...rowA].map((t, idx) => (
            <figure className="marquee_item tcard tcard--mq" key={`a${idx}`}>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <figcaption className="tcard__by"><b>{t.name}</b><span>{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="tmarquee marquee" style={{ marginTop: "1rem" }} data-marquee data-marquee-dir="right" data-marquee-speed="30">
        <div className="marquee_track">
          {[...rowB, ...rowB].map((t, idx) => (
            <figure className="marquee_item tcard tcard--mq" key={`b${idx}`}>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <figcaption className="tcard__by"><b>{t.name}</b><span>{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="container" style={{ marginTop: "clamp(1.6rem,3vw,2.5rem)" }}>
        <p className="mono muted" style={{ fontSize: "0.7rem", maxWidth: "72ch", letterSpacing: "0.02em" }}>
          {DISCLOSURES.testimonial}
        </p>
      </div>
    </section>
  );
}
