/* ============================================================================
   MERIDIAN PORTAL — demo data (deterministic, SSR-safe).
   No wall-clock / Math.random at module scope: a seeded RNG + a fixed anchor
   date keep server and client renders identical (no hydration drift).
   All numbers are hypothetical / illustrative.
   ========================================================================== */

import { ymd } from "./format";

/* ----------------------------- seeded RNG -------------------------------- */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ANCHOR = new Date(2026, 5, 26); // Fri 26 Jun 2026 — "today"
function daysAgo(n: number): Date {
  const d = new Date(ANCHOR);
  d.setDate(d.getDate() - n);
  return d;
}
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/* ------------------------------- the member ------------------------------ */
export const ME = {
  name: "Jordan Reyes",
  firstName: "Jordan",
  email: "demo@meridiansolutions.co",
  tier: "polaris" as const,
  tierLabel: "Polaris",
  initials: "JR",
  memberSince: "January 2025",
  tvUsername: "jreyes_nq",
  automationPlatform: "TradersPost",
  assignedAlgorithm: "Polaris — All Nine",
  forwardingUrl: "https://hook.meridiansolutions.co/u/9f2a7c41",
  webhookUrl: "https://hook.meridiansolutions.co/tv",
  timezone: "America/New_York",
};

export const TIER_CONFIGS: Record<string, number> = { compass: 4, quadrant: 7, polaris: 9 };

/* ------------------------------- accounts -------------------------------- */
export interface Account {
  id: string;
  name: string;
  firm: string;
  accountId: string;
  environment: "Funded" | "Evaluation";
  netLiq: number;
  cash: number;
  todayPnl: number;
  realizedToday: number;
  openPnl: number;
  weekRealized: number;
  startingBalance: number;
  lifetimePnl: number;
  trailingFloor: number;
  distanceToFloor: number;
  locked: boolean;
  trades: number;
  lastSync: string;
}

export const ACCOUNTS: Account[] = [
  { id: "a1", name: "Apex 150K — #1", firm: "Apex", accountId: "APEX-7741", environment: "Funded", netLiq: 162840, cash: 161200, todayPnl: 1840, realizedToday: 1640, openPnl: 200, weekRealized: 6120, startingBalance: 150000, lifetimePnl: 12840, trailingFloor: 155600, distanceToFloor: 7240, locked: false, trades: 214, lastSync: "2 min ago" },
  { id: "a2", name: "Topstep 100K", firm: "Topstep", accountId: "TS-22418", environment: "Funded", netLiq: 108310, cash: 108310, todayPnl: -420, realizedToday: -420, openPnl: 0, weekRealized: 3380, startingBalance: 100000, lifetimePnl: 8310, trailingFloor: 104000, distanceToFloor: 4310, locked: true, trades: 167, lastSync: "2 min ago" },
  { id: "a3", name: "MyFundedFutures 50K", firm: "MyFundedFutures", accountId: "MFF-9923", environment: "Funded", netLiq: 56720, cash: 56720, todayPnl: 760, realizedToday: 760, openPnl: 0, weekRealized: 2140, startingBalance: 50000, lifetimePnl: 6720, trailingFloor: 53000, distanceToFloor: 3720, locked: false, trades: 132, lastSync: "5 min ago" },
  { id: "a4", name: "Apex 50K — Eval", firm: "Apex", accountId: "APEX-8120", environment: "Evaluation", netLiq: 53110, cash: 53110, todayPnl: 310, realizedToday: 310, openPnl: 0, weekRealized: 1290, startingBalance: 50000, lifetimePnl: 3110, trailingFloor: 51500, distanceToFloor: 1610, locked: false, trades: 78, lastSync: "5 min ago" },
];

export const TOTALS = {
  netLiq: ACCOUNTS.reduce((s, a) => s + a.netLiq, 0),
  todayPnl: ACCOUNTS.reduce((s, a) => s + a.todayPnl, 0),
  lifetimePnl: ACCOUNTS.reduce((s, a) => s + a.lifetimePnl, 0),
  cash: ACCOUNTS.reduce((s, a) => s + a.cash, 0),
  trades: ACCOUNTS.reduce((s, a) => s + a.trades, 0),
  funded: ACCOUNTS.filter((a) => a.environment === "Funded").length,
  count: ACCOUNTS.length,
};

