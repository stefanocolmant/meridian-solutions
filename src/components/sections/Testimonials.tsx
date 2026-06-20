import { TESTIMONIALS } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Testimonials({ cream = true }: { cream?: boolean }) {
  const [lead, ...rest] = TESTIMONIALS;
  const rowA = rest;
  const rowB = [...rest].reverse();

  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <SectionHead eyebrow="In their words" title="The discipline is the product." className="reveal" />

        <div className="split-feature reveal" style={{ marginTop: "clamp(2rem,4vw,3rem)" }} data-reveal>
          <blockquote className="quote-lg" style={{ margin: 0 }} data-text-reveal>
            &ldquo;{lead.quote}&rdquo;
          </blockquote>
          <div className="reveal">
            <div className="tcard__by">
              <b>{lead.name}</b>
              <span>{lead.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* moving testimonial rows */}
      <div className="tmarquee marquee" style={{ marginTop: "clamp(2rem,4vw,3rem)" }} data-marquee data-marquee-speed="36">
        <div className="marquee_track">
          {[...rowA, ...rowA].map((t, i) => (
            <figure className="marquee_item tcard tcard--mq" key={`a${i}`}>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <figcaption className="tcard__by"><b>{t.name}</b><span>{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="tmarquee marquee" style={{ marginTop: "1rem" }} data-marquee data-marquee-dir="right" data-marquee-speed="30">
        <div className="marquee_track">
          {[...rowB, ...rowB].map((t, i) => (
            <figure className="marquee_item tcard tcard--mq" key={`b${i}`}>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <figcaption className="tcard__by"><b>{t.name}</b><span>{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
