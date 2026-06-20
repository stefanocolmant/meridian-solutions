import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/sections/Cta";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Straight answers about how Meridian Solutions works, what to expect, and where the limits are.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Questions, answered"
        title="No mystery. No hype."
        lead="The honest version of everything we get asked — how it works, what's realistic, and what we'll never do with your account."
        bg="/bg/nebula-3.webp"
      />
      <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
        <div className="container" style={{ maxWidth: "var(--maxw)" }}>
          <div data-reveal>
            <Faq />
          </div>
        </div>
      </section>
      <Cta title="Still have a question?" body="The fastest way to get a straight answer is to apply and ask on the onboarding call." />
    </>
  );
}