/* ------------------------------- equity ---------------------------------- */
export interface EquityPoint { date: string; label: string; equity: number; pnl: number; }
export const EQUITY: EquityPoint[] = (() => {
  const rng = mulberry32(20260626);
  const out: EquityPoint[] = [];
  let eq = 354000;
  const N = 90;
  for (let i = N; i >= 0; i--) {
    const d = daysAgo(i);
    const wd = d.getDay();
    const trading = wd !== 0 && wd !== 6;
    const drift = trading ? (rng() - 0.34) * 5200 : 0;
    const pnl = Math.round(drift);
    eq += pnl;
    out.push({ date: ymd(d), label: fmtDate(d), equity: Math.round(eq), pnl });
  }
  return out;
})();

/* --------------------------- KPIs + stats band --------------------------- */
export const KPIS = {
  winRate: 61.4,
  profitFactor: 1.846,
  avgRR: 1.92,
  maxDrawdown: -4.2,
};

export const STATS_BAND = [
  { label: "Avg win", value: "+$612", tone: "pos" as const },
  { label: "Avg loss", value: "−$318", tone: "neg" as const },
  { label: "Best trade", value: "+$4,180", tone: "pos" as const },
  { label: "Worst trade", value: "−$1,260", tone: "neg" as const },
  { label: "Avg trade", value: "+$233", tone: "pos" as const },
  { label: "Win streak", value: "11", tone: "flat" as const },
  { label: "Loss streak", value: "4", tone: "flat" as const },
  { label: "Trades", value: "591", tone: "flat" as const },
];

/* -------------------------------- trades --------------------------------- */
export interface Trade {
  id: string;
  symbol: string;
  assetClass: string;
  side: "Long" | "Short";
  entry: number;
  exit: number;
  qty: number;
  pnl: number;
  fees: number;
  account: string;
  accountId: string;
  openedAt: string;
  closedAt: string;
  date: string;
  weekday: string;
  hour: number;
  duration: string;
  rMultiple: number;
}

const SYMBOLS = ["NQ", "MNQ", "ES", "MES"];
const SESSIONS = [
  { h: 9, label: "NY Open" },
  { h: 10, label: "NY Open" },
  { h: 11, label: "Morning" },
  { h: 14, label: "PM Session" },
  { h: 3, label: "London" },
  { h: 20, label: "Overnight" },
];

export const TRADES: Trade[] = (() => {
  const rng = mulberry32(770118);
  const out: Trade[] = [];
  let id = 1;
  for (let day = 0; day < 34; day++) {
    const d = daysAgo(day);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    const count = 1 + Math.floor(rng() * 4);
    for (let k = 0; k < count; k++) {
      const sym = SYMBOLS[Math.floor(rng() * SYMBOLS.length)];
      const big = sym === "NQ" || sym === "ES";
      const side: "Long" | "Short" = rng() > 0.46 ? "Long" : "Short";
      const sess = SESSIONS[Math.floor(rng() * SESSIONS.length)];
      const base = sym.includes("N") ? 19800 + rng() * 600 : 5400 + rng() * 120;
      // Positive-expectancy generator: ~61% win rate with wins larger than
      // losses, so the demo trader is a net winner (matches the headline stats).
      const win = rng() < 0.61;
      const ptValue = sym === "NQ" ? 20 : sym === "MNQ" ? 2 : sym === "ES" ? 50 : 5;
      const qty = big ? 1 + Math.floor(rng() * 2) : 1 + Math.floor(rng() * 5);
      const points = win ? 5 + rng() * 15 : 3 + rng() * 9;
      const dir = side === "Long" ? 1 : -1;
      const entry = +base.toFixed(2);
      const exit = +(base + dir * (win ? points : -points)).toFixed(2);
      const gross = (win ? 1 : -1) * points * ptValue * qty;
      const fees = +(qty * 1.34 * 2).toFixed(2);
      const pnl = Math.round(gross - fees);
      const mins = 4 + Math.floor(rng() * 90);
      const duration = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
      out.push({
        id: `T-${String(id).padStart(4, "0")}`,
        symbol: sym,
        assetClass: "Futures",
        side,
        entry,
        exit,
        qty,
        pnl,
        fees,
        account: ACCOUNTS[Math.floor(rng() * ACCOUNTS.length)].name,
        accountId: ACCOUNTS[Math.floor(rng() * ACCOUNTS.length)].accountId,
        openedAt: `${String(sess.h).padStart(2, "0")}:${String(2 + Math.floor(rng() * 55)).padStart(2, "0")}`,
        closedAt: `${String(sess.h).padStart(2, "0")}:${String(40 + Math.floor(rng() * 19)).padStart(2, "0")}`,
        date: ymd(d),
        weekday: WEEKDAYS[wd],
        hour: sess.h,
        duration,
        rMultiple: +(win ? 0.8 + rng() * 2.4 : -(0.6 + rng() * 0.8)).toFixed(2),
      });
      id++;
    }
  }
  return out;
})();

