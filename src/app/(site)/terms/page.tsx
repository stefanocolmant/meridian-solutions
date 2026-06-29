import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BRAND } from "@/content/site";
import { DISCLOSURES } from "@/content/data";

export const metadata: Metadata = {
  title: "Terms & Risk Disclosure",
  description: "Terms of use and trading risk disclosure for Meridian Solutions.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Risk" lead="Last updated June 2026." bg={null} />
      <section className="section" style={{ paddingTop: "clamp(16px,2vw,32px)" }}>
        <div className="container">
          <div className="prose">
            <p className="lede">
              These terms govern your use of the {BRAND.name} website and services. By accessing the
              site or licensing our software, you agree to them. If you don&apos;t agree, don&apos;t
              use the service.
            </p>

            <h2>What Meridian is — and isn&apos;t</h2>
            <p>
              {BRAND.name} provides <strong>software and education only</strong>. We are not a broker,
              not a dealer, not an investment adviser, not a commodity trading advisor, and not an
              account-management service. We never take custody of, access, or manage your capital.
              Nothing on this site is financial, investment, or trading advice.
            </p>

            <h2>Licensing</h2>
            <p>
              A subscription grants you a personal, non-transferable, revocable licence to use the
              algorithms and templates for your own trading. You may not resell, redistribute,
              sublicense, or reverse-engineer them. We may suspend or revoke access for misuse.
            </p>

            <h2>Hypothetical performance</h2>
            <p>{DISCLOSURES.hypothetical}</p>

            <h2 id="risk">Risk disclosure</h2>
            <p>{DISCLOSURES.risk}</p>
            <p>
              You are solely responsible for your own trading decisions, position sizing, and risk
              management. Only trade with capital you can afford to lose. Prop-firm rules, fees, and
              payout terms are set by those firms, not by Meridian.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, {BRAND.name} is not liable for any trading
              losses or for any indirect, incidental, or consequential damages arising from use of the
              site or the software. The service is provided &ldquo;as is&rdquo; without warranties of
              any kind.
            </p>

            <h2>Changes</h2>
            <p>
              We may update these terms from time to time. Continued use after changes constitutes
              acceptance. Material changes will be reflected in the &ldquo;last updated&rdquo; date
              above.
            </p>

            <h2>Contact</h2>
            <p>
              Questions? Email <a href={`mailto:${BRAND.email.support}`}>{BRAND.email.support}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
