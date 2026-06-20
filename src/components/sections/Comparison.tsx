import { COMPARE } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Comparison({ cream = true }: { cream?: boolean }) {
  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <SectionHead
          eyebrow="Why we're different"
          title="Better than the rest."
          intro="Most retail algorithms are one trick, over-fit, and quietly martingale their way to a blow-up. Meridian was built the opposite way."
          className="reveal"
        />
        <div className="cmp reveal" style={{ marginTop: "clamp(2rem,4vw,3rem)" }} data-reveal>
          <div className="cmp__head">
            <div className="them">{COMPARE.themLabel}</div>
            <div className="us">{COMPARE.usLabel}</div>
          </div>
          {COMPARE.rows.map((r) => (
            <div className="cmp__row" key={r.us}>
              <div className="them">{r.them}</div>
              <div className="us">{r.us}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
