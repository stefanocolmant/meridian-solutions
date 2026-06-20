import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Calculator } from "@/components/Calculator";
import { Cta } from "@/components/sections/Cta";
import { DISCLOSURES } from "@/content/data";

export const metadata: Metadata = {
  title: "Calculator",
  description: "Model an illustrative trajectory across prop-firm payouts and personal-capital compounding.",
};

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Project the path"
        title="Model your trajectory."
        lead="Adjust the inputs to see an illustrative path — prop-firm payouts, personal-capital compounding, or a blend. Deliberately conservative, entirely hypothetical."
        bg="/bg/nebula-2.webp"
      />
      <section className="section" style={{ paddingTop: "clamp(24px,3vw,48px)" }}>
        <div className="container">
          <Calculator />
          <p className="muted pretty" style={{ maxWidth: "80ch", marginTop: "2rem", fontSize: "0.85rem" }}>
            {DISCLOSURES.hypothetical}
          </p>
          <p className="muted pretty" style={{ maxWidth: "80ch", marginTop: "1rem", fontSize: "0.85rem" }}>
            {DISCLOSURES.risk}
          </p>
        </div>
      </section>
      <Cta title="Turn the model into a plan." body="The calculator is a sketch. The onboarding call is where we build the real one with you." />
    </>
  );
}
