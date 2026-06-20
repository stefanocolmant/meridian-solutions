import { AUDIENCE } from "@/content/data";

export function Audience() {
  return (
    <section className="section--tight" style={{ borderBlock: "1px solid var(--line)" }}>
      <div className="marquee audience-marquee" data-marquee data-marquee-speed="48">
        <div className="marquee_track">
          {[...AUDIENCE, ...AUDIENCE].map((a, i) => (
            <span className="marquee_item" key={i}>
              {a}
              <span className="dotsep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
