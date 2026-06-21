import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StatsBand } from "@/components/sections/StatsBand";
import { EquityCurves } from "@/components/sections/EquityCurves";
import { RiskReturn } from "@/components/sections/extras";
import { Trades } from "@/components/sections/Trades";
import { SectionHead } from "@/components/ui";
import { PERF_METRICS, MONTHLY_PNL, DISCLOSURES } from "@/content/data";

export const metadata: Metadata = {
  title: "Performance",
  description: "Hypothetical 15-month validation results, monthly P&L, equity curves and stress tests for the Meridian systems.",
};

function money(pnl: number) {
  const sign = pnl >= 0 ? "+" : "−";
  return `${sign}$${(Math.abs(pnl) / 1000).toFixed(1)}k`;
}

export default function PerformancePage() {
  return (
    <>
      <PageHero
        eyebrow="The track record"
        title="Validated, not promised."
        lead="Every figure here comes from a 15-month validation on NQ E-mini futures — tuned in-sample, confirmed out-of-sample, with commission and slippage included. All results are hypothetical and educational."
        bg="/bg/nebula-3.webp"
      />

      <StatsBand head={false} />

      {/* metric grid */}
      <section className="section--tight">
        <div className="container">
          <div className="metric-grid reveal" data-reveal>
            {PERF_METRICS.map((m) => (
              <div className="metric reveal" key={m.k}>
                <span>{m.k}</span>
                <b>{m.v}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* monthly calendar */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Month by month"
            title="The calendar — Polaris."
            intro="Hypothetical monthly P&L across the validation window for the full nine-configuration suite. Fourteen of fifteen months closed green."
            className="reveal"
          />
          <div className="cal reveal" style={{ marginTop: "clamp(2rem,4vw,3rem)" }} data-reveal>
            {MONTHLY_PNL.map((m) => (
              <div className={`cal__cell reveal ${m.pnl >= 0 ? "pos" : "neg"}`} key={m.month}>
                <span className="m">{m.month}</span>
                <span className="p">{money(m.pnl)}</span>
              </div>
            ))}
          </div>
          <p className="muted mono" style={{ marginTop: "1.6rem", fontSize: "0.78rem" }}>
            Net 15-month total: +$262,437 · Best month +$28.1k · Worst month −$7.3k
          </p>
        </div>
      </section>

      <EquityCurves />
      <RiskReturn />
      <Trades />

      {/* disclosures */}
      <section className="section is-cream">
        <div className="container">
          <SectionHead eyebrow="The fine print" title="How to read these numbers." className="reveal" />
          <div className="grid-2 reveal" style={{ marginTop: "2rem" }} data-reveal>
            <p className="muted pretty">{DISCLOSURES.hypothetical}</p>
            <p className="muted pretty">{DISCLOSURES.risk}</p>
          </div>
        </div>
      </section>
    </>
  );
}
