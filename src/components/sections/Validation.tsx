import { VALIDATION, ASSET } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Validation() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Built on proof"
          title="Stress-tested three ways."
          intro={`Before a configuration ships, it has to survive a gauntlet. ${ASSET.validation}`}
          className="reveal"
        />
        <div className="grid-3" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }} data-cards>
          {VALIDATION.map((v) => (
            <article className="vcard" key={v.n}>
              <div className="vcard__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.image} alt={`${v.title} chart`} loading="lazy" />
              </div>
              <div className="vcard__body">
                <span className="idx">{v.n}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
