import type { Metadata } from "next";
import Link from "next/link";
import {
  Check, ArrowRight, ClipboardCheck, Cable, Power,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { BRAND } from "@/content/site";
import {
  MONTHLY_PNL, ALGOS, PERF_METRICS, COMPARE,
  FINANCIAL_TESTIMONIALS, PERSONAL_TESTIMONIALS, DISCLOSURES,
} from "@/content/data";
import { LeadWizard } from "./LeadWizard";
import { ProofGallery } from "./ProofGallery";

export const metadata: Metadata = {
  title: "Institutional-grade automated futures trading",
  description:
    "Meridian Trading Solutions gives traders access to institutional-grade, fully automated futures trading across prop-firm or personal brokerage accounts — while you keep full control.",
};

const HOW = [
  { icon: ClipboardCheck, n: "Step 01", h: "Apply for access", p: "Tell us about your goals, trading experience, preferred platform, and whether you plan to use prop-firm or personal capital." },
  { icon: Cable, n: "Step 02", h: "Connect and configure", p: "Our team helps connect your platforms, install the required templates and webhooks, and configure the system around your selected sessions and risk settings." },
  { icon: Power, n: "Step 03", h: "Activate and scale", p: "Turn on the automation and let Meridian execute qualified trades across your connected accounts. Monitor the system, adjust available settings, and expand as your deployment grows." },
];

const VALUE = [
  "Access to Delta Flow, Delta Vision, or Scalprophecy based on your selected Meridian level.",
  "Up to nine automated configurations designed for broader coverage and smoother combined performance.",
  "Predefined entries, stops, targets, and trade-management rules executed automatically.",
  "Compatibility with supported prop-firm and personal brokerage accounts.",
  "Multiple built-in risk-management mechanisms on every qualified trade.",
  "Extensive historical and stress testing before deployment.",
  "Guided onboarding, platform setup, templates, webhooks, and configuration assistance.",
  "Ongoing system updates, technical support, educational resources, and strategy guidance based on your selected level.",
];

const DEPLOY = [
  { h: "Apply for access", p: "Complete the short application and tell us about your goals, experience, and preferred account setup." },
  { h: "Get set up", p: "Our team helps install, connect, and configure the technology around your selected Meridian level." },
  { h: "Start with prop-firm capital", p: "Use the system to pursue evaluations and deploy across funded accounts without immediately relying on your own trading capital." },
  { h: "Scale across accounts", p: "Route the same automated configurations across multiple connected accounts and expand your deployment as results grow." },
  { h: "Add personal capital", p: "Deploy the same technology through your own brokerage account and retain the full upside without prop-firm profit splits or payout limits." },
  { h: "Compound and expand", p: "Reinvest withdrawals, add configurations, increase account coverage, and build a larger automated trading operation over time." },
];

const PROOF_IMAGES = ["/trades/trade-05.jpg", "/trades/trade-06.jpg", "/trades/trade-07.jpg", "/trades/trade-11.jpg", "/trades/trade-15.jpg", "/trades/trade-17.jpg"];

function CtaButton({ to = "#apply" }: { to?: string }) {
  return <a href={to} className="btn btn--solid btn--lg">Apply for access <ArrowRight size={16} /></a>;
}

export default function LandingPage() {
  const maxAbs = Math.max(...MONTHLY_PNL.map((m) => Math.abs(m.pnl)));

  return (
    <div className="lp">
      {/* ===== 1 · HERO ===== */}
      <header className="lp-hero">
        <div className="lp-hero__bg"><img src="/bg/nebula-2.webp" alt="" /></div>
        <div className="lp-hero__scrim" />
        <div className="lp-wrap lp-hero__inner">
          <div className="lp-brand lp-rise lp-d1"><Logo size={24} /></div>
          <span className="lp-badge lp-rise lp-d2"><span className="dot" /> Institutional-grade automation</span>
          <h1 className="lp-h1 lp-rise lp-d2">
            Your trading edge, <span className="accent">fully automated.</span> Fully in your control.
          </h1>
          <p className="lp-sub lp-rise lp-d3">
            Access powerful, fully automated futures trading through your own prop-firm or personal brokerage accounts.
            Every qualified trade is executed with predefined entries, stops, targets, and risk management—without
            requiring you to manage every move manually.
          </p>

          <div className="lp-chart lp-rise lp-d3">
            <div className="lp-chart__head">
              <b>+$262,437</b>
              <span>Scalprophecy · 15-month validation</span>
            </div>
            <div className="lp-chart__bars">
              {MONTHLY_PNL.map((m, i) => (
                <div className="lp-chart__col" key={m.month}>
                  <span className={`lp-chart__bar ${m.pnl >= 0 ? "up" : "down"}`}
                    style={{ height: `${Math.max(4, (Math.abs(m.pnl) / maxAbs) * 100)}%`, animationDelay: `${0.3 + i * 0.03}s` }} />
                </div>
              ))}
            </div>
            <div className="lp-chart__foot"><span>{MONTHLY_PNL[0].month}</span><span>{MONTHLY_PNL[MONTHLY_PNL.length - 1].month}</span></div>
          </div>

          <p className="lp-support lp-rise lp-d4">
            Start with prop-firm capital, scale across multiple funded accounts, or deploy through your own personal
            brokerage account. <b>Meridian handles the execution while you remain in control of the account, settings,
            and automation.</b>
          </p>

          <div className="lp-rise lp-d4"><CtaButton /></div>

          <div className="lp-chips lp-rise lp-d5">
            <span className="lp-chip"><Check size={13} /> Fully automated execution</span>
            <span className="lp-chip"><Check size={13} /> Prop firm or personal capital</span>
            <span className="lp-chip"><Check size={13} /> You keep full control</span>
          </div>

          <div className="lp-proof lp-rise lp-d6">
            <div className="lp-proof__item"><b className="up">1.846</b><span>Profit factor</span></div>
            <div className="lp-proof__sep" />
            <div className="lp-proof__item"><b>93%</b><span>Months profitable</span></div>
            <div className="lp-proof__sep" />
            <div className="lp-proof__item"><b className="up">+$262,437</b><span>Net P&amp;L</span></div>
          </div>
          <p className="lp-chart__note lp-rise lp-d6" style={{ marginTop: "0.4rem" }}>{DISCLOSURES.heroNote}</p>
        </div>
      </header>

      {/* ===== 2 · APPLICATION FORM ===== */}
      <section className="lp-sec lp-formsec" id="apply">
        <div className="lp-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <span className="lp-eyebrow">Apply</span>
            <h2 className="lp-h2" style={{ marginTop: "0.7rem" }}>See if Meridian is right for you.</h2>
            <p className="lp-lead2">Complete the short application and tell us about your trading goals. Our team will review your information and help determine the best Meridian path for you.</p>
          </div>
          <LeadWizard />
        </div>
      </section>

      <div className="lp-wrap"><div className="lp-hair" /></div>

      {/* ===== 3 · HOW IT WORKS ===== */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">How it works</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>Automated in three simple steps.</h2>
          </div>
          <div className="lp-steps">
            {HOW.map((s) => (
              <div className="lp-stp" key={s.n}>
                <span className="lp-stp__icon"><s.icon size={20} /></span>
                <span className="lp-stp__n">{s.n}</span>
                <h4>{s.h}</h4>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4 · PERFORMANCE ===== */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">Performance</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>Nine configurations. One powerful framework.</h2>
            <p className="lp-lead2">Built to perform across different sessions, market conditions, and trading environments. Run individual configurations or combine them for broader coverage and a more balanced overall system.</p>
          </div>
          <div className="lp-curves">
            {ALGOS.map((a) => (
              <div className="lp-curve" key={a.key}>
                <div className="lp-curve__img"><img src={a.curve} alt={`${a.name} equity curve`} /></div>
                <div className="lp-curve__cap"><b>{a.name}</b><span>{a.netPnl}</span></div>
              </div>
            ))}
          </div>
          <div className="metric-grid" style={{ marginTop: "1.2rem" }}>
            {PERF_METRICS.slice(0, 8).map((m) => (
              <div className="metric" key={m.k}><span>{m.k}</span><b>{m.v}</b></div>
            ))}
          </div>
          <div className="p-row" style={{ justifyContent: "space-between", marginTop: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
            <p className="mono muted" style={{ fontSize: "0.66rem", maxWidth: "64ch", letterSpacing: "0.02em" }}>{DISCLOSURES.perfNote}</p>
            <Link href="/performance" className="lp-chip" style={{ whiteSpace: "nowrap" }}>View full performance <ArrowRight size={12} /></Link>
          </div>
        </div>
      </section>

      {/* ===== 5 · FINANCIAL TESTIMONIALS ===== */}
      <section className="lp-sec lp-sec--tight">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <span className="lp-eyebrow">Client results</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>Real traders. Real payouts. <span className="accent">Real results.</span></h2>
          </div>
          <div className="lp-fin">
            {FINANCIAL_TESTIMONIALS.map((t) => (
              <figure className="lp-fincard" key={t.name}>
                <div className="lp-fincard__img"><img src={t.image} alt="Account result" loading="lazy" /></div>
                <div className="lp-fincard__body">
                  <div className="lp-fincard__result">{t.result}</div>
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption><b>{t.name}</b><span>{t.role}</span></figcaption>
                </div>
              </figure>
            ))}
          </div>
          <p className="mono muted" style={{ textAlign: "center", fontSize: "0.66rem", margin: "1.4rem auto 0", letterSpacing: "0.02em" }}>{DISCLOSURES.resultsVary}</p>
        </div>
      </section>

      {/* ===== 6 · BUILT DIFFERENT ===== */}
      <section className="lp-sec">
        <div className="lp-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <span className="lp-eyebrow">Why Meridian</span>
            <h2 className="lp-h2 lp-head">Built different on purpose.</h2>
          </div>
          <div className="cmp">
            <div className="cmp__head"><div className="them">{COMPARE.themLabel}</div><div className="us">{COMPARE.usLabel}</div></div>
            {COMPARE.rows.map((r) => (
              <div className="cmp__row" key={r.us}><div className="them">{r.them}</div><div className="us">{r.us}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7 · WHAT YOU GET ===== */}
      <section className="lp-sec lp-sec--tight">
        <div className="lp-wrap">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">What you get</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>Everything you need to deploy and scale.</h2>
          </div>
          <div className="lp-check">
            {VALUE.map((v) => (
              <div className="lp-crow" key={v}>
                <span className="lp-crow__check"><Check size={14} /></span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8 · AUTOMATION CTA ===== */}
      <section className="lp-sec lp-sec--tight lp-ctaband">
        <div className="lp-wrap">
          <span className="lp-eyebrow" style={{ display: "inline-flex", marginBottom: "0.8rem" }}>Client-controlled automation</span>
          <h2 className="lp-h2">Automate the trades. <span className="accent">Control the system.</span></h2>
          <p className="lp-lead2">Meridian handles the execution according to the configurations you select. You control the connected accounts, risk settings, deployment, and whether the system is active.</p>
          <div style={{ marginTop: "1.4rem" }}><CtaButton /></div>
        </div>
      </section>

      {/* ===== 9 · REAL-WORLD PROOF ===== */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <span className="lp-eyebrow">Real-world deployment</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>Built in testing. <span className="accent">Proven in the market.</span></h2>
            <p className="lp-lead2">See Meridian operating across real trader platforms, funded accounts, and personal brokerage accounts. Explore chart executions, withdrawals, payouts, and client experiences.</p>
          </div>
          <div className="lp-proofgrid">
            {PROOF_IMAGES.map((src) => (
              <div className="lp-proofgrid__cell" key={src}><img src={src} alt="Real deployment" loading="lazy" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10 · CHART GALLERY ===== */}
      <section className="lp-sec lp-sec--tight">
        <div className="lp-wrap lp-wrap--wide" style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <span className="lp-eyebrow">Real executions</span>
          <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>The system, executing in real time.</h2>
          <p className="lp-lead2">Real-world examples of Meridian configurations executing on members&apos; platforms with predefined entries, stops, targets, and trade management.</p>
        </div>
        <ProofGallery />
      </section>

      {/* ===== 11 · PERSONAL TESTIMONIALS ===== */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">Client experiences</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>More than software. A system traders trust.</h2>
          </div>
          <div className="lp-tcards lp-tcards--4">
            {PERSONAL_TESTIMONIALS.map((t) => (
              <figure className="lp-quote" key={t.name}>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <figcaption className="lp-quote__by"><b>{t.name}</b><span>{t.role}</span></figcaption>
              </figure>
            ))}
          </div>
          <p className="mono muted" style={{ textAlign: "center", fontSize: "0.66rem", margin: "1.4rem auto 0", letterSpacing: "0.02em" }}>{DISCLOSURES.testimonial}</p>
        </div>
      </section>

      {/* ===== 12 · DEPLOYMENT PATH ===== */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">Your path</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>From application to automated income.</h2>
          </div>
          <div className="lp-timeline">
            {DEPLOY.map((s, i) => (
              <div className="lp-trow" key={s.h}>
                <span className="lp-tnode">{i + 1}</span>
                <div className="lp-tcard">
                  <span className="lp-tpill">Step {i + 1}</span>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 13 · FINAL CTA ===== */}
      <section className="lp-sec lp-ctaband">
        <div className="lp-wrap">
          <span className="lp-eyebrow" style={{ display: "inline-flex", marginBottom: "0.8rem" }}>Application-based access</span>
          <h2 className="lp-h2">Stop managing every trade yourself. <span className="accent">Start deploying a proven system.</span></h2>
          <p className="lp-lead2">Apply today and see how Meridian can help automate your futures trading across prop-firm or personal brokerage accounts.</p>
          <div style={{ marginTop: "1.4rem" }}><CtaButton /></div>
          <div className="lp-chips" style={{ marginTop: "1.6rem" }}>
            <span className="lp-chip"><Check size={13} /> Reviewed by hand</span>
            <span className="lp-chip"><Check size={13} /> No card required</span>
            <span className="lp-chip"><Check size={13} /> Full account control</span>
          </div>
        </div>
      </section>

      {/* ===== 14 · FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-wrap lp-wrap--wide">
          <div className="lp-footer__brand"><Logo size={22} /></div>
          <a href={`mailto:${BRAND.email.access}`} className="lp-mail">{BRAND.email.access}</a>
          <p className="lp-disc">{DISCLOSURES.footer}</p>
          <p className="lp-copy">© {`2026 ${BRAND.name}`}</p>
        </div>
      </footer>
    </div>
  );
}
