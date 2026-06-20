import Link from "next/link";
import { Faq } from "@/components/Faq";
import { SectionHead } from "@/components/ui";

export function FaqSection({ limit, cream = false }: { limit?: number; cream?: boolean }) {
  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <div className="proc">
          <div className="proc__aside">
            <SectionHead
              eyebrow="Questions, answered"
              title="Everything you'd ask on the call."
              intro="Straight answers on how it works, what to expect, and where the limits are. If something's missing, ask us directly."
              className="reveal"
            />
            {limit && (
              <Link href="/faq" className="btn btn--ghost" style={{ marginTop: "1.8rem" }}>
                Read the full FAQ
              </Link>
            )}
          </div>
          <div data-reveal>
            <Faq limit={limit} />
          </div>
        </div>
      </div>
    </section>
  );
}
