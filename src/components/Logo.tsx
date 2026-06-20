import { BRAND } from "@/content/site";

/** Meridian mark: a monoline globe with a meridian arc + equator and a
 *  burnt-orange north-star accent. Inherits currentColor. */
export function Mark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12.4" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="16" cy="16" rx="5.1" ry="12.4" stroke="currentColor" strokeWidth="1.1" />
      <line x1="3.6" y1="16" x2="28.4" y2="16" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M16 0.6 L17.4 4.6 L16 8.6 L14.6 4.6 Z"
        fill="var(--color-signal, #cc6437)"
      />
    </svg>
  );
}

export function Logo({
  size = 26,
  showText = true,
  className = "",
}: {
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.6em" }}
    >
      <Mark size={size} />
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontSize: `${size * 0.72}px`,
            lineHeight: 1,
            fontWeight: 500,
            paddingTop: "0.1em",
          }}
        >
          {BRAND.short}
        </span>
      )}
    </span>
  );
}
