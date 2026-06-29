import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BRAND } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Meridian Solutions collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" lead="Last updated June 2026." bg={null} />
      <section className="section" style={{ paddingTop: "clamp(16px,2vw,32px)" }}>
        <div className="container">
          <div className="prose">
            <p className="lede">
              {BRAND.name} (&ldquo;Meridian,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your
              privacy. This policy explains what we collect, why, and the choices you have. By using
              this site or applying for access, you agree to the practices described here.
            </p>

            <h2>Information we collect</h2>
            <p>We collect only what we need to evaluate applications and operate the service:</p>
            <ul>
              <li><strong>Application details</strong> you submit — name, email, trading experience, intended deployment, capital range and platform.</li>
              <li><strong>Communications</strong> you send us by email or on calls.</li>
              <li><strong>Usage data</strong> such as pages viewed and approximate location, collected through privacy-respecting analytics and cookies.</li>
            </ul>
            <p>We do not collect brokerage credentials, and we never have access to your trading accounts or capital.</p>

            <h2>How we use it</h2>
            <ul>
              <li>To review applications and decide whether to offer access.</li>
              <li>To onboard accepted members and provide support.</li>
              <li>To send service updates and, where you&apos;ve opted in, occasional educational email.</li>
              <li>To improve the site and protect against abuse.</li>
            </ul>

            <h2>Sharing</h2>
            <p>
              We don&apos;t sell your data. We share it only with service providers who help us run
              the business (for example, email and analytics tools) under confidentiality obligations,
              or where required by law.
            </p>

            <h2>Cookies</h2>
            <p>
              We use a small number of cookies for core functionality and aggregate analytics. You can
              disable cookies in your browser; some features may not work as well.
            </p>

            <h2>Data retention &amp; your rights</h2>
            <p>
              We keep application data only as long as needed for the purposes above. You may request
              access to, correction of, or deletion of your personal data at any time by emailing{" "}
              <a href={`mailto:${BRAND.email.support}`}>{BRAND.email.support}</a>.
            </p>

            <h2>Security</h2>
            <p>
              We use reasonable technical and organizational measures to protect your information. No
              method of transmission or storage is perfectly secure, and we cannot guarantee absolute
              security.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy? Email{" "}
              <a href={`mailto:${BRAND.email.support}`}>{BRAND.email.support}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
