/* ============================================================================
   MERIDIAN PORTAL — presentational primitives (no hooks → usable in server or
   client trees). Charts are hand-rolled SVG to match Meridian's editorial look
   (thin strokes, mono labels, burnt-orange signal accent).
   Interactive primitives live in ./ui-client.
   ========================================================================== */
import type { ReactNode } from "react";
import { usd } from "./format";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------- page ---------------------------------- */
export function PageHead({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="p-head">
      <div className="p-head__text">
        {eyebrow && (
          <p className="eyebrow"><span className="dot" /> {eyebrow}</p>
        )}
        <h1 className="display d-md p-head__title">{title}</h1>
        {sub && <p className="muted p-head__sub">{sub}</p>}
      </div>
      {actions && <div className="p-head__actions">{actions}</div>}
    </header>
  );
}

/* -------------------------------- panel ---------------------------------- */
export function Panel({
  title,
  eyebrow,
  action,
  children,
  className,
  pad = true,
}: {
  title?: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section className={cn("p-panel", className)}>
      {(title || action) && (
        <div className="p-panel__head">
          <div>
            {eyebrow && <span className="p-panel__eyebrow">{eyebrow}</span>}
            {title && <h2 className="p-panel__title">{title}</h2>}
          </div>
          {action && <div className="p-panel__action">{action}</div>}
        </div>
      )}
      <div className={pad ? "p-panel__body" : undefined}>{children}</div>
    </section>
  );
}

/* ------------------------------- stat card ------------------------------- */
export function StatCard({
  label,
  value,
  sub,
  tone = "flat",
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "pos" | "neg" | "flat" | "signal";
  icon?: ReactNode;
}) {
  return (
    <div className="p-stat">
      <div className="p-stat__top">
        <span className="p-stat__label">{label}</span>
        {icon && <span className="p-stat__icon">{icon}</span>}
      </div>
      <div className={cn("p-stat__value", tone)}>{value}</div>
      {sub && <div className="p-stat__sub">{sub}</div>}
    </div>
  );
}

/* --------------------------------- badge --------------------------------- */
export function Badge({
  children,
  tone = "flat",
}: {
  children: ReactNode;
  tone?: "pos" | "neg" | "warn" | "info" | "flat" | "signal";
}) {
  return <span className={cn("p-badge", tone)}>{children}</span>;
}

export function TierTag({ tier }: { tier: string }) {
  const t = tier.toLowerCase().replace(/\s+/g, "");
  return <span className={cn("p-tier", t)}>{tier}</span>;
}

/* ---------------------------------- pnl ---------------------------------- */
export function Pnl({ value, short = false, sign = true }: { value: number; short?: boolean; sign?: boolean }) {
  const cls = value > 0 ? "pos" : value < 0 ? "neg" : "flat";
  const text = short
    ? `${value < 0 ? "−$" : sign && value > 0 ? "+$" : "$"}${Math.abs(value) >= 1000 ? (Math.abs(value) / 1000).toFixed(1) + "k" : Math.abs(value).toFixed(0)}`
    : usd(value, { sign });
  return <span className={cn("p-pnl", cls)}>{text}</span>;
}

/* ------------------------------ progress bar ----------------------------- */
export function ProgressBar({ value, max = 100, tone = "signal" }: { value: number; max?: number; tone?: "signal" | "pos" | "neg" }) {
  const pctVal = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="p-progress">
      <span className={cn("p-progress__fill", tone)} style={{ width: `${pctVal}%` }} />
    </div>
  );
}

/* ------------------------------ empty state ------------------------------ */
export function EmptyState({ icon, title, body }: { icon?: ReactNode; title: string; body?: string }) {
  return (
    <div className="p-empty">
      {icon && <div className="p-empty__icon">{icon}</div>}
      <p className="p-empty__title">{title}</p>
      {body && <p className="muted">{body}</p>}
    </div>
  );
}

/* ================================ CHARTS ================================= */

/** Equity / area chart. `points` = raw y values in series order. */
export function AreaChart({
  points,
  height = 160,
  tone = "var(--signal)",
  fill = "rgba(204,100,55,0.14)",
}: {
  points: number[];
  height?: number;
  tone?: string;
  fill?: string;
}) {
  const W = 600;
  const H = height;
  if (points.length < 2) return <div style={{ height }} />;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const stepX = W / (points.length - 1);
  const xy = points.map((p, i) => [i * stepX, H - ((p - min) / span) * (H - 14) - 7]);
  const line = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  return (
    <svg className="p-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={tone} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Horizontal or vertical bar set. `data` items: {label, value}. */
export function Bars({
  data,
  height = 150,
  axis = "x",
}: {
  data: { label: string; value: number }[];
  height?: number;
  axis?: "x" | "y";
}) {
  const max = Math.max(1, ...data.map((d) => Math.abs(d.value)));
  if (axis === "y") {
    // horizontal bars (label rows)
    return (
      <div className="p-hbars">
        {data.map((d, i) => (
          <div className="p-hbar" key={i}>
            <span className="p-hbar__label">{d.label}</span>
            <span className="p-hbar__track">
              <span className={cn("p-hbar__fill", d.value < 0 ? "neg" : "pos")} style={{ width: `${(Math.abs(d.value) / max) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="p-bars" style={{ height }}>
      {data.map((d, i) => (
        <div className="p-bar__col" key={i}>
          <span className={cn("p-bar", d.value < 0 ? "neg" : "pos")} style={{ height: `${(Math.abs(d.value) / max) * 100}%` }} />
          <span className="p-bar__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Circular gauge. value/max → arc fill; center renders `display`. */
export function Gauge({
  value,
  max = 100,
  display,
  label,
  tone = "var(--signal)",
}: {
  value: number;
  max?: number;
  display: ReactNode;
  label?: string;
  tone?: string;
}) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div className="p-gauge">
      <svg viewBox="0 0 80 80" className="p-gauge__svg">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="5" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke={tone} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${circ * ratio} ${circ}`} transform="rotate(-90 40 40)"
        />
      </svg>
      <div className="p-gauge__center">
        <b>{display}</b>
        {label && <span>{label}</span>}
      </div>
    </div>
  );
}

/** Sparkline — tiny inline trend line. */
export function Sparkline({ points, tone = "var(--signal)", width = 90, height = 26 }: { points: number[]; tone?: string; width?: number; height?: number }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const stepX = width / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(1)},${(height - ((p - min) / span) * height).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} className="p-spark">
      <path d={d} fill="none" stroke={tone} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
