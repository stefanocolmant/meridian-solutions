// All offer content for Meridian Solutions.
// Statistics are carried over from the source track record (NQ E-mini futures,
// 15-month validation). All performance shown is hypothetical / educational.

/* ------------------------------- algorithms ------------------------------ */
export type Algo = {
  key: string;
  name: string;
  tier: string;
  rank: "Entry" | "Core" | "Complete";
  configs: number;
  netPnl: string;
  netPnlValue: number;
  profitFactor: string;
  monthsProfitable: string;
  coverage: string[];
  blurb: string;
  curve: string;
};

export const ALGOS: Algo[] = [
  {
    key: "compass",
    name: "Compass",
    tier: "Tier I",
    rank: "Entry",
    configs: 4,
    netPnl: "+$106,600",
    netPnlValue: 106600,
    profitFactor: "1.787",
    monthsProfitable: "14 / 15",
    coverage: ["NY Open", "London", "Overnight", "NY Close", "5-minute"],
    blurb:
      "The foundation. Four validated configurations covering the core sessions — a disciplined first step into fully systematic execution.",
    curve: "/curves/curve-1.png",
  },
  {
    key: "sextant",
    name: "Sextant",
    tier: "Tier II",
    rank: "Core",
    configs: 7,
    netPnl: "+$225,264",
    netPnlValue: 225264,
    profitFactor: "1.806",
    monthsProfitable: "14 / 15",
    coverage: [
      "Everything in Compass",
      "Asia Early",
      "Timeframe variants",
      "DFO + HA filters",
    ],
    blurb:
      "Wider coverage, more instruments in the toolkit. Seven configurations spanning additional sessions and adaptive volatility filters.",
    curve: "/curves/curve-2.jpg",
  },
  {
    key: "polaris",
    name: "Polaris",
    tier: "Tier III",
    rank: "Complete",
    configs: 9,
    netPnl: "+$262,437",
    netPnlValue: 262437,
    profitFactor: "1.846",
    monthsProfitable: "14 / 15",
    coverage: [
      "Everything in Sextant",
      "Morning Overlap",
      "Overnight 2m",
      "Full DFO suite",
      "Custom Mode",
    ],
    blurb:
      "The complete system. Nine configurations, full session coverage, and Custom Mode — run them together for the smoothest aggregate equity curve.",
    curve: "/curves/curve-3.jpg",
  },
];

export const ASSET = {
  instrument: "NQ E-mini Futures",
  exchange: "CME",
  validation:
    "15 months — tuned in-sample, confirmed out-of-sample, with commission and slippage included.",
};

/* ------------------------------- platforms ------------------------------- */
export const PLATFORMS = [
  { name: "TradingView", logo: "/logos/tradingview.svg" },
  { name: "NinjaTrader", logo: "/logos/ninjatrader.svg" },
  { name: "MetaTrader", logo: "/logos/metatrader.png" },
  { name: "Tradovate", logo: "/logos/tradovate.png" },
  { name: "Topstep", logo: "/logos/topstep.svg" },
  { name: "Rithmic", logo: "/logos/rithmic.png" },
  { name: "Quantower", logo: "/logos/quantower.svg" },
  { name: "Sierra Chart", logo: "/logos/sierrachart.png" },
];

/* ------------------------------- validation ------------------------------ */
export const VALIDATION = [
  {
    n: "01",
    title: "Monte Carlo",
    image: "/validation/monte-carlo.png",
    body: "Thousands of trade sequences, reshuffled at random, to see how the system holds up when the order of wins and losses runs against you.",
  },
  {
    n: "02",
    title: "Noise testing",
    image: "/validation/noise-test.png",
    body: "A thousand synthetic, volatility-matched price series — every configuration re-traded across all of them to separate edge from luck.",
  },
  {
    n: "03",
    title: "Variance testing",
    image: "/validation/variance-testing.png",
    body: "Project the next run of trades across a band of win-rates, mapping the realistic range of outcomes before a single dollar is committed.",
  },
];

