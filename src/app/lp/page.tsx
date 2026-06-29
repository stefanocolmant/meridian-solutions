import type { Metadata } from "next";
import Link from "next/link";
import {
  Check, ArrowRight, ClipboardCheck, Zap, TrendingUp,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { BRAND } from "@/content/site";
import {
  MONTHLY_PNL, HEADLINE_STATS, ALGOS, PROCESS, COMPARE, TESTIMONIALS, PERF_METRICS, DISCLOSURES,
} from "@/content/data";
import { LeadWizard } from "./LeadWizard";
import { ProofGallery } from "./ProofGallery";

export const metadata: Metadata = {
  title: "Apply for access — validated futures algorithms",
  description:
    "Compass, Vega and Polaris — three validated NQ futures algorithms. Every signal ships with entry, stop and target. Apply for access.",
};

const HOW = [
  { icon: ClipboardCheck, n: "Step 01", h: "Apply for access", p: "A short application and a 1-on-1 onboarding call. We configure chart templates, webhooks and risk for your exact platform — no code, no guesswork." },
  { icon: Zap, n: "Step 02", h: "Activate the algorithms", p: "Signals generate automatically and route to your platform. Every one arrives with entry, stop and target already defined." },
  { icon: TrendingUp, n: "Step 03", h: "Deploy & scale", p: "Run it at a prop firm or on your own capital. Stack funded accounts as consistency compounds — the same signals route to every one." },
];

const VALUE = [
  ["Three validated algorithms", " — Compass, Vega and Polaris, built and validated in-house."],
  ["Nine configurations", " — run them together for a smoother aggregate equity curve."],
  ["Entry, stop and target", " pre-defined on every single signal — you execute a plan, not a hunch."],
  ["Prop firm or personal", " — deploy anywhere, and you keep full control of the account."],
  ["Four independent risk mechanisms", " built into every signal to keep exposure contained."],
  ["Stress-tested three ways", " — Monte Carlo, noise and variance testing before a dollar is risked."],
];

export default function LandingPage() {
  const maxAbs = Math.max(...MONTHLY_PNL.map((m) => Math.abs(m.pnl)));
  const stats = HEADLINE_STATS;

  return (
    <div className="lp">
      {/* ============================ HERO ============================ */}
      <header className="lp-hero">
        <div className="lp-hero__bg"><img src="/bg/nebula-2.webp" alt="" /></div>
        <div className="lp-hero__scrim" />
        <div className="lp-wrap lp-hero__inner">
          <div className="lp-brand lp-rise lp-d1"><Logo size={24} /></div>
          <span className="lp-badge lp-rise lp-d2"><span className="dot" /> Application-gated access</span>
          <h1 className="lp-h1 lp-rise lp-d2">
            Your edge, executed. <span className="accent">Without the emotion.</span>
          </h1>
          <p className="lp-sub lp-rise lp-d3">
            Three validated futures algorithms — Compass, Vega and Polaris. Every signal ships with{" "}
            <b>entry, stop and target</b> pre-defined.
          </p>

          {/* chart */}
          <div className="lp-chart lp-rise lp-d3">
            <div className="lp-chart__head">
              <b>+$262,437</b>
              <span>Polaris · 15-month validation</span>
            </div>
            <div className="lp-chart__bars">
              {MONTHLY_PNL.map((m, i) => (
                <div className="lp-chart__col" key={m.month}>
                  <span
                    className={`lp-chart__bar ${m.pnl >= 0 ? "up" : "down"}`}
                    style={{ height: `${Math.max(4, (Math.abs(m.pnl) / maxAbs) * 100)}%`, animationDelay: `${0.3 + i * 0.03}s` }}
                  />
                </div>
              ))}
            </div>
            <div className="lp-chart__foot"><span>{MONTHLY_PNL[0].month}</span><span>{MONTHLY_PNL[MONTHLY_PNL.length - 1].month}</span></div>
            <p className="lp-chart__note">Hypothetical · educational · not a live trading account</p>
          </div>

          <p className="lp-support lp-rise lp-d4">
            Most members start at a prop firm to trade institutional capital, then add a personal account once
            the engine pays for itself. <b>You never give up control of the account.</b>
          </p>

          <a href="#form" className="btn btn--solid btn--lg lp-rise lp-d4">Apply for access <ArrowRight size={16} /></a>

          <div className="lp-chips lp-rise lp-d5">
            <span className="lp-chip"><Check size={13} /> Entry · Stop · Target</span>
            <span className="lp-chip"><Check size={13} /> Prop firm or personal</span>
            <span className="lp-chip"><Check size={13} /> You keep full control</span>
          </div>

          <div className="lp-proof lp-rise lp-d6">
            <div className="lp-proof__item"><b className="up">{stats[0].value}</b><span>{stats[0].label}</span></div>
            <div className="lp-proof__sep" />
            <div className="lp-proof__item"><b>{stats[1].value}</b><span>{stats[1].label}</span></div>
            <div className="lp-proof__sep" />
            <div className="lp-proof__item"><b className="up">{stats[3].value}</b><span>{stats[3].label}</span></div>
          </div>
        </div>
      </header>

      {/* ============================ FORM ============================ */}
      <section className="lp-sec lp-formsec" id="apply">
        <div className="lp-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <span className="lp-eyebrow">Apply</span>
            <h2 className="lp-h2" style={{ marginTop: "0.7rem" }}>Take the first step.</h2>
            <p className="lp-lead2">Access is offered, not guaranteed. Tell us a little about your trading and we&apos;ll be in touch.</p>
          </div>
          <LeadWizard />
        </div>
      </section>

      <div className="lp-wrap"><div className="lp-hair" /></div>

      {/* ========================= HOW IT WORKS ====================== */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">How it works</span>
            <h2 className="lp-h2 lp-head">Live in three steps.</h2>
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

      {/* ========================== PROOF MARQUEE ==================== */}
      <section className="lp-sec lp-sec--tight">
        <div className="lp-wrap lp-wrap--wide" style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <span className="lp-eyebrow">Receipts</span>
          <h2 className="lp-h2 lp-head">Validated, trade by trade.</h2>
        </div>
        <ProofGallery />
      </section>

      {/* ============================ TIMELINE ======================= */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">The path</span>
            <h2 className="lp-h2 lp-head--wide" style={{ margin: "0.7rem auto 0" }}>From application to compounding.</h2>
          </div>
          <div className="lp-timeline">
            {PROCESS.map((p) => (
              <div className="lp-trow" key={p.n}>
                <span className="lp-tnode">{p.n}</span>
                <div className="lp-tcard">
                  <span className="lp-tpill">Step {p.n}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CTA BAND ========================= */}
      <section className="lp-sec lp-sec--tight lp-ctaband">
        <div className="lp-wrap">
          <span className="lp-eyebrow" style={{ display: "inline-flex", marginBottom: "0.8rem" }}>No card required</span>
          <h2 className="lp-h2">Run all nine. <span className="accent">Smooth the curve.</span></h2>
          <p className="lp-lead2">Polaris bundles nine largely-uncorrelated configurations — diversification without the extra effort.</p>
          <a href="#apply" className="btn btn--solid btn--lg" style={{ marginTop: "1.4rem" }}>Apply for access <ArrowRight size={16} /></a>
        </div>
      </section>

      {/* ========================= PERFORMANCE ======================= */}
      <section className="lp-sec">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">Performance</span>
            <h2 className="lp-h2 lp-head">Three systems. One smoother curve.</h2>
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
        </div>
      </section>

      {/* ========================= TESTIMONIALS ====================== */}
      <section className="lp-sec lp-sec--tight">
        <div className="lp-wrap lp-wrap--wide">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">Members</span>
            <h2 className="lp-h2 lp-head">The discipline is the product.</h2>
          </div>
          <div className="lp-tcards">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div className="lp-quote" key={t.name + t.role}>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <div className="lp-quote__by"><b>{t.name}</b><span>{t.role}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== COMPARISON ======================= */}
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

      {/* =========================== CHECKLIST ======================= */}
      <section className="lp-sec lp-sec--tight">
        <div className="lp-wrap">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow">What you get</span>
            <h2 className="lp-h2 lp-head">Everything, in one license.</h2>
          </div>
          <div className="lp-check">
            {VALUE.map(([bold, rest]) => (
              <div className="lp-crow" key={bold}>
                <span className="lp-crow__check"><Check size={14} /></span>
                <span><b>{bold}</b>{rest}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== FINAL CTA ======================= */}
      <section className="lp-sec lp-ctaband">
        <div className="lp-wrap">
          <span className="lp-eyebrow" style={{ display: "inline-flex", marginBottom: "0.8rem" }}>One application away</span>
          <h2 className="lp-h2">Stop improvising. <span className="accent">Start executing.</span></h2>
          <p className="lp-lead2">Every application is reviewed by hand — we want traders who follow the rules.</p>
          <a href="#apply" className="btn btn--solid btn--lg" style={{ marginTop: "1.4rem" }}>Apply for access <ArrowRight size={16} /></a>
          <div className="lp-chips" style={{ marginTop: "1.6rem" }}>
            <span className="lp-chip"><Check size={13} /> Reviewed by hand</span>
            <span className="lp-chip"><Check size={13} /> No card required</span>
            <span className="lp-chip"><Check size={13} /> Full account control</span>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ========================= */}
      <footer className="lp-footer">
        <div className="lp-wrap lp-wrap--wide">
          <div className="lp-footer__brand"><Logo size={22} /></div>
          <a href={`mailto:${BRAND.email.access}`} className="lp-mail">{BRAND.email.access}</a>
          <p className="lp-disc">{DISCLOSURES.hypothetical}</p>
          <p className="lp-disc">{DISCLOSURES.risk}</p>
          <p className="lp-copy">© {`2026 ${BRAND.name}`} · Software &amp; education only</p>
        </div>
      </footer>
    </div>
  );
}
