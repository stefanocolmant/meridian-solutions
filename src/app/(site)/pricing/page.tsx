import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Comparison } from "@/components/sections/Comparison";
import { FaqSection } from "@/components/sections/FaqSection";
import { Cta } from "@/components/sections/Cta";
import { PRICING } from "@/content/data";

export const metadata: Metadata = {
  title: "Pricing",
  description: "License Compass, Quadrant or Polaris. Simple monthly access, application-gated.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Access & pricing"
        title="License the system."
        lead="One flat monthly licence per tier. No performance fees, no profit share, no lock-in. You keep 100% of what you trade — we only license the software."
        bg="/bg/hero.webp"
      />

      <section className="section--tight">
        <div className="container">
          <div className="tiers" data-cards>
            {PRICING.map((p) => (
              <article className={`tier ${p.highlight ? "tier--feature" : ""}`} key={p.key}>
                {p.highlight && <span className="tier__badge">Most popular</span>}
                <div>
                  <div className="tier__name">{p.name}</div>
                  <div className="tier__rank">{p.tier}</div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                  <span className="stat-num" style={{ fontSize: "clamp(2.4rem,4vw,3.4rem)" }}>{p.price}</span>
                  <span className="muted mono">{p.cadence}</span>
                </div>
                <div className="tier__rank">{p.configs}</div>
                <ul className="flow" style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.92rem" }}>
                      <span className="accent mono">→</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/apply" className={`btn ${p.highlight ? "btn--solid" : ""}`} style={{ width: "100%" }}>
                  Apply for {p.name}
                </Link>
              </article>
            ))}
          </div>
          <p className="muted mono" style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.78rem" }}>
            Prop-firm evaluation fees and profit splits are set by your chosen firm, separately — Meridian only charges the flat software licence. Cancel anytime.
          </p>
        </div>
      </section>

      <Comparison />
      <FaqSection limit={5} />
      <Cta title="Pick your tier." body="Apply for the licence that fits where you are today — you can upgrade to the full Polaris suite anytime." />
    </>
  );
}
