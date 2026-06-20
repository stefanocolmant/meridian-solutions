import { Hero } from "@/components/Hero";
import { SignalTicker } from "@/components/SignalTicker";
import { Platforms } from "@/components/sections/Platforms";
import { Pillars } from "@/components/sections/Pillars";
import { AlgoTiers } from "@/components/sections/AlgoTiers";
import { RunAll } from "@/components/sections/RunAll";
import { StatsBand } from "@/components/sections/StatsBand";
import { EquityCurves } from "@/components/sections/EquityCurves";
import { Validation } from "@/components/sections/Validation";
import { Deploy } from "@/components/sections/Deploy";
import { Process } from "@/components/sections/Process";
import { WhyProp } from "@/components/sections/WhyProp";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { Comparison } from "@/components/sections/Comparison";
import { Trades } from "@/components/sections/Trades";
import { Personas } from "@/components/sections/Personas";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Platforms />
      <SignalTicker />
      <Pillars />
      <AlgoTiers />
      <RunAll />
      <StatsBand />
      <EquityCurves />
      <Validation />
      <Deploy />
      <Process />
      <WhyProp />
      <CalculatorSection />
      <Comparison />
      <Trades />
      <Personas />
      <Testimonials />
      <FaqSection limit={6} />
    </>
  );
}
