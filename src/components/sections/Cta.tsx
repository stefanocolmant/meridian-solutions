import Link from "next/link";

export function Cta({
  eyebrow = "This isn't for everyone",
  title = "It might be for you.",
  body = "Meridian is application-based. Every application is reviewed before access is granted — not a sales process, a qualification one.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <div
          className="reveal"
          data-reveal
          style={{
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(2.5rem,6vw,5rem) clamp(1.5rem,4vw,4rem)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(120% 140% at 50% 0%, rgba(204,100,55,0.10), transparent 60%)",
          }}
        >
          <p className="eyebrow reveal" style={{ justifyContent: "center", marginBottom: "1.2rem" }}>
            <span className="dot" /> {eyebrow}
          </p>
          <h2 className="display d-lg reveal balance" data-split style={{ maxWidth: "16ch", margin: "0 auto" }}>
            {title}
          </h2>
          <p className="lead muted reveal pretty" style={{ maxWidth: "50ch", margin: "1.4rem auto 0" }}>
            {body}
          </p>
          <div className="reveal" style={{ display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
            <Link href="/apply" className="btn btn--solid btn--lg">Apply for access</Link>
            <Link href="/algorithms" className="btn btn--lg">View the algorithms</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
