import { SectionHead } from "@/components/ui";

const TRADES = Array.from({ length: 18 }, (_, i) => `/trades/trade-${String(i + 1).padStart(2, "0")}.jpg`);

export function Trades() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Signals, executed"
          title="The system, firing on real charts."
          intro="A rolling wall of signals landing on members' platforms — entry, stop and target drawn before the candle closes. Hypothetical / educational; results not typical."
          className="reveal"
        />
      </div>
      <div className="marquee" style={{ marginTop: "clamp(2.5rem,4vw,3.5rem)" }} data-marquee data-marquee-speed="44">
        <div className="marquee_track">
          {[...TRADES, ...TRADES.slice(0, 6)].map((src, i) => (
            <span className="marquee_item trades__item" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Member trade signal" loading="lazy" />
            </span>
          ))}
        </div>
      </div>
      <div className="marquee" style={{ marginTop: "1rem" }} data-marquee data-marquee-dir="right" data-marquee-speed="38">
        <div className="marquee_track">
          {[...TRADES.slice().reverse(), ...TRADES.slice(6, 12)].map((src, i) => (
            <span className="marquee_item trades__item" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Member trade signal" loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