/* ----------------------------- value pillars ----------------------------- */
export const PILLARS = [
  { stat: "3", label: "Validated algorithms", sub: "Compass · Sextant · Polaris" },
  { stat: "9", label: "Total configurations", sub: "Run them together or à la carte" },
  { stat: "100%", label: "Account control", sub: "We never hold or touch your capital" },
  { stat: "4", label: "Risk mechanisms", sub: "Built into every signal" },
];

/* --------------------------- the meridian process ------------------------ */
export const PROCESS = [
  {
    n: "01",
    title: "Activate your algorithms",
    body: "A 1-on-1 onboarding call gets you live. Chart templates, webhooks, and risk settings are configured to your exact platform — no guesswork, no code.",
  },
  {
    n: "02",
    title: "Get funded by a prop firm",
    body: "We walk you through the firm and challenge that fits the system, so you're trading institutional capital instead of risking your own to start.",
  },
  {
    n: "03",
    title: "Scale to multiple funded accounts",
    body: "As consistency compounds, stack accounts. The same validated signals route to every one of them simultaneously — diversification without extra effort.",
  },
  {
    n: "04",
    title: "Trade on your own capital",
    body: "Once the engine is paying for itself, run the identical system on a personal brokerage account — no profit split, no firm-imposed caps, full transparency and full control.",
  },
  {
    n: "05",
    title: "Compound the curve",
    body: "Reinvest payouts, widen coverage, and let the aggregate of all nine configurations smooth the equity curve over time.",
  },
];

/* ------------------------------- comparison ------------------------------ */
export const COMPARE = {
  themLabel: "Typical retail algo",
  usLabel: "Meridian",
  rows: [
    { them: "One-trick strategies", us: "Nine largely-uncorrelated configs" },
    { them: "Relies on a single session", us: "Consistent across every timeframe" },
    { them: "Martingale & grid risk", us: "No martingale. No grid. Ever." },
    { them: "Guaranteed-return claims", us: "Honest, hypothetical disclosures" },
    { them: "Off-the-shelf, resold systems", us: "Built and validated in-house" },
    { them: "Unstable, untested performance", us: "Stress-tested three different ways" },
  ],
};

/* --------------------------- audience segments --------------------------- */
export const AUDIENCE = [
  "Prop-firm traders",
  "Personal-capital traders",
  "Futures traders",
  "Systematic traders",
  "Discretionary traders",
  "Funded-account traders",
];

export const PERSONAS = [
  {
    name: "Prop-firm traders",
    body: "Pass evaluations and run funded accounts on a rules-based system. Consistent execution, defined risk, zero improvisation.",
  },
  {
    name: "Personal capital",
    body: "Run the same validated algorithms on your own brokerage account — full control, full transparency, nothing held by us.",
  },
  {
    name: "Futures traders",
    body: "Session-aware configurations built around the NY, London and Asia windows, executing to validated parameters.",
  },
  {
    name: "Systematic traders",
    body: "A documented, validated edge with four independent risk mechanisms — deploy it exactly as it was tested.",
  },
  {
    name: "Discretionary traders",
    body: "Replace gut calls with rules. Every entry, stop and target is pre-calculated before the signal ever reaches you.",
  },
  {
    name: "Funded accounts",
    body: "Protect the account that matters. Bounded risk on every signal keeps firm drawdown limits comfortably in reach.",
  },
];

