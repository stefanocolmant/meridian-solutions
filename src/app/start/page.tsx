import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SignalTicker } from "@/components/SignalTicker";
import { ApplyForm } from "@/components/ApplyForm";
import { Platforms } from "@/components/sections/Platforms";
import { Pillars } from "@/components/sections/Pillars";
import { AlgoTiers } from "@/components/sections/AlgoTiers";
import { RunAll } from "@/components/sections/RunAll";
import { StatsBand } from "@/components/sections/StatsBand";
import { EquityCurves } from "@/components/sections/EquityCurves";
import { Validation } from "@/components/sections/Validation";
import { Deploy } from "@/components/sections/Deploy";
import { Process } from "@/components/sections/Process";
import { WhyProp } from "@/components/sections/WhyProp";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { Comparison } from "@/components/sections/Comparison";
import { Trades } from "@/components/sections/Trades";
import { Personas } from "@/components/sections/Personas";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { DISCLOSURES } from "@/content/data";

export const metadata: Metadata = {
  title: "Start here",
  description:
    "The complete walkthrough of Meridian Solutions — the offer, the proof, the process, and how to apply.",
};

export default function StartPage() {
  return (
    <>
      <Hero
        eyebrow="Start here · The full walkthrough"
        sideLeft="The edge"
        sideRight="The access"
        title="The institutional edge, finally licensable."
        lead="Three validated NQ futures algorithms, run by you, on your prop-firm or personal account. Every signal arrives with entry, stop and target already set. Here's the whole thing — proof, process, and how to get in."
        cta={{ label: "Apply for access", href: "#apply" }}
        secondary={{ label: "See the proof first", href: "#proof" }}
      />

      <Platforms />
      <SignalTicker />

      {/* problem agitation */}
      <section className="section">
        <div className="container">
          <div className="sec-head--center" data-reveal>
            <p className="eyebrow reveal" style={{ justifyContent: "center" }}><span className="dot" /> The real problem</p>
            <h2 className="display d-lg reveal balance" data-split style={{ maxWidth: "18ch", margin: "0 auto" }}>
              The most expensive variable is you.
            </h2>
            <p className="lead muted reveal pretty" style={{ maxWidth: "54ch", margin: "1.4rem auto 0" }}>
              Most traders don&apos;t lose for lack of an edge. They lose because they hesitate,
              revenge-trade, and move the stop &ldquo;just this once.&rdquo; Meridian removes the
              decision at the moment it costs the most — every signal arrives finished.
            </p>
          </div>
        </div>
      </section>

      <div id="proof" />
      <Pillars />
      <AlgoTiers />
      <RunAll />
      <StatsBand />
      <EquityCurves />
      <Validation />
      <Deploy />
      <Trades />
      <Process />
      <WhyProp />
      <CalculatorSection />
      <Comparison />
      <Personas />
      <Testimonials />

      {/* founder / mission */}
      <section className="section is-cream">
        <div className="container">
          <div className="split-feature">
            <div data-reveal>
              <p className="eyebrow reveal"><span className="dot" /> Why we built it</p>
              <h2 className="display d-md reveal balance" data-split style={{ marginTop: "1rem" }}>
                From traders, for traders.
              </h2>
            </div>
            <div className="flow reveal" data-reveal>
              <p className="lead muted pretty">
                Meridian was built by a small team with backgrounds in systematic trading and
                engineering, after years of watching good traders lose to their own emotions.
              </p>
              <p className="muted pretty">
                We don&apos;t sell signals on hope. We license a framework that has already survived
                validation — and we gate access by application so the community stays serious.
                Software and education only: never a broker, never a fund, never a manager of your
                money. That line does not move.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* risk disclosure */}
      <section className="section">
        <div className="container">
          <div className="risk-block" data-reveal>
            <p className="eyebrow reveal"><span className="dot" /> Read this carefully</p>
            <h2 className="display d-sm reveal" style={{ marginTop: "0.8rem", marginBottom: "1.4rem" }}>
              Risk disclosure
            </h2>
            <div className="grid-2 reveal">
              <p className="muted pretty">{DISCLOSURES.hypothetical}</p>
              <p className="muted pretty">{DISCLOSURES.risk}</p>
            </div>
          </div>
        </div>
      </section>

      {/* the application form — final CTA */}
      <section className="section" id="apply" style={{ paddingTop: "clamp(24px,3vw,48px)" }}>
        <div className="container">
          <div className="sec-head--center" data-reveal style={{ marginBottom: "clamp(2rem,4vw,3rem)" }}>
            <p className="eyebrow reveal" style={{ justifyContent: "center" }}><span className="dot" /> The last step</p>
            <h2 className="display d-lg reveal balance" data-split style={{ maxWidth: "16ch", margin: "0 auto" }}>
              Apply for access.
            </h2>
            <p className="lead muted reveal pretty" style={{ maxWidth: "50ch", margin: "1.2rem auto 0" }}>
              Two minutes. Reviewed by hand. If it&apos;s a fit, we book your onboarding call.
            </p>
          </div>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <ApplyForm />
          </div>
        </div>
      </section>
    </>
  );
}
