import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AlgoTiers } from "@/components/sections/AlgoTiers";
import { RunAll } from "@/components/sections/RunAll";
import { SignalAnatomy, RiskMechanisms } from "@/components/sections/extras";
import { Cta } from "@/components/sections/Cta";
import { SectionHead } from "@/components/ui";
import { ALGOS, ASSET } from "@/content/data";

export const metadata: Metadata = {
  title: "Algorithms",
  description: "One validated futures system — nine configurations across three access levels (Delta Flow, Delta Vision, Scalprophecy), specialized on NQ and adaptable to other liquid markets.",
};

export default function AlgorithmsPage() {
  return (
    <>
      <PageHero
        eyebrow="The algorithms"
        title="Delta Flow. Delta Vision. Scalprophecy."
        lead="One validated engine, nine configurations, three access levels — one discipline. Each tier widens session coverage — choose your starting point, then grow into the full suite."
        bg="/bg/nebula-2.webp"
      />

      <AlgoTiers showHead={false} />

      {/* config comparison */}
      <section className="section is-cream">
        <div className="container">
          <SectionHead
            eyebrow="Side by side"
            title="What each tier unlocks."
            intro={`All figures are hypothetical, drawn from the same validation window. ${ASSET.validation}`}
            className="reveal"
          />
          <div className="wrap reveal" style={{ marginTop: "clamp(2rem,4vw,3rem)", overflowX: "auto" }} data-reveal>
            <table className="ctable">
              <thead>
                <tr>
                  <th>Access level</th>
                  <th>Tier</th>
                  <th>Configurations</th>
                  <th>Net P&amp;L · 15mo</th>
                  <th>Profit factor</th>
                  <th>Months profitable</th>
                </tr>
              </thead>
              <tbody>
                {ALGOS.map((a) => (
                  <tr key={a.key}>
                    <td>{a.name}</td>
                    <td className="muted mono">{a.rank}</td>
                    <td>{a.configs}</td>
                    <td className="pos">{a.netPnl}</td>
                    <td>{a.profitFactor}</td>
                    <td>{a.monthsProfitable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SignalAnatomy />

      {/* coverage detail */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Session coverage" title="Where each tier trades." className="reveal" />
          <div className="grid-3" style={{ marginTop: "clamp(2rem,4vw,3rem)" }} data-cards>
            {ALGOS.map((a) => (
              <div className="card" key={a.key} style={{ padding: "clamp(1.4rem,2.4vw,2rem)", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <div className="tier__name">{a.name}</div>
                  <div className="tier__rank">{a.tier} · {a.configs} configs</div>
                </div>
                <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>{a.blurb}</p>
                <div className="tier__cov">
                  {a.coverage.map((c) => <span className="tag" key={c}>{c}</span>)}
                </div>
              </div>
            ))}
          </div>
          <p className="muted mono" style={{ marginTop: "2rem", fontSize: "0.78rem" }}>
            Instrument: {ASSET.instrument} · {ASSET.exchange}. Four risk mechanisms are built into every signal.
          </p>
        </div>
      </section>

      <RunAll />
      <RiskMechanisms />
      <Cta title="Find your starting line." body="Apply to license Delta Flow, Delta Vision, or the complete Scalprophecy suite. Every application is reviewed by hand." />
    </>
  );
}