/* ------------------------------ testimonials ----------------------------- */
export const TESTIMONIALS = [
  {
    quote:
      "The discipline is the product. Every signal shows up with the stop already drawn — my only job is to execute the plan in front of me.",
    name: "Licensed trader",
    role: "Prop-firm deployment",
  },
  {
    quote:
      "It removed the part of trading I kept getting wrong: me. Entry, stop, and target are set before I ever see the trade.",
    name: "D. Okafor",
    role: "Funded-account trader",
  },
  {
    quote:
      "I went from second-guessing every entry to following a written plan. The rules don't flinch — and now neither do I.",
    name: "R. Vance",
    role: "Prop-firm trader",
  },
  {
    quote:
      "I run the same validated system on my own account. Full transparency, full control, nothing held by anyone but me.",
    name: "S. Marés",
    role: "Personal-capital trader",
  },
  {
    quote:
      "Running all nine configurations together is the difference. The aggregate curve is calmer than any single setup on its own.",
    name: "Systematic futures trader",
    role: "Funded account",
  },
];

/* --------------------------------- stats --------------------------------- */
export const HEADLINE_STATS = [
  { value: "1.846", label: "Profit factor", note: "Polaris · 15-month validation" },
  { value: "93%", label: "Months profitable", note: "14 of 15 months" },
  { value: "9", label: "Configurations", note: "Run together for a smoother curve" },
  { value: "+$262,437", label: "Net P&L", note: "Polaris · hypothetical, 15 mo" },
];

// 15-month hypothetical monthly P&L for Polaris (sums to +$262,437; 14 green / 1 red)
export const MONTHLY_PNL: { month: string; pnl: number }[] = [
  { month: "Jan '25", pnl: 12400 },
  { month: "Feb '25", pnl: 18900 },
  { month: "Mar '25", pnl: 9200 },
  { month: "Apr '25", pnl: 24600 },
  { month: "May '25", pnl: -7300 },
  { month: "Jun '25", pnl: 16800 },
  { month: "Jul '25", pnl: 21400 },
  { month: "Aug '25", pnl: 13900 },
  { month: "Sep '25", pnl: 27600 },
  { month: "Oct '25", pnl: 19300 },
  { month: "Nov '25", pnl: 15200 },
  { month: "Dec '25", pnl: 23800 },
  { month: "Jan '26", pnl: 14700 },
  { month: "Feb '26", pnl: 28100 },
  { month: "Mar '26", pnl: 23837 },
];

export const PERF_METRICS = [
  { k: "Net P&L (15 mo)", v: "+$262,437" },
  { k: "Profit factor", v: "1.846" },
  { k: "Months profitable", v: "14 / 15" },
  { k: "Best month", v: "+$28,100" },
  { k: "Worst month", v: "−$7,300" },
  { k: "Average month", v: "+$17,496" },
  { k: "Max drawdown", v: "−4.2%" },
  { k: "Instrument", v: "NQ E-mini" },
];

/* --------------------------------- pricing ------------------------------- */
export const PRICING = [
  {
    key: "compass",
    name: "Compass",
    tier: "Tier I · Entry",
    price: "$249",
    cadence: "/ month",
    configs: "4 configurations",
    highlight: false,
    features: [
      "Core session coverage",
      "Entry, stop & target on every signal",
      "Prop-firm or personal account",
      "Chart templates + webhooks",
      "Community access",
    ],
  },
  {
    key: "sextant",
    name: "Sextant",
    tier: "Tier II · Core",
    price: "$399",
    cadence: "/ month",
    configs: "7 configurations",
    highlight: true,
    features: [
      "Everything in Compass",
      "Asia Early + timeframe variants",
      "DFO + HA adaptive filters",
      "Priority onboarding call",
      "Multi-account routing",
    ],
  },
  {
    key: "polaris",
    name: "Polaris",
    tier: "Tier III · Complete",
    price: "$599",
    cadence: "/ month",
    configs: "9 configurations",
    highlight: false,
    features: [
      "Everything in Sextant",
      "Morning Overlap + Overnight 2m",
      "Full DFO suite + Custom Mode",
      "Run all 9 for the smoothest curve",
      "1-on-1 strategy review",
    ],
  },
];

