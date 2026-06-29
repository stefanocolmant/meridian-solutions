import { Counter } from "@/components/Counter";
import { SectionHead } from "@/components/ui";

const STATS = [
  { node: <Counter value={1.846} decimals={3} />, label: "Profit factor", note: "Scalprophecy · 15-month validation" },
  { node: <Counter value={93} suffix="%" />, label: "Months profitable", note: "14 of 15 months" },
  { node: <Counter value={9} />, label: "Configurations", note: "Run together for a smoother curve" },
  { node: <Counter value={262437} prefix="+$" />, label: "Net P&L", note: "Scalprophecy · hypothetical, 15 mo" },
];

export function StatsBand({ head = true }: { head?: boolean }) {
  return (
    <section className="section">
      <div className="container">
        {head && (
          <SectionHead
            eyebrow="The numbers"
            title="Validated, not promised."
            intro="Carried from the 15-month validation on NQ E-mini futures. Hypothetical and educational — every figure here is modeled, not a live account."
            className="reveal"
          />
        )}
        <div className="bigstat" style={{ marginTop: head ? "clamp(2.5rem,5vw,3.5rem)" : 0 }} data-reveal="0.1">
          {STATS.map((s) => (
            <div className="bigstat__item reveal" key={s.label}>
              <div className="stat-num">{s.node}</div>
              <p>{s.label}</p>
              <small>{s.note}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
