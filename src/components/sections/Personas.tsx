"use client";

import { useState } from "react";
import { PERSONAS } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Personas({ cream = false }: { cream?: boolean }) {
  const [active, setActive] = useState(0);

  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <SectionHead
          eyebrow="Who it's for"
          title="Built for hands-off compounding."
          intro="One validated system that runs itself — signals fire automatically to your account, so you compound without babysitting charts. Hover a profile to see how Meridian fits."
          className="reveal"
        />

        <div className="personas" style={{ marginTop: "clamp(2rem,4vw,3rem)" }} data-reveal>
          <ul className="personas__list reveal">
            {PERSONAS.map((p, i) => (
              <li key={p.name}>
                <button
                  className={`personas__name ${i === active ? "is-on" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="personas__idx">{String(i + 1).padStart(2, "0")}</span>
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="personas__detail reveal" key={active}>
            <p className="personas__body pretty">{PERSONAS[active].body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
