import { Calculator } from "@/components/Calculator";
import { SectionHead } from "@/components/ui";

export function CalculatorSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Project the path"
          title="Model your trajectory."
          intro="Move the inputs to see an illustrative path across prop-firm payouts, personal-capital compounding, or a blend of both. Conservative assumptions, fully hypothetical."
          className="reveal"
        />
        <div style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }}>
          <Calculator />
        </div>
      </div>
    </section>
  );
}