export const POSITION_COUNTS = {
  open: 2,
  closedToday: TRADES.filter((t) => t.date === ymd(ANCHOR)).length,
  closedAllTime: 591,
};

/* -------------------------------- signals -------------------------------- */
export interface ForwardLog { attempt: number; destination: string; status: "Delivered" | "Failed" | "Retry"; code: number; latencyMs: number; error?: string; }
export interface Signal {
  id: string;
  algo: string;
  symbol: string;
  direction: "Long" | "Short";
  action: "Entry" | "Exit" | "Stop" | "Target";
  timeframe: string;
  price: number;
  tier: string;
  ago: string;
  status: "Forwarded" | "Failed" | "Pending";
  latencyMs: number;
  logs: ForwardLog[];
}

export const SIGNALS: Signal[] = (() => {
  const rng = mulberry32(424242);
  const algos = ["NY Open", "London", "PM Session", "Overnight", "Asia Early", "Morning Overlap"];
  const actions: Signal["action"][] = ["Entry", "Exit", "Target", "Stop"];
  const tfs = ["5m", "2m", "15m"];
  const agos = ["just now", "3m ago", "12m ago", "27m ago", "48m ago", "1h ago", "2h ago", "3h ago", "5h ago", "today 09:41", "today 09:32", "today 08:55", "yest 15:10", "yest 14:02"];
  const out: Signal[] = [];
  for (let i = 0; i < 14; i++) {
    const fail = rng() > 0.86;
    const sym = SYMBOLS[Math.floor(rng() * 2)];
    const latency = 80 + Math.floor(rng() * 320);
    out.push({
      id: `S-${2200 - i}`,
      algo: algos[Math.floor(rng() * algos.length)],
      symbol: sym,
      direction: rng() > 0.5 ? "Long" : "Short",
      action: actions[Math.floor(rng() * actions.length)],
      timeframe: tfs[Math.floor(rng() * tfs.length)],
      price: +(19800 + rng() * 700).toFixed(2),
      tier: rng() > 0.5 ? "Polaris" : "Quadrant",
      ago: agos[i],
      status: fail ? "Failed" : "Forwarded",
      latencyMs: latency,
      logs: [
        { attempt: 1, destination: "TradersPost · NQ", status: fail ? "Failed" : "Delivered", code: fail ? 504 : 200, latencyMs: latency, error: fail ? "Upstream timeout" : undefined },
        ...(fail ? [{ attempt: 2, destination: "TradersPost · NQ", status: "Delivered" as const, code: 200, latencyMs: latency + 60 }] : []),
      ],
    });
  }
  return out;
})();

export const SIGNAL_SUMMARY = {
  today: 23,
  total: 4187,
  successRate: 98.4,
  delivered: 4120,
  failed: 67,
  lastSignal: "09:41 ET",
};

export const STRATEGY_ACTIVITY = [
  { name: "Quadrant — MT execution", count: 9, total: 23, tone: "quadrant" },
  { name: "Polaris — Tradovate", count: 14, total: 23, tone: "polaris" },
];

