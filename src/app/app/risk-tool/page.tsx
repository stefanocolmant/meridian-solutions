"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Layers, ShieldAlert, TrendingDown, Activity, Percent, Coins } from "lucide-react";
import {
  PageHead, Panel, StatCard, AreaChart, Pnl, Badge, TierTag, ProgressBar,
} from "@/portal/ui";
import { Segmented } from "@/portal/ui-client";
import { usd, num, pct } from "@/portal/format";
import { TIER_CONFIGS } from "@/portal/data";

/* ---- illustrative session configs (local, demo-only) -------------------- */
interface SizerConfig {
  name: string;
  ddPerContract: number; // $ adverse excursion per MNQ-equivalent contract
  worstDay: number; // $ modelled worst session per contract
  winRate: number; // %
  profitFactor: number;
}
const CONFIGS: SizerConfig[] = [
  { name: "NY Open", ddPerContract: 480, worstDay: 920, winRate: 63, profitFactor: 1.9 },
  { name: "London", ddPerContract: 540, worstDay: 1040, winRate: 58, profitFactor: 1.7 },
  { name: "Morning Overlap", ddPerContract: 420, worstDay: 860, winRate: 61, profitFactor: 1.8 },
  { name: "PM Session", ddPerContract: 600, worstDay: 1180, winRate: 55, profitFactor: 1.6 },
  { name: "Overnight", ddPerContract: 380, worstDay: 760, winRate: 66, profitFactor: 2.1 },
  { name: "Asia Early", ddPerContract: 510, worstDay: 980, winRate: 59, profitFactor: 1.75 },
];

type Tier = "Delta Flow" | "Delta Vision" | "Scalprophecy";
type AccountKind = "prop" | "personal";
type Contract = "MNQ" | "NQ";

/* small labelled control wrapper */
function Control({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="p-stack" style={{ gap: "0.55rem" }}>
      <span className="mono" style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
        {label}
      </span>
      {children}
      {hint && <span className="muted" style={{ fontSize: "0.72rem" }}>{hint}</span>}
    </div>
  );
}

