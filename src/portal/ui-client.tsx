"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "./ui";

/** Pill segmented control. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("p-seg", size === "sm" && "p-seg--sm")} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          className={cn("p-seg__btn", value === o.value && "is-on")}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** On/off toggle. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" className={cn("p-toggle", on && "is-on")} onClick={() => onChange(!on)} aria-pressed={on}>
      <span className="p-toggle__dot" />
      {label && <span className="p-toggle__label">{label}</span>}
    </button>
  );
}

/** Copy-to-clipboard button with confirmation state. */
export function CopyButton({ text, children }: { text: string; children?: ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="p-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? <Check size={13} /> : <Copy size={13} />}
      {children ?? (done ? "Copied" : "Copy")}
    </button>
  );
}
