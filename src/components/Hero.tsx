import Link from "next/link";
import { Starfield } from "./Starfield";

type Chip = { v: string; k: string };

/**
 * Hero: a full-bleed MOVING celestial background (drifting nebula + animated
 * starfield + slow aurora, all self-hosted — no external video) with a centered
 * condensed-caps headline, symmetric mono side-labels, and floating
 * frosted-glass stat chips.
 */
export function Hero({
  eyebrow = "Meridian Solutions · Automated Futures",
  sideLeft = "Remove the guesswork",
  sideRight = "Compound on autopilot",
  title = "Institutional grade algorithms, licensed to you.",
  lead = "Gain access to one fully validated futures system with nine configurations — distinct risk-parameter presets built across different sessions and market conditions, specialized on NQ and adaptable to other liquid markets. Every setup ships with entry, stop and target already defined and routes automatically to your account, so you compound with structure, consistency and complete control.",
  cta = { label: "Apply for access", href: "/apply" },
  secondary = { label: "See the performance", href: "/performance" },
  chips = [
    { v: "1.846", k: "Profit factor" },
    { v: "14 / 15", k: "Months profitable" },
    { v: "9", k: "Configurations" },
    { v: "100%", k: "Account control" },
  ],
}: {
  eyebrow?: string;
  sideLeft?: string;
  sideRight?: string;
  title?: string;
  lead?: string;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
  chips?: Chip[];
}) {
  return (
    <section className="hero">
      <div className="hero__media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero__poster" src="/bg/hero-poster.jpg" alt="" />
        <video className="hero__video" autoPlay muted loop playsInline preload="auto" poster="/bg/hero-poster.jpg">
          <source src="/bg/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <Starfield className="hero__sky" />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__inner container">
        <span className="hero__side hero__side--l mono">{sideLeft}</span>
        <span className="hero__side hero__side--r mono">{sideRight}</span>

        <p className="hero__eyebrow eyebrow"><span className="dot" /> {eyebrow}</p>

        <h1 className="display hero__title balance" data-split data-split-load>
          {title}
        </h1>

        <p className="hero__lead lead pretty">{lead}</p>

        <div className="hero__cta">
          <Link href={cta.href} className="btn btn--solid btn--lg">{cta.label}</Link>
          <Link href={secondary.href} className="hero__link mono">{secondary.label} →</Link>
        </div>

        <div className="hero__chips">
          {chips.map((c) => (
            <div className="hero__chip glass" key={c.k}>
              <b>{c.v}</b>
              <span>{c.k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
