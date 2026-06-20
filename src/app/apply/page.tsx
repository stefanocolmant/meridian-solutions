import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ApplyForm } from "@/components/ApplyForm";
import { Cta } from "@/components/sections/Cta";

export const metadata: Metadata = {
  title: "Apply for access",
  description: "Apply to license the Meridian systems or book a demo. Applications are reviewed by hand.",
};

const STEPS = [
  { n: "01", t: "Apply", d: "Tell us where you are and how you'll deploy. Two minutes." },
  { n: "02", t: "Review", d: "We read every application by hand — this is a qualification step, not a sales funnel." },
  { n: "03", t: "Onboarding call", d: "If it's a fit, we book a 1-on-1 to set up templates, webhooks and risk." },
  { n: "04", t: "Go live", d: "Run your first signals on a prop-firm or personal account, fully supported." },
];

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply · Book a demo"
        title="This isn't for everyone."
        lead="Meridian is application-based. If you want to execute a documented plan instead of trading on instinct, start here — and we'll take it from the top."
        bg="/bg/nebula-1.webp"
      />

      <section className="section" style={{ paddingTop: "clamp(24px,3vw,48px)" }}>
        <div className="container">
          <div className="split-feature" style={{ alignItems: "start" }}>
            <div style={{ position: "sticky", top: "120px" }}>
              <ApplyForm />
            </div>

            <div data-reveal>
              <p className="eyebrow reveal"><span className="dot" /> What happens next</p>
              <div className="proc__list reveal" style={{ marginTop: "1.4rem" }}>
                {STEPS.map((s) => (
                  <div className="proc__step" key={s.n}>
                    <div className="proc__n">{s.n}</div>
                    <div>
                      <h3>{s.t}</h3>
                      <p>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card reveal" style={{ padding: "1.4rem", marginTop: "1.6rem" }}>
                <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                  We provide software and education only. Meridian never holds, accesses, or manages
                  your capital, and access is offered — not guaranteed. Trading futures carries
                  substantial risk of loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Cta eyebrow="Prefer to look first?" title="See the performance." body="Walk the numbers, the equity curves and the stress tests before you apply. No email required." />
    </>
  );
}