/* ------------------------------ performance ------------------------------ */
function bucketByHour() {
  const map = new Map<number, { pnl: number; trades: number }>();
  for (const t of TRADES) {
    const cur = map.get(t.hour) ?? { pnl: 0, trades: 0 };
    cur.pnl += t.pnl;
    cur.trades += 1;
    map.set(t.hour, cur);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([h, v]) => ({ time: `${String(h).padStart(2, "0")}:00`, ...v }));
}
function bucketByWeekday() {
  const order = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return order.map((day) => {
    const ts = TRADES.filter((t) => t.weekday === day);
    return { day, pnl: ts.reduce((s, t) => s + t.pnl, 0), trades: ts.length };
  });
}
function bucketBySymbol() {
  return SYMBOLS.map((sym) => {
    const ts = TRADES.filter((t) => t.symbol === sym);
    const wins = ts.filter((t) => t.pnl > 0).length;
    return { symbol: sym, pnl: ts.reduce((s, t) => s + t.pnl, 0), trades: ts.length, winRate: ts.length ? Math.round((wins / ts.length) * 100) : 0 };
  }).sort((a, b) => b.pnl - a.pnl);
}
function drawdownSeries() {
  let peak = -Infinity;
  return EQUITY.map((p) => {
    peak = Math.max(peak, p.equity);
    return { date: p.date, label: p.label, drawdown: +(((p.equity - peak) / peak) * 100).toFixed(2) };
  });
}

export const PERF = {
  summary: {
    holdWinners: "14m",
    holdLosers: "9m",
    avgWinPct: 0.42,
    avgLossPct: -0.21,
    streak: 6,
    bestStreak: 11,
    worstStreak: 4,
    longPnl: 78420,
    shortPnl: 41260,
  },
  byHour: bucketByHour(),
  byWeekday: bucketByWeekday(),
  bySymbol: bucketBySymbol(),
  best5: [...TRADES].sort((a, b) => b.pnl - a.pnl).slice(0, 5),
  worst5: [...TRADES].sort((a, b) => a.pnl - b.pnl).slice(0, 5),
  bySide: {
    long: { pnl: 78420, trades: TRADES.filter((t) => t.side === "Long").length, wins: TRADES.filter((t) => t.side === "Long" && t.pnl > 0).length },
    short: { pnl: 41260, trades: TRADES.filter((t) => t.side === "Short").length, wins: TRADES.filter((t) => t.side === "Short" && t.pnl > 0).length },
  },
  drawdown: drawdownSeries(),
  metrics: [
    { k: "Net P&L (90d)", v: "+$119,680" },
    { k: "Profit factor", v: "1.846" },
    { k: "Win rate", v: "61.4%" },
    { k: "Avg R:R", v: "1.92" },
    { k: "Max drawdown", v: "−4.2%" },
    { k: "Sharpe (est.)", v: "2.31" },
    { k: "Best day", v: "+$8,940" },
    { k: "Worst day", v: "−$3,210" },
  ],
};

/* -------------------------------- calendar ------------------------------- */
export interface CalDay { date: string; day: number; pnl: number; trades: number; wins: number; losses: number; }
export const CAL_MONTH = { label: "June 2026", year: 2026, month: 5 };
export const CALENDAR: CalDay[] = (() => {
  const first = new Date(2026, 5, 1);
  const days = new Date(2026, 6, 0).getDate();
  const out: CalDay[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(2026, 5, i + 1);
    const key = ymd(d);
    const ts = TRADES.filter((t) => t.date === key);
    out.push({
      date: key,
      day: i + 1,
      pnl: ts.reduce((s, t) => s + t.pnl, 0),
      trades: ts.length,
      wins: ts.filter((t) => t.pnl > 0).length,
      losses: ts.filter((t) => t.pnl < 0).length,
    });
  }
  void first;
  return out;
})();
export const CAL_FIRST_WEEKDAY = new Date(2026, 5, 1).getDay();
export const CAL_TOTAL = {
  pnl: CALENDAR.reduce((s, d) => s + d.pnl, 0),
  trades: CALENDAR.reduce((s, d) => s + d.trades, 0),
  green: CALENDAR.filter((d) => d.pnl > 0).length,
  red: CALENDAR.filter((d) => d.pnl < 0).length,
};

