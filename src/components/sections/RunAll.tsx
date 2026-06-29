import { SectionHead } from "@/components/ui";

const POINTS = [
  "Nine configurations across different sessions, timeframes and conditions",
  "Largely uncorrelated — a flat day on one is often a green day on another",
  "Diversified exposure smooths the aggregate equity curve",
  "Same risk mechanisms on every signal, no extra screen time",
];

export function RunAll() {
  return (
    <section className="section is-cream">
      <div className="container">
        <div className="split-feature">
          <div data-reveal>
            <SectionHead
              eyebrow="The Scalprophecy advantage"
              title="Run all nine. Smooth the curve."
              intro="A single setup has good days and bad days. Run the whole suite together and the peaks and troughs offset — the combined curve is calmer than any one configuration alone."
              className="reveal"
            />
            <ul className="flow reveal" style={{ listStyle: "none", padding: 0, marginTop: "1.8rem" }}>
              {POINTS.map((p) => (
                <li key={p} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                  <span className="accent mono" style={{ lineHeight: 1.6 }}>→</span>
                  <span className="pretty">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="curve reveal" style={{ margin: 0 }} data-reveal>
            <div className="curve__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/curves/curve-3.jpg" alt="Aggregate hypothetical equity curve running all nine configurations" />
            </div>
            <figcaption className="curve__cap">
              <b>All 9 combined</b>
              <span>+$262,437 · PF 1.846 · 14/15 mo</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
