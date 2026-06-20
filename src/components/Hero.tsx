import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero__img" src="/bg/hero.webp" alt="" data-parallax="0.08" />
      </div>
      <div className="hero__scrim" />
      <div className="hero__inner">
        <div className="container">
          <div className="hero__eyebrows">
            <span className="eyebrow"><span className="dot" /> Validated · 15 months</span>
            <span className="eyebrow">Tick-level data</span>
            <span className="eyebrow">NQ E-mini · CME</span>
          </div>

          <h1 className="display d-xl hero__title balance" data-split data-split-load>
            Trade the plan, not the impulse.
          </h1>

          <p className="lead hero__lead pretty">
            Three validated futures algorithms — every signal arrives with entry, stop, and
            target already defined. Deploy them at your prop firm or on your own capital.
            You keep full control of the account, always.
          </p>

          <div className="hero__actions">
            <Link href="/apply" className="btn btn--solid btn--lg">Apply for access</Link>
            <Link href="/performance" className="btn btn--lg">See the performance</Link>
          </div>

          <div className="hero__ticker">
            <div className="ti"><b>3</b><span>Validated algorithms</span></div>
            <div className="ti"><b>9</b><span>Configurations</span></div>
            <div className="ti"><b>1.846</b><span>Profit factor</span></div>
            <div className="ti"><b>100%</b><span>Account control</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
