import { SectionHead } from "@/components/ui";

const CARDS = [
  { n: "01", t: "Trade their capital", d: "Pass an evaluation and trade a funded account. The firm puts up the buying power — you bring the discipline." },
  { n: "02", t: "Contained downside", d: "Your personal risk is the evaluation fee, not the account size. The firm absorbs drawdown beyond your loss limit." },
  { n: "03", t: "Scale without raising money", d: "Stack multiple funded accounts as you prove consistency. The same signals route to every one simultaneously." },
  { n: "04", t: "Keep the upside", d: "Withdraw your profit split on a regular cadence, then reinvest into a personal account you control end to end — no split, no caps." },
];

export function WhyProp() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Why prop-firm capital"
          title="Start with their money."
          intro="The fastest, lowest-risk way to deploy a validated system at size — without tying up your own capital first."
          className="reveal"
        />
        <div className="grid-4" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }} data-cards>
          {CARDS.map((c) => (
            <div className="card" key={c.n} style={{ padding: "clamp(1.4rem,2.4vw,2rem)" }}>
              <span className="idx">{c.n}</span>
              <h3 className="display d-sm" style={{ margin: "1rem 0 0.7rem", fontSize: "clamp(1.3rem,2vw,1.7rem)" }}>{c.t}</h3>
              <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
