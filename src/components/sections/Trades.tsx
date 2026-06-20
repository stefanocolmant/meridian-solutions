"use client";

import { useEffect, useState } from "react";
import { SectionHead } from "@/components/ui";

const TRADES = Array.from({ length: 18 }, (_, i) => `/trades/trade-${String(i + 1).padStart(2, "0")}.jpg`);

export function Trades() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  const row = (items: string[], dir?: "right", speed = 44, key = "a") => (
    <div className="marquee" data-marquee data-marquee-dir={dir} data-marquee-speed={speed}>
      <div className="marquee_track">
        {items.map((src, i) => (
          <button
            key={`${key}${i}`}
            className="marquee_item trades__item"
            onClick={() => setActive(src)}
            aria-label="View member trade signal"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Member trade signal" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Signals, executed"
          title="The system, firing on real charts."
          intro="A rolling wall of signals landing on members' platforms — entry, stop and target drawn before the candle closes. Tap any to enlarge. Hypothetical / educational; results not typical."
          className="reveal"
        />
      </div>

      <div style={{ marginTop: "clamp(2.5rem,4vw,3.5rem)" }}>
        {row([...TRADES, ...TRADES.slice(0, 6)], undefined, 44, "a")}
      </div>
      <div style={{ marginTop: "1rem" }}>
        {row([...TRADES.slice().reverse(), ...TRADES.slice(6, 12)], "right", 38, "b")}
      </div>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label="Trade signal">
          <button className="lightbox__close" onClick={() => setActive(null)} aria-label="Close">✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active} alt="Member trade signal — enlarged" onClick={(e) => e.stopPropagation()} />
          <p className="lightbox__cap mono">Member screenshot · hypothetical / educational — not a guarantee of results</p>
        </div>
      )}
    </section>
  );
}
