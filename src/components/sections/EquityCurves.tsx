import { ALGOS } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function EquityCurves() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Hypothetical equity"
          title="Fifteen months, three curves."
          intro="Modeled growth across the 15-month validation window for each tier. Hypothetical and educational — results are not typical and not a live account."
          className="reveal"
        />
        <div className="grid-3" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }} data-cards>
          {ALGOS.map((a) => (
            <figure className="curve" key={a.key} style={{ margin: 0 }}>
              <div className="curve__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.curve} alt={`${a.name} hypothetical equity curve`} loading="lazy" />
              </div>
              <figcaption className="curve__cap">
                <b>{a.name}</b>
                <span>{a.netPnl} · PF {a.profitFactor}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
