const SIGNALS: { t: string; r: string; neg?: boolean }[] = [
  { t: "NQ · LONG · NY OPEN", r: "+1.8R" },
  { t: "ES · SHORT · LONDON", r: "+1.2R" },
  { t: "NQ · LONG · OVERNIGHT", r: "−1.0R", neg: true },
  { t: "NQ · LONG · NY CLOSE", r: "+2.4R" },
  { t: "GC · SHORT · ASIA EARLY", r: "+0.9R" },
  { t: "NQ · LONG · MORNING OVERLAP", r: "+1.5R" },
  { t: "CL · SHORT · 5-MINUTE", r: "−1.0R", neg: true },
  { t: "NQ · LONG · NY OPEN", r: "+3.1R" },
];

/** Thin scrolling strip of illustrative signals — a section divider. */
export function SignalTicker() {
  const items = [...SIGNALS, ...SIGNALS];
  return (
    <div className="ticker-strip" aria-hidden="true">
      <span className="ticker-strip__label">Illustrative signal feed</span>
      <div className="marquee" data-marquee data-marquee-speed="70">
        <div className="marquee_track">
          {items.map((s, i) => (
            <span className="ticker-strip__item marquee_item" key={i}>
              {s.t} <b className={s.neg ? "neg" : ""}>{s.r}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