/* -------------------------------- payouts -------------------------------- */
export interface Payout { id: string; account: string; amount: number; status: "Paid" | "Pending" | "Rejected"; requestedAt: string; paidAt: string | null; notes: string; }
export const PAYOUTS: Payout[] = [
  { id: "P-0091", account: "Apex 150K — #1", amount: 6200, status: "Paid", requestedAt: "Jun 12, 2026", paidAt: "Jun 14, 2026", notes: "Monthly draw" },
  { id: "P-0088", account: "Topstep 100K", amount: 4000, status: "Paid", requestedAt: "Jun 02, 2026", paidAt: "Jun 04, 2026", notes: "" },
  { id: "P-0096", account: "MyFundedFutures 50K", amount: 2500, status: "Pending", requestedAt: "Jun 24, 2026", paidAt: null, notes: "Awaiting review" },
  { id: "P-0079", account: "Apex 150K — #1", amount: 5800, status: "Paid", requestedAt: "May 15, 2026", paidAt: "May 17, 2026", notes: "" },
  { id: "P-0071", account: "Topstep 100K", amount: 3200, status: "Rejected", requestedAt: "May 03, 2026", paidAt: null, notes: "Consistency rule — re-submit" },
];
export const PAYOUT_SUMMARY = {
  totalPaid: PAYOUTS.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0),
  pending: PAYOUTS.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0),
  requests: PAYOUTS.length,
};

/* ------------------------------- milestones ------------------------------ */
export interface Milestone { id: string; firm: string; type: string; startingBalance: number; currentBalance: number; status: "Approved" | "Pending" | "Rejected"; submittedAt: string; notes: string; }
export const MILESTONES: Milestone[] = [
  { id: "M-21", firm: "Apex", type: "Funded account", startingBalance: 150000, currentBalance: 162840, status: "Approved", submittedAt: "Jun 18, 2026", notes: "Verified" },
  { id: "M-19", firm: "Topstep", type: "Challenge passed", startingBalance: 100000, currentBalance: 106400, status: "Approved", submittedAt: "Jun 05, 2026", notes: "" },
  { id: "M-23", firm: "MyFundedFutures", type: "First payout", startingBalance: 50000, currentBalance: 56720, status: "Pending", submittedAt: "Jun 25, 2026", notes: "In review" },
  { id: "M-15", firm: "Apex", type: "Benchmark", startingBalance: 50000, currentBalance: 53110, status: "Rejected", submittedAt: "May 20, 2026", notes: "Screenshot unclear — resubmit" },
];
export const MILESTONE_TYPES = ["Challenge passed", "Funded account", "First payout", "Benchmark"];

/* -------------------------------- journal -------------------------------- */
export interface Strategy { id: string; name: string; items: string[]; }
export const STRATEGIES: Strategy[] = [
  { id: "s1", name: "NY Open Breakout", items: ["Wait for first 5m range", "Trade with prevailing trend", "Stop beyond range", "1.5R minimum target"] },
  { id: "s2", name: "London Reversal", items: ["Identify Asian range", "Fade liquidity sweep", "Confirm with 2m structure"] },
  { id: "s3", name: "PM Trend Continuation", items: ["Above/below VWAP", "Pullback to 9 EMA", "Target prior high/low"] },
];
export interface JournalEntry { id: string; symbol: string; side: "Long" | "Short"; title: string; rating: number; pnl: number; date: string; entry: number; stop: number; target: number; tags: string[]; strategy: string; rulesMet: number; rulesTotal: number; notes: string; }
export const JOURNAL: JournalEntry[] = [
  { id: "j1", symbol: "NQ", side: "Long", title: "Clean NY open continuation", rating: 5, pnl: 1840, date: "Jun 26", entry: 19842, stop: 19818, target: 19905, tags: ["A+", "breakout", "patient"], strategy: "NY Open Breakout", rulesMet: 4, rulesTotal: 4, notes: "Waited for the range, entered on retest. Textbook." },
  { id: "j2", symbol: "MNQ", side: "Short", title: "Faded London sweep", rating: 4, pnl: 620, date: "Jun 25", entry: 19960, stop: 19984, target: 19900, tags: ["reversal", "liquidity"], strategy: "London Reversal", rulesMet: 3, rulesTotal: 3, notes: "Good read on the sweep, took partial early." },
  { id: "j3", symbol: "NQ", side: "Long", title: "Forced a PM entry", rating: 2, pnl: -740, date: "Jun 24", entry: 19788, stop: 19770, target: 19840, tags: ["B-", "impatient"], strategy: "PM Trend Continuation", rulesMet: 1, rulesTotal: 4, notes: "No setup, chased. Broke my own rules." },
  { id: "j4", symbol: "ES", side: "Short", title: "Range fade at highs", rating: 4, pnl: 980, date: "Jun 23", entry: 5512, stop: 5519, target: 5494, tags: ["range", "mean-revert"], strategy: "London Reversal", rulesMet: 3, rulesTotal: 3, notes: "Clean rejection, managed well." },
  { id: "j5", symbol: "NQ", side: "Long", title: "Overnight gap continuation", rating: 5, pnl: 2160, date: "Jun 20", entry: 19610, stop: 19584, target: 19700, tags: ["A+", "trend"], strategy: "NY Open Breakout", rulesMet: 4, rulesTotal: 4, notes: "Best trade of the week. Let it run." },
];
export const JOURNAL_STATS = {
  avgRating: 4.0,
  totalPnl: JOURNAL.reduce((s, e) => s + e.pnl, 0),
  winRate: Math.round((JOURNAL.filter((e) => e.pnl > 0).length / JOURNAL.length) * 100),
  entries: JOURNAL.length,
};

