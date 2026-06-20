import { PLATFORMS } from "@/content/data";
import { SectionHead } from "@/components/ui";

export function Deploy({ cream = false }: { cream?: boolean }) {
  return (
    <section className={`section ${cream ? "is-cream" : ""}`}>
      <div className="container">
        <div className="split-feature">
          <div data-reveal>
            <SectionHead
              eyebrow="Deployment"
              title="Runs inside the tools you already trade."
              intro="Link your charts, broker and prop accounts once. Every signal arrives as a ready-to-fire ticket — entry, stop and target — on the platform of your choice. Nothing routes through us; your execution stays entirely yours."
              className="reveal"
            />
            <ul className="flow reveal" style={{ listStyle: "none", padding: 0, marginTop: "1.6rem" }}>
              {["One-time onboarding call sets up templates + webhooks", "Signals fire automatically to your platform", "You hold the account — we never touch capital"].map((p) => (
                <li key={p} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                  <span className="accent mono">→</span><span className="pretty">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="deploy-grid reveal" data-reveal>
            {PLATFORMS.map((p) => (
              <div className="deploy-grid__cell" key={p.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt={p.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
