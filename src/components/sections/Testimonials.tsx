import { TESTIMONIALS } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Testimonials({ cream = true }: { cream?: boolean }) {
  const [lead, ...rest] = TESTIMONIALS;
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

        <div className="grid-2" style={{ marginTop: "clamp(1.5rem,3vw,2.5rem)" }} data-reveal="0.1">
          {rest.slice(0, 4).map((t) => (
            <figure className="tcard reveal" key={t.name + t.role} style={{ margin: 0 }}>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <figcaption className="tcard__by">
                <b>{t.name}</b>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