/* --------------------------------- news ---------------------------------- */
export interface NewsArticle { id: string; source: string; title: string; summary: string; tags: string[]; relevance: number; ago: string; }
export const NEWS: NewsArticle[] = [
  { id: "n1", source: "Reuters", title: "Nasdaq futures edge higher ahead of PCE inflation print", summary: "NQ traded up 0.4% overnight as traders positioned ahead of the Fed's preferred inflation gauge. A cooler-than-expected reading could extend the tech rally into month-end.", tags: ["NQ", "Fed", "CPI"], relevance: 9, ago: "32m ago" },
  { id: "n2", source: "Bloomberg", title: "Treasury yields slip as labor market shows cracks", summary: "The 10-year yield fell 4bps after jobless claims rose. Lower yields are typically supportive for high-duration tech names that dominate the Nasdaq.", tags: ["Bonds", "Treasury", "NFP"], relevance: 8, ago: "1h ago" },
  { id: "n3", source: "CNBC", title: "Gold holds near record as haven demand persists", summary: "Spot gold steadied above $2,400 amid geopolitical tension. Correlations with index futures remain weak this week.", tags: ["Gold", "Geopolitical"], relevance: 5, ago: "2h ago" },
  { id: "n4", source: "MarketWatch", title: "VIX compresses to multi-week low into quarter-end", summary: "Implied volatility drifted lower as realized vol collapsed. Lower VIX often accompanies grind-higher tape — favorable for trend configs, tougher for mean-reversion.", tags: ["VIX", "ES"], relevance: 7, ago: "3h ago" },
  { id: "n5", source: "Reuters", title: "Crude steadies after OPEC+ signals steady output", summary: "WTI hovered near $78. Limited spillover into equity index futures expected.", tags: ["Crude"], relevance: 4, ago: "5h ago" },
];
export const NEWS_TAGS = ["All", "NQ", "ES", "Fed", "CPI", "NFP", "Gold", "Crude", "Bonds", "Treasury", "Geopolitical", "VIX"];

/* ---------------------------------- faq ---------------------------------- */
export interface FaqCategory { title: string; items: { q: string; a: string }[]; }
export const PORTAL_FAQ: FaqCategory[] = [
  { title: "Getting started", items: [
    { q: "How do I activate my algorithms?", a: "Your onboarding call configures chart templates, webhooks and risk settings for your platform. Once Software Setup shows all green, signals route automatically." },
    { q: "Which accounts can I run?", a: "Any prop-firm or personal account that accepts webhook automation. Most members run multiple funded accounts simultaneously — every signal routes to all of them." },
  ] },
  { title: "Signals & forwarding", items: [
    { q: "What happens if a signal fails to forward?", a: "The system retries automatically and logs every attempt on the Signal Feed. Persistent failures alert you and our desk." },
    { q: "Can I see why a trade was taken?", a: "Every signal carries its algorithm, direction, timeframe and price. The Journal lets you annotate the reasoning yourself." },
  ] },
  { title: "Risk & safeguards", items: [
    { q: "Does Meridian ever place orders for me?", a: "No. We never hold, custody, or manage capital. Signals route to your platform and you keep full account control at all times." },
    { q: "What are the four risk mechanisms?", a: "Per-trade stop, daily-loss advisory, max-trades guardrail, and session restrictions. They warn — they don't force-close — so you stay in control." },
  ] },
];

