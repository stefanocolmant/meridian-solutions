import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Validation } from "@/components/sections/Validation";
import { RiskMechanisms, NoBlackBox } from "@/components/sections/extras";
import { Cta } from "@/components/sections/Cta";
import { SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How Meridian Solutions is built — the mission, the four operational layers, and the validation philosophy behind every signal.",
};

const LAYERS = [
  { n: "01", t: "Algorithms", d: "Rules-based systems with no discretion at the point of execution. Entry, stop and target are defined by the model, not by mood." },
  { n: "02", t: "Methodology", d: "Edge first, then engineering. Each configuration earns its place by surviving out-of-sample validation — not by curve-fitting a pretty equity curve." },
  { n: "03", t: "Risk", d: "Four independent risk mechanisms sit on every signal: fixed stops, session limits, exposure caps and a hard daily ceiling." },
  { n: "04", t: "Deployment", d: "Chart templates and webhooks route signals to your platform. You hold the account; we never touch a dollar of capital." },
];

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Methodology"
        title="Discipline, engineered."
        lead="Meridian exists to remove the most expensive variable in trading — the trader's own impulses — by handing disciplined people a framework that has already proven itself."
        bg="/bg/cloud-1.webp"
      />

      {/* mission / story */}
      <section className="section">
        <div className="container">
          <div className="split-feature">
            <div data-reveal>
              <p className="eyebrow reveal"><span className="dot" /> Why we built it</p>
              <h2 className="display d-md reveal balance" data-split style={{ marginTop: "1.1rem" }}>
                Good traders lose to themselves.
              </h2>
            </div>
            <div className="flow reveal" data-reveal>
              <p className="lead muted pretty">
                We watched it happen for years — talented people with a real edge, undone by the
                moment-to-moment decisions in front of a live chart. Hesitation, revenge trades,
                moving a stop &ldquo;just this once.&rdquo;
              </p>
              <p className="muted pretty">
                Meridian started as an answer to that problem: encode the plan so completely that
                there&apos;s nothing left to second-guess. Every signal arrives finished. Your job
                is execution, not invention. We license that framework to traders who want the
                discipline without rebuilding it from scratch — and we gate access by application
                so the community stays serious.
              </p>
              <p className="muted pretty">
                We are a software and education company. We are not a broker, not a fund, and not a
                manager of anyone&apos;s money. That line never moves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* four layers */}
      <section className="section is-cream">
        <div className="container">
          <SectionHead eyebrow="The architecture" title="Four operational layers." className="reveal" />
          <div className="grid-4" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }} data-cards>
            {LAYERS.map((l) => (
              <div className="card" key={l.n} style={{ padding: "clamp(1.4rem,2.4vw,2rem)" }}>
                <span className="idx">{l.n}</span>
                <h3 className="display" style={{ fontSize: "clamp(1.3rem,2vw,1.7rem)", margin: "1rem 0 0.7rem" }}>{l.t}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>{l.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RiskMechanisms />
      <Validation />
      <NoBlackBox />
      <Cta title="See if it's a fit." body="Methodology only matters if you'll follow it. Apply and we'll find out together on the call." />
    </>
  );
}