export default function RiskToolPage() {
  const [tier, setTier] = useState<Tier>("Delta Flow");
  const [accountKind, setAccountKind] = useState<AccountKind>("prop");
  const [contract, setContract] = useState<Contract>("MNQ");
  const [accountSize, setAccountSize] = useState<number>(50000);
  const [maxDD, setMaxDD] = useState<number>(2500);
  const [util, setUtil] = useState<number>(55);

  const utilBand = util < 40 ? "Safer" : util <= 70 ? "Balanced" : "Aggressive";
  const utilTone: "pos" | "info" | "warn" = util < 40 ? "pos" : util <= 70 ? "info" : "warn";

  const r = useMemo(() => {
    const configCount = TIER_CONFIGS[tier.toLowerCase()] ?? CONFIGS.length;
    const activeConfigs = CONFIGS.slice(0, Math.min(configCount, CONFIGS.length));

    const pointValue = contract === "NQ" ? 20 : 2;
    const contractMult = pointValue / 2; // MNQ = 1, NQ = 10
    const u = util / 100;
    const buffer = accountKind === "prop" ? 0.85 : 1; // prop firms hold a trailing-DD safety margin
    const budget = maxDD * u * buffer;

    const sumDd = activeConfigs.reduce((s, c) => s + c.ddPerContract, 0);
    const ddPerSet = sumDd * contractMult; // cost of 1 contract on every active config
    const contractsPerConfig = Math.max(1, Math.floor(ddPerSet > 0 ? budget / ddPerSet : 0));
    const totalContracts = contractsPerConfig * activeConfigs.length;

    const portfolioDd = contractsPerConfig * ddPerSet;
    const worstDayEst = Math.round(
      contractsPerConfig * contractMult * activeConfigs.reduce((s, c) => s + c.worstDay, 0) * 0.5,
    );
    const tradesMonth = activeConfigs.length * 21;
    const avgWinRate = activeConfigs.reduce((s, c) => s + c.winRate, 0) / activeConfigs.length;
    const avgPf = activeConfigs.reduce((s, c) => s + c.profitFactor, 0) / activeConfigs.length;
    const netPnl = Math.round(totalContracts * (avgPf - 1) * 700 * contractMult * (0.5 + u));

    // deterministic illustrative equity preview: cumulative fixed pattern scaled to net P&L
    const pattern = [3, 5, 2, 6, 4, 7, 5, 8, 6, 9, 7, 11, 9, 12, 10, 13];
    const totalP = pattern.reduce((s, p) => s + p, 0);
    const gain = netPnl * 3; // illustrative quarter
    let cum = 0;
    const equity = [accountSize, ...pattern.map((p) => {
      cum += p;
      return Math.round(accountSize + (cum / totalP) * gain);
    })];

    return {
      configCount, activeConfigs, pointValue, contractMult, budget, ddPerSet,
      contractsPerConfig, totalContracts, portfolioDd, worstDayEst, tradesMonth,
      avgWinRate, avgPf, netPnl, equity,
    };
  }, [tier, accountKind, contract, accountSize, maxDD, util]);

  const ddWithinBudget = r.portfolioDd <= maxDD;
  const ddUsedPct = Math.round((r.portfolioDd / Math.max(1, maxDD)) * 100);

  return (
    <>
      <PageHead
        eyebrow="Risk tool"
        title="Position Sizer"
        sub="Model contract size, drawdown exposure and a modelled equity path before you deploy a tier."
        actions={<span className="tag">Illustrative</span>}
      />

      {/* -------------------------------- inputs ------------------------------ */}
      <Panel
        eyebrow="Configure"
        title="Sizing inputs"
        action={<TierTag tier={tier} />}
        className="p-stack"
      >
        <div className="p-grid-2" style={{ gap: "1.4rem" }}>
          <div className="p-stack" style={{ gap: "1.2rem" }}>
            <Control
              label="Risk tier"
              hint={`${r.configCount} session configs unlocked · ${r.activeConfigs.length} modelled here`}
            >
              <Segmented<Tier>
                options={[
                  { value: "Delta Flow", label: "Delta Flow" },
                  { value: "Delta Vision", label: "Delta Vision" },
                  { value: "Scalprophecy", label: "Scalprophecy" },
                ]}
                value={tier}
                onChange={setTier}
              />
            </Control>

            <Control label="Account type" hint={accountKind === "prop" ? "Trailing-drawdown safety margin applied" : "Full drawdown budget deployed"}>
              <Segmented<AccountKind>
                options={[
                  { value: "prop", label: "Prop firm" },
                  { value: "personal", label: "Personal" },
                ]}
                value={accountKind}
                onChange={setAccountKind}
              />
            </Control>

            <Control label="Contract" hint={`Point value $${r.pointValue}/pt · ${r.contractMult}× sizing weight`}>
              <Segmented<Contract>
                options={[
                  { value: "MNQ", label: "MNQ · $2/pt" },
                  { value: "NQ", label: "NQ · $20/pt" },
                ]}
                value={contract}
                onChange={setContract}
              />
            </Control>
          </div>

          <div className="p-stack" style={{ gap: "1.2rem" }}>
            <div className="form__row">
              <label className="field">
                <span className="field__label mono" style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>Account size (USD)</span>
                <input
                  className="field__input"
                  type="number"
                  inputMode="numeric"
                  min={1000}
                  step={1000}
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value) || 0)}
                />
              </label>
              <label className="field">
                <span className="field__label mono" style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>Max drawdown (USD)</span>
                <input
                  className="field__input"
                  type="number"
                  inputMode="numeric"
                  min={250}
                  step={250}
                  value={maxDD}
                  onChange={(e) => setMaxDD(Number(e.target.value) || 0)}
                />
              </label>
            </div>

            <Control
              label="Drawdown utilisation"
              hint={`Deploying ${usd(Math.round(r.budget))} of your ${usd(maxDD)} allowance`}
            >
              <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.2rem" }}>
                <span className="mono accent" style={{ fontSize: "1.4rem" }}>{util}%</span>
                <Badge tone={utilTone}>{utilBand}</Badge>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={util}
                onChange={(e) => setUtil(Number(e.target.value))}
              />
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted mono" style={{ fontSize: "0.6rem" }}>Safer</span>
                <span className="muted mono" style={{ fontSize: "0.6rem" }}>Balanced</span>
                <span className="muted mono" style={{ fontSize: "0.6rem" }}>Aggressive</span>
              </div>
            </Control>
          </div>
        </div>
      </Panel>

      {/* ------------------------------ results grid -------------------------- */}
      <div className="p-grid-3" style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}>
        <StatCard
          label="Total contracts"
          value={num(r.totalContracts)}
          tone="signal"
          sub={`${r.contractsPerConfig}× across ${r.activeConfigs.length} configs`}
          icon={<Layers size={15} />}
        />
        <StatCard
          label="Portfolio drawdown"
          value={usd(r.portfolioDd)}
          tone={ddWithinBudget ? "flat" : "neg"}
          icon={<ShieldAlert size={15} />}
          sub={
            <span className="p-stack" style={{ gap: "0.4rem" }}>
              <span>{ddUsedPct}% of {usd(maxDD)} max{ddWithinBudget ? "" : " · over budget"}</span>
              <ProgressBar value={ddUsedPct} tone={ddWithinBudget ? "signal" : "neg"} />
            </span>
          }
        />
        <StatCard
          label="Worst-day estimate"
          value={usd(-r.worstDayEst)}
          tone="neg"
          sub="Modelled adverse session"
          icon={<TrendingDown size={15} />}
        />
        <StatCard
          label="Trades / month"
          value={num(r.tradesMonth)}
          tone="flat"
          sub="Across active configs"
          icon={<Activity size={15} />}
        />
        <StatCard
          label="Win rate · profit factor"
          value={`${pct(r.avgWinRate)} · ${r.avgPf.toFixed(2)}`}
          tone="flat"
          sub="Blended across configs"
          icon={<Percent size={15} />}
        />
        <StatCard
          label="Net P&L (illustrative)"
          value={usd(r.netPnl, { sign: true })}
          tone="pos"
          sub="Modelled monthly edge"
          icon={<Coins size={15} />}
        />
      </div>

      {/* --------------------------- session configs -------------------------- */}
      <Panel
        eyebrow="Allocation"
        title="Session configurations"
        action={<span className="muted mono" style={{ fontSize: "0.7rem" }}>{r.activeConfigs.length} active</span>}
        pad={false}
      >
        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th>Config</th>
                <th className="num">Win rate</th>
                <th className="num">Profit factor</th>
                <th className="num">DD / contract</th>
                <th className="num">Worst day</th>
                <th className="num">Contracts</th>
                <th className="num">Config drawdown</th>
              </tr>
            </thead>
            <tbody>
              {r.activeConfigs.map((c: SizerConfig) => {
                const cfgDd = c.ddPerContract * r.contractMult * r.contractsPerConfig;
                return (
                  <tr key={c.name}>
                    <td className="t-sym">{c.name}</td>
                    <td className="num">{pct(c.winRate, 0)}</td>
                    <td className="num">{c.profitFactor.toFixed(2)}</td>
                    <td className="num">{usd(c.ddPerContract * r.contractMult)}</td>
                    <td className="num">{usd(c.worstDay * r.contractMult)}</td>
                    <td className="num mono">{num(r.contractsPerConfig)}</td>
                    <td className="num">{usd(cfgDd)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* -------------------------- performance preview ----------------------- */}
      <Panel
        eyebrow="Projection"
        title="Performance preview"
        action={<Pnl value={r.netPnl} />}
        className="p-stack"
      >
        <div className="p-grid-3" style={{ marginBottom: "1.2rem" }}>
          <div>
            <div className="p-stat__label">Starting balance</div>
            <div className="stat-num" style={{ fontSize: "1.7rem" }}>{usd(accountSize)}</div>
          </div>
          <div>
            <div className="p-stat__label">Modelled end (quarter)</div>
            <div className="stat-num" style={{ fontSize: "1.7rem", color: "var(--color-up)" }}>
              {usd(r.equity[r.equity.length - 1])}
            </div>
          </div>
          <div>
            <div className="p-stat__label">Utilisation</div>
            <div className="stat-num" style={{ fontSize: "1.7rem" }}>{util}% <span className="muted" style={{ fontSize: "0.8rem" }}>{utilBand}</span></div>
          </div>
        </div>
        <AreaChart points={r.equity} height={200} />
      </Panel>

      {/* ------------------------------ disclosures --------------------------- */}
      <p className="muted" style={{ fontSize: "0.74rem", marginTop: "1.2rem", lineHeight: 1.6 }}>
        Illustrative only &mdash; not a projection of returns. Figures are modelled from hypothetical
        session statistics and do not reflect any real account. Drawdown, contract and P&amp;L estimates
        are educational and assume disciplined execution of every safeguard. Sizing decisions remain
        entirely yours; Meridian never holds or trades your capital.
      </p>
    </>
  );
}
