import Link from "next/link";
import { Mark, Logo } from "./Logo";
import { BRAND, FOOTER_COLS, NAV_CTA } from "@/content/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="mer-footer">
      <div className="mer-footer__bg" data-parallax="0.12" aria-hidden="true" />

      {/* CTA band */}
      <div className="container mer-footer__cta" data-reveal>
        <p className="eyebrow reveal"><span className="dot" /> This isn&apos;t for everyone</p>
        <h2 className="display d-lg balance" data-split>
          It might be for you.
        </h2>
        <p className="lead muted reveal pretty" style={{ maxWidth: "44ch", margin: "0 auto" }}>
          Access is application-based and reviewed by hand. Not a sales process — a
          qualification one.
        </p>
        <div className="reveal" style={{ display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={NAV_CTA.href} className="btn btn--solid btn--lg">{NAV_CTA.label}</Link>
          <Link href="/performance" className="btn btn--lg">See the performance</Link>
        </div>
      </div>

      {/* moving wordmark */}
      <div className="mer-footer__marquee marquee" data-marquee data-marquee-speed="55">
        <div className="marquee_track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span className="marquee_item" key={i}>
              <span className="mer-footer__word">Meridian</span>
              <Mark size={40} className="mer-footer__star" />
              <span className="mer-footer__word">Solutions</span>
              <Mark size={40} className="mer-footer__star" />
            </span>
          ))}
        </div>
      </div>

      {/* link columns */}
      <div className="container mer-footer__grid">
        <div className="mer-footer__brand">
          <Logo size={28} />
          <p className="muted pretty" style={{ maxWidth: "32ch", marginTop: "1.1rem" }}>
            Institutional algorithms, licensed to traders who execute the plan.
          </p>
          <div className="mer-footer__est mono">
            <span>{BRAND.location}</span>
            <span>{BRAND.est}</span>
          </div>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title} className="mer-footer__col">
            <p className="eyebrow">{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.label + l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mer-footer__col">
          <p className="eyebrow">Contact</p>
          <ul>
            <li><a href={`mailto:${BRAND.email.access}`}>{BRAND.email.access}</a></li>
            <li><a href={BRAND.social.x} target="_blank" rel="noopener noreferrer">X / Twitter</a></li>
            <li><a href={BRAND.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="container mer-footer__bottom">
        <p className="mono">© {year} {BRAND.name}. All rights reserved.</p>
        <p className="mono muted">Futures trading involves substantial risk. Hypothetical results — not investment advice.</p>
      </div>
    </footer>
  );
}
