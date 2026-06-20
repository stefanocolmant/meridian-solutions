import { PILLARS } from "@/content/data";

export function Pillars() {
  return (
    <section className="section--tight">
      <div className="container">
        <div className="pillars" data-reveal="0.12">
          {PILLARS.map((p) => (
            <div className="pillar reveal" key={p.label}>
              <div className="stat-num">{p.stat}</div>
              <h3>{p.label}</h3>
              <p>{p.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
