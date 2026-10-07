// Single source of truth for brand, navigation, footer, contact + metadata.
// Change BRAND in one place to re-skin the whole site.

export const BRAND = {
  name: "Meridian Trading Solutions",
  short: "Meridian",
  domain: "meridiansolutions.co",
  tagline: "Institutional grade algorithms, licensed to you.",
  description:
    "One validated futures system with nine configurations — every signal delivered with entry, stop, and target pre-defined and routed automatically to your account. Deploy at your prop firm or on your own capital. You keep full control of the account.",
  est: "EST. 2026",
  location: "New York · Remote",
  email: {
    access: "access@meridiansolutions.co",
    careers: "careers@meridiansolutions.co",
    support: "desk@meridiansolutions.co",
  },
  social: {
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
} as const;

export type NavLink = { label: string; href: string };

export const NAV: NavLink[] = [
  { label: "Performance", href: "/performance" },
  { label: "Algorithms", href: "/algorithms" },
  { label: "Methodology", href: "/methodology" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export const NAV_CTA = { label: "Apply for access", href: "/apply" };

export const FOOTER_COLS: { title: string; links: NavLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Algorithms", href: "/algorithms" },
      { label: "Performance", href: "/performance" },
      { label: "Methodology", href: "/methodology" },
      { label: "Calculator", href: "/calculator" },
      { label: "Process", href: "/process" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Start here", href: "/start" },
      { label: "Apply for access", href: "/apply" },
      { label: "Book a demo", href: "/apply" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Risk disclosure", href: "/terms#risk" },
    ],
  },
];
