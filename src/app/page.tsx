import { Hero } from "@/components/Hero";
import { SignalTicker } from "@/components/SignalTicker";
import { Platforms } from "@/components/sections/Platforms";
import { Pillars } from "@/components/sections/Pillars";
import { AlgoTiers } from "@/components/sections/AlgoTiers";
import { StatsBand } from "@/components/sections/StatsBand";
import { Deploy } from "@/components/sections/Deploy";
import { Process } from "@/components/sections/Process";
import { Trades } from "@/components/sections/Trades";
import { Personas } from "@/components/sections/Personas";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";

// Home = the curated OVERVIEW. The deep material lives on its own pages:
// equity curves → /performance, validation → /methodology, comparison → /pricing,
// run-all → /algorithms, calculator → /calculator, the full funnel → /start.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Platforms />
      <SignalTicker />
      <Pillars />
      <AlgoTiers />
      <StatsBand />
      <Deploy />
      <Process />
      <Trades />
      <Personas />
      <Testimonials />
      <FaqSection limit={6} />
    </>
  );
}
