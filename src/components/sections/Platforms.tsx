import { PLATFORMS } from "@/content/data";

export function Platforms({ cream = false }: { cream?: boolean }) {
  return (
    <section className={`section section--tight ${cream ? "is-cream" : ""}`}>
      <div className="container" data-reveal>
        <p className="eyebrow reveal" style={{ marginBottom: "2.2rem" }}>
          <span className="dot" /> Works where you already trade
        </p>
      </div>
      <div className="marquee" data-marquee data-marquee-speed="38">
        <div className="marquee_track">
          {[...PLATFORMS, ...PLATFORMS].map((p, i) => (
            <span className="marquee_item plat" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="plat__logo" src={p.logo} alt={p.name} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
