import Link from "next/link";
import { ALGOS } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function AlgoTiers({
  showHead = true,
  cream = false,
}: { showHead?: boolean; cream?: boolean }) {
  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        {showHead && (
          <SectionHead
            eyebrow="The algorithms"
            title="Three systems. One discipline."
            intro="Each tier widens session coverage and adds configurations. Start with the foundation, or run the complete suite together for the smoothest aggregate curve."
            className="reveal"
          />
        )}

        <div className="tiers" style={{ marginTop: showHead ? "clamp(2.5rem,5vw,4rem)" : 0 }} data-cards>
          {ALGOS.map((a) => (
            <article className={`tier ${a.rank === "Core" ? "tier--feature" : ""}`} key={a.key}>
              {a.rank === "Core" && <span className="tier__badge">Most popular</span>}
              <div className="tier__top">
                <div>
                  <div className="tier__name">{a.name}</div>
                  <div className="tier__rank">{a.tier} · {a.rank}</div>
                </div>
                <span className="idx">{a.configs} configs</span>
              </div>

              <div className="tier__metrics">
                <div className="tier__metric"><span>Net P&amp;L · 15mo</span><b className="pos">{a.netPnl}</b></div>
                <div className="tier__metric"><span>Profit factor</span><b>{a.profitFactor}</b></div>
                <div className="tier__metric"><span>Months profitable</span><b>{a.monthsProfitable}</b></div>
                <div className="tier__metric"><span>Configurations</span><b>{a.configs}</b></div>
              </div>

              <p className="tier__blurb">{a.blurb}</p>

              <div className="tier__cov">
                {a.coverage.map((c) => <span className="tag" key={c}>{c}</span>)}
              </div>

              <Link href="/algorithms" className={`btn ${a.rank === "Core" ? "btn--solid" : ""}`} style={{ width: "100%" }}>
                Explore {a.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