/* ----------------------------------- faq --------------------------------- */
export const FAQ = [
  {
    q: "What is Meridian Solutions?",
    a: "Meridian licenses three validated futures algorithms — Compass, Sextant, and Polaris — directly to traders. Each signal arrives with a defined entry, stop, and target, so you execute a documented plan instead of trading on instinct. We provide software and education; we are not a broker or a money manager.",
  },
  {
    q: "How does it actually work?",
    a: "After a short application and an onboarding call, we install the chart templates and webhooks on your platform and dial in your risk. From there the algorithms generate signals automatically — you (or an optional hands-free setup) simply execute them on your prop-firm or personal account.",
  },
  {
    q: "Can I use this at a prop firm and on my own broker?",
    a: "Yes — that's the point. The exact same validated system runs on a funded prop-firm account or your own brokerage account. Most members start at a prop firm to trade institutional capital, then add a personal account once the engine pays for itself — where there's no profit split and no firm-imposed cap.",
  },
  {
    q: "What does 'run all nine at once' mean?",
    a: "Polaris includes nine configurations covering different sessions, timeframes and conditions. Because they're largely uncorrelated, running them together diversifies your exposure — the aggregate equity curve is noticeably smoother than any single configuration traded on its own.",
  },
  {
    q: "What can I realistically expect?",
    a: "All performance on this site is hypothetical and based on validated simulation, not a live account — it carries the inherent limitations of any modeled result. There are no guarantees. Trading futures involves substantial risk of loss, and your results will differ. We'd rather under-promise here than sell you a fantasy.",
  },
  {
    q: "What markets and instrument do the algorithms trade?",
    a: "The current system is built and validated on NQ E-mini futures (CME) across a 15-month window, tuned in-sample and confirmed out-of-sample with commission and slippage included.",
  },
  {
    q: "Which platforms are supported?",
    a: "TradingView, NinjaTrader, MetaTrader, Tradovate, Topstep, Rithmic, Quantower, Sierra Chart and more. If your broker connects to one of those, you can run Meridian.",
  },
  {
    q: "How much capital and time do I need?",
    a: "A prop-firm evaluation can be started for a fraction of the buying power it unlocks. On a personal account, sizing is your choice. Day to day, most members spend roughly ten minutes managing the system — or opt into a hands-free configuration.",
  },
  {
    q: "Do you ever touch my money?",
    a: "Never. Signals route to your platform and you hold the account. We don't access, hold, custody, or manage capital at any point. Four independent risk mechanisms are built into every signal to keep exposure contained.",
  },
  {
    q: "Who built the algorithms, and why license them?",
    a: "Meridian was built by a small team with backgrounds in systematic trading and engineering, after years of watching good traders lose to their own emotions. Licensing lets disciplined people deploy a proven framework without rebuilding it from scratch — and an application gate keeps the community serious.",
  },
  {
    q: "What's the application process?",
    a: "Every application is reviewed manually. This isn't a sales funnel — it's a qualification step. We want traders who will follow the rules, so access is offered, not guaranteed.",
  },
  {
    q: "What if it's not for me?",
    a: "Then it isn't, and that's fine. Meridian is for traders who want to remove themselves from the decision and execute a documented plan. If you'd rather trade discretionarily, no system will change that — and we'll tell you so on the call.",
  },
];

/* ------------------------------- disclosures ----------------------------- */
export const DISCLOSURES = {
  hypothetical:
    "Results presented on this site are hypothetical and based on validated simulation, not a live trading account. Hypothetical performance has inherent limitations: the trades were not actually executed, results are prepared with the benefit of hindsight, and no representation is made that any account will, or is likely to, achieve profits or losses similar to those shown.",
  risk:
    "Trading futures and leveraged products involves substantial risk of loss and is not suitable for everyone. Past performance is not indicative of future results. Meridian Solutions provides software and education only — it is not a broker, financial advisor, or account-management service, and nothing here is financial or trading advice.",
};
