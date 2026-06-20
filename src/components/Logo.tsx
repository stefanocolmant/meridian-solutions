import { BRAND } from "@/content/site";

/** 4-point celestial sparkle (concave star). The Meridian mark + the section
 *  / marquee separator glyph. Inherits currentColor; one accent point in
 *  burnt-orange. */
export function Mark({
  size = 26,
  className = "",
  accent = true,
}: {
  size?: number;
  className?: string;
  accent?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* main 4-point sparkle */}
      <path
        d="M16 2 C16 9.7 9.7 16 2 16 C9.7 16 16 22.3 16 30 C16 22.3 22.3 16 30 16 C22.3 16 16 9.7 16 2 Z"
        fill="currentColor"
      />
      {/* small accent sparkle, upper-right */}
      <path
        d="M26 3.5 C26 6.1 24.1 8 21.5 8 C24.1 8 26 9.9 26 12.5 C26 9.9 27.9 8 30.5 8 C27.9 8 26 6.1 26 3.5 Z"
        fill={accent ? "var(--color-signal, #cc6437)" : "currentColor"}
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
      style={{ display: "inline-flex", alignItems: "center", gap: "0.55em" }}
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
