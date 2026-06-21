import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Process } from "@/components/sections/Process";
import { WhyProp } from "@/components/sections/WhyProp";
import { ScalingPath } from "@/components/sections/extras";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { Cta } from "@/components/sections/Cta";

export const metadata: Metadata = {
  title: "Process",
  description: "The Meridian process — from activating your algorithms to compounding across funded and personal accounts.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="The Meridian process"
        title="From day one to compounding."
        lead="A walked-through path, not a leap of faith. Here's exactly how members go from application to a diversified book of funded and personal accounts."
        bg="/bg/nebula-1.webp"
      />
      <Process />
      <WhyProp />
      <ScalingPath />
      <CalculatorSection />
      <Cta title="Start the process." body="It begins with a single application and a short onboarding call. Everything after that is execution." />
    </>
  );
}