/* -------------------------------- training ------------------------------- */
export interface TrainingModule { n: number; title: string; videos: { title: string; description: string; done: boolean }[]; locked: boolean; }
export const TRAINING: TrainingModule[] = [
  { n: 1, title: "Orientation", locked: false, videos: [
    { title: "Welcome to Meridian", description: "How the system works end to end.", done: true },
    { title: "The three algorithms", description: "Compass, Quadrant, Polaris explained.", done: true },
    { title: "Reading a signal", description: "Anatomy of an entry/stop/target.", done: true },
  ] },
  { n: 2, title: "Platform setup", locked: false, videos: [
    { title: "Installing the master chart", description: "TradingView template walkthrough.", done: true },
    { title: "Webhook configuration", description: "Connecting your forwarder.", done: false },
    { title: "Your first test signal", description: "Verifying the pipeline.", done: false },
  ] },
  { n: 3, title: "Risk & sizing", locked: false, videos: [
    { title: "Contract sizing by tier", description: "Matching configs to drawdown.", done: false },
    { title: "Daily-loss discipline", description: "Using the advisory limits.", done: false },
  ] },
  { n: 4, title: "Scaling funded accounts", locked: true, videos: [
    { title: "Picking a prop firm", description: "Evaluations that fit the system.", done: false },
    { title: "Stacking accounts", description: "Routing one signal to many.", done: false },
  ] },
];

/* ------------------------------ quick links ------------------------------ */
export interface QuickLink { title: string; description: string; url: string; group: string; }
export const QUICK_LINKS: QuickLink[] = [
  { title: "TradingView", description: "Charts & alerts", url: "https://www.tradingview.com", group: "Platforms" },
  { title: "NinjaTrader", description: "Desktop execution", url: "https://ninjatrader.com", group: "Platforms" },
  { title: "Tradovate", description: "Futures broker", url: "https://www.tradovate.com", group: "Platforms" },
  { title: "TradersPost", description: "Webhook automation", url: "https://traderspost.io", group: "Tools" },
  { title: "Topstep", description: "Prop firm evaluations", url: "https://www.topstep.com", group: "Tools" },
  { title: "Email the desk", description: "desk@meridiansolutions.co", url: "mailto:desk@meridiansolutions.co", group: "Tools" },
];

/* ----------------------------- activity feed ----------------------------- */
export interface Activity { kind: "signal" | "trade" | "payout" | "system"; title: string; meta: string; ago: string; tone: "pos" | "neg" | "flat"; }
export const ACTIVITY: Activity[] = [
  { kind: "signal", title: "Polaris · NQ Long entry", meta: "5m · forwarded", ago: "3m", tone: "flat" },
  { kind: "trade", title: "NQ Long closed", meta: "+$1,840 · Apex 150K", ago: "21m", tone: "pos" },
  { kind: "signal", title: "Quadrant · MNQ Short target", meta: "2m · forwarded", ago: "44m", tone: "flat" },
  { kind: "trade", title: "ES Short closed", meta: "−$420 · Topstep 100K", ago: "1h", tone: "neg" },
  { kind: "payout", title: "Payout approved", meta: "$2,500 · MyFundedFutures", ago: "2h", tone: "pos" },
  { kind: "system", title: "All accounts synced", meta: "4 of 4 healthy", ago: "2h", tone: "flat" },
];

/* ----------------------------- announcements ----------------------------- */
export interface Announcement { id: string; severity: "info" | "warning" | "critical"; title: string; body: string; date: string; }
export const ANNOUNCEMENTS: Announcement[] = [
  { id: "an1", severity: "info", title: "New Overnight 2m config live for Polaris", body: "Polaris members now have access to the Overnight 2m configuration. Update your master chart to pull it in.", date: "Jun 24, 2026" },
  { id: "an2", severity: "warning", title: "CME holiday schedule — July 4", body: "Markets close early on July 3 and are shut July 4. Session configs will not fire during the closure.", date: "Jun 22, 2026" },
];
