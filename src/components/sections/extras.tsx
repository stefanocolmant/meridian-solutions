import { SectionHead } from "@/components/ui";

/* ---- /algorithms: anatomy of a signal ---- */
const PARTS = [
  { k: "Entry", d: "The exact price and condition to enter — no discretion, no chasing a candle." },
  { k: "Stop", d: "A hard, pre-calculated stop on every signal. Your risk is defined before you click." },
  { k: "Target", d: "A defined objective with a documented expectancy behind it." },
];
export function SignalAnatomy() {
  return (
    <section className="section is-cream">
      <div className="container">
        <SectionHead
          eyebrow="Anatomy of a signal"
          title="Every signal arrives finished."
          intro="You don't interpret a chart — you execute a plan. Three things are decided before the signal ever reaches you."
          className="reveal"
        />
        <div className="grid-3" data-cards style={{ marginTop: "clamp(2rem,4vw,3rem)" }}>
          {PARTS.map((p, i) => (
            <div className="card" key={p.k} style={{ padding: "clamp(1.5rem,2.6vw,2.2rem)" }}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display" style={{ fontSize: "clamp(1.6rem,2.6vw,2.2rem)", margin: "0.8rem 0 0.6rem" }}>{p.k}</h3>
              <p className="muted" style={{ margin: 0 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- /algorithms + /methodology: the four risk mechanisms ---- */
const MECHS = [
  { k: "Fixed stops", d: "A hard stop on every signal — no averaging down, no hoping it comes back." },
  { k: "Session limits", d: "Configurations only fire in the sessions they were validated for." },
  { k: "Exposure caps", d: "Sizing is bounded so no single trade can blow the account." },
  { k: "Daily ceiling", d: "A hard daily loss limit halts trading before a bad day compounds." },
];
export function RiskMechanisms({ cream = false }: { cream?: boolean }) {
  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <SectionHead
          eyebrow="Risk architecture"
          title="Four controls on every signal."
          intro="Returns get the headlines; risk keeps you in the game. Four independent mechanisms bound every trade."
          className="reveal"
        />
        <div className="grid-4" data-cards style={{ marginTop: "clamp(2rem,4vw,3rem)" }}>
          {MECHS.map((m, i) => (
            <div className="card" key={m.k} style={{ padding: "clamp(1.4rem,2.4vw,2rem)" }}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display" style={{ fontSize: "clamp(1.3rem,2vw,1.7rem)", margin: "1rem 0 0.6rem" }}>{m.k}</h3>
              <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- /performance: risk-adjusted shape of the curve ---- */
const RR = [
  { v: "−4.2%", k: "Max drawdown" },
  { v: "1.846", k: "Profit factor" },
  { v: "2.4 : 1", k: "Avg reward : risk" },
  { v: "93%", k: "Months profitable" },
];
export function RiskReturn() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Risk, not just return"
          title="The shape of the curve."
          intro="A big return on a violent curve is a liability. These are the numbers that describe how the equity actually got there."
          className="reveal"
        />
        <div className="metric-grid reveal" data-reveal style={{ marginTop: "clamp(2rem,4vw,3rem)" }}>
          {RR.map((s) => (
            <div className="metric reveal" key={s.k}>
              <span>{s.k}</span>
              <b>{s.v}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- /methodology: no black box ---- */
const GET = [
  { k: "Plain-language methodology", d: "Every rule and parameter, written out — not a mystery box." },
  { k: "Chart templates + webhooks", d: "Drop-in setup for your platform, configured on the call." },
  { k: "Risk settings, explained", d: "You know exactly what bounds each trade, and why." },
  { k: "Session-by-session education", d: "Guided walkthroughs so you understand what you run." },
];
export function NoBlackBox() {
  return (
    <section className="section is-cream">
      <div className="container">
        <div className="split-feature">
          <div data-reveal>
            <SectionHead
              eyebrow="No black box"
              title="Software you understand."
              intro="Every parameter, every operational characteristic, every risk mechanism — documented in full and delivered at onboarding. Nothing withheld."
              className="reveal"
            />
          </div>
          <div className="grid-2" data-cards>
            {GET.map((g) => (
              <div className="card" key={g.k} style={{ padding: "clamp(1.3rem,2.2vw,1.8rem)" }}>
                <h3 className="display" style={{ fontSize: "1.2rem", margin: "0 0 0.5rem" }}>{g.k}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- /process: scaling path ---- */
const SCALE = [
  { v: "1 account", k: "Prove consistency", n: "Pass an evaluation, trade the system" },
  { v: "3–5 accounts", k: "Stack funded capital", n: "Same signals, routed to each" },
  { v: "+ personal", k: "Add your own book", n: "No split, no caps, full control" },
  { v: "Compound", k: "Reinvest payouts", n: "Widen coverage over time" },
];
export function ScalingPath() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Scaling"
          title="One system, more accounts."
          intro="The same validated signals route to every account you run. Consistency, not heroics, is what compounds."
          className="reveal"
        />
        <div className="grid-4" data-cards style={{ marginTop: "clamp(2rem,4vw,3rem)" }}>
          {SCALE.map((s, i) => (
            <div className="card" key={s.k} style={{ padding: "clamp(1.4rem,2.4vw,2rem)" }}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <div className="stat-num" style={{ fontSize: "clamp(1.5rem,2.6vw,2.1rem)", margin: "0.8rem 0 0.4rem" }}>{s.v}</div>
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", margin: "0 0 0.3rem", fontWeight: 600 }}>{s.k}</h3>
              <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>{s.n}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
