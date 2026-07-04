import Link from "next/link";
import { PROCESS } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Process({ cream = false }: { cream?: boolean }) {
  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <div className="proc">
          <div className="proc__aside">
            <SectionHead
              eyebrow="Your step-by-step journey"
              title="From application to compounding."
              intro="Five clear steps from application to compounding. Most members run institutional capital first, then add a personal account once the engine pays for itself."
              size="d-md"
              className="reveal"
            />
            <Link href="/process" className="btn btn--ghost" style={{ marginTop: "1.8rem" }}>
              See the full process
            </Link>
          </div>

          <div className="proc__list" data-reveal="0.1">
            {PROCESS.map((s) => (
              <div className="proc__step reveal" key={s.n}>
                <div className="proc__n">{s.n}</div>
                <div>
                  <span className="proc__kicker mono">Step {s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
