/* Portal navigation — Meridian's celestial twist over the Tradient IA.
   Groups: Navigation / Safeguards / Almanac. One source of truth for the
   sidebar (user portal) and the admin rail. */
import {
  Compass,
  Radio,
  ListOrdered,
  CalendarDays,
  NotebookPen,
  LineChart,
  Wallet,
  HandCoins,
  Flag,
  ShieldAlert,
  Crosshair,
  Power,
  Wrench,
  GraduationCap,
  Newspaper,
  Bot,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  User,
  Settings,
  LayoutDashboard,
  Inbox,
  Users,
  SlidersHorizontal,
  Quote,
  type LucideIcon,
} from "lucide-react";

export interface NavLeaf { href: string; label: string; icon: LucideIcon; }
export interface NavSection { title: string | null; items: NavLeaf[]; }

export const PORTAL_NAV: NavSection[] = [
  {
    title: null,
    items: [
      { href: "/app/dashboard", label: "Bridge", icon: Compass },
      { href: "/app/signal-feed", label: "Signal Feed", icon: Radio },
    ],
  },
  {
    title: "Navigation",
    items: [
      { href: "/app/trades", label: "Trade Log", icon: ListOrdered },
      { href: "/app/calendar", label: "Logbook", icon: CalendarDays },
      { href: "/app/journal", label: "Journal", icon: NotebookPen },
      { href: "/app/performance", label: "Track Record", icon: LineChart },
      { href: "/app/accounts", label: "Fleet", icon: Wallet },
      { href: "/app/payouts", label: "Payouts", icon: HandCoins },
      { href: "/app/milestones", label: "Waypoints", icon: Flag },
    ],
  },
  {
    title: "Safeguards",
    items: [
      { href: "/app/risk-settings", label: "Risk Settings", icon: ShieldAlert },
      { href: "/app/risk-tool", label: "Position Sizer", icon: Crosshair },
      { href: "/app/kill-switch", label: "Kill Switch", icon: Power },
      { href: "/app/software-setup", label: "Software Setup", icon: Wrench },
    ],
  },
  {
    title: "Almanac",
    items: [
      { href: "/app/training", label: "Academy", icon: GraduationCap },
      { href: "/app/news", label: "Dispatches", icon: Newspaper },
      { href: "/app/chatbot", label: "AI Navigator", icon: Bot },
      { href: "/app/support", label: "Support", icon: MessageCircle },
      { href: "/app/faq", label: "FAQ", icon: HelpCircle },
      { href: "/app/quick-links", label: "Quick Links", icon: ExternalLink },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/app/profile", label: "Profile", icon: User },
      { href: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

export const ADMIN_NAV: NavSection[] = [
  {
    title: null,
    items: [
      { href: "/admin", label: "Operations", icon: LayoutDashboard },
      { href: "/admin/applications", label: "Applications", icon: Inbox },
      { href: "/admin/members", label: "Members", icon: Users },
      { href: "/admin/algorithm-assignment", label: "Algorithm Assignment", icon: SlidersHorizontal },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
    ],
  },
];
