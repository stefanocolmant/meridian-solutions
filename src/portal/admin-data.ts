/* MERIDIAN PORTAL — admin demo data (deterministic). Hypothetical. */

export const ADMIN_KPIS = [
  { label: "Active members", value: "418", delta: "+12 this week", tone: "pos" as const },
  { label: "Pending applications", value: "23", delta: "7 new today", tone: "flat" as const },
  { label: "Open support threads", value: "9", delta: "2 unread", tone: "neg" as const },
  { label: "MRR", value: "$142,300", delta: "+6.4% MoM", tone: "pos" as const },
];

export type AppStatus = "Pending" | "Contacted" | "Approved" | "Rejected";
export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: "Compass" | "Quadrant" | "Polaris";
  status: AppStatus;
  source: string;
  experience: string;
  deploy: string;
  submittedAt: string;
  notes: string;
}
export const APPLICATIONS: Application[] = [
  { id: "AP-3192", name: "Marcus Vandenberg", email: "marcus.v@gmail.com", phone: "+1 312 555 0148", tier: "Polaris", status: "Pending", source: "meta", experience: "3–5 years", deploy: "Prop firm account", submittedAt: "Jun 26, 2026 · 09:14", notes: "" },
  { id: "AP-3191", name: "Priya Nair", email: "priya.nair@outlook.com", phone: "+1 408 555 0193", tier: "Quadrant", status: "Pending", source: "google", experience: "1–3 years", deploy: "Personal account", submittedAt: "Jun 26, 2026 · 08:02", notes: "" },
  { id: "AP-3188", name: "Diego Okafor", email: "d.okafor@protonmail.com", phone: "+1 646 555 0117", tier: "Polaris", status: "Contacted", source: "direct", experience: "5+ years", deploy: "Both", submittedAt: "Jun 25, 2026 · 16:41", notes: "Replied — booking onboarding call." },
  { id: "AP-3185", name: "Hana Köhler", email: "hana.kohler@gmail.com", phone: "+49 152 555 0142", tier: "Compass", status: "Pending", source: "meta", experience: "New to trading", deploy: "Prop firm account", submittedAt: "Jun 25, 2026 · 11:08", notes: "" },
  { id: "AP-3180", name: "Ryan Vance", email: "rvance@icloud.com", phone: "+1 213 555 0166", tier: "Polaris", status: "Approved", source: "referral", experience: "5+ years", deploy: "Prop firm account", submittedAt: "Jun 24, 2026 · 14:22", notes: "Strong fit — onboarded." },
  { id: "AP-3176", name: "Sofia Marés", email: "sofia.mares@gmail.com", phone: "+34 612 555 0188", tier: "Quadrant", status: "Rejected", source: "google", experience: "1–3 years", deploy: "Personal account", submittedAt: "Jun 23, 2026 · 19:55", notes: "Looking for guaranteed returns — not a fit." },
];
export const APP_SOURCES = ["meta", "google", "direct", "referral"];

export type MemberStatus = "Active" | "Onboarding" | "Paused";
export interface Member {
  id: string;
  name: string;
  email: string;
  tier: "Compass" | "Quadrant" | "Polaris";
  status: MemberStatus;
  accounts: number;
  joined: string;
  payment: "Current" | "Past due";
  algorithm: string;
}
export const MEMBERS: Member[] = [
  { id: "U-1042", name: "Jordan Reyes", email: "demo@meridiansolutions.co", tier: "Polaris", status: "Active", accounts: 4, joined: "Jan 2025", payment: "Current", algorithm: "Polaris — All Nine" },
  { id: "U-1039", name: "Ryan Vance", email: "rvance@icloud.com", tier: "Polaris", status: "Onboarding", accounts: 1, joined: "Jun 2026", payment: "Current", algorithm: "Polaris — All Nine" },
  { id: "U-1021", name: "Amelia Foss", email: "afoss@gmail.com", tier: "Quadrant", status: "Active", accounts: 2, joined: "Mar 2026", payment: "Current", algorithm: "Quadrant — 7 configs" },
  { id: "U-1008", name: "Tomas Brandt", email: "t.brandt@gmail.com", tier: "Compass", status: "Active", accounts: 1, joined: "Feb 2026", payment: "Past due", algorithm: "Compass — 4 configs" },
  { id: "U-0994", name: "Lena Park", email: "lena.park@outlook.com", tier: "Polaris", status: "Paused", accounts: 3, joined: "Nov 2025", payment: "Current", algorithm: "Polaris — All Nine" },
  { id: "U-0981", name: "Diego Okafor", email: "d.okafor@protonmail.com", tier: "Polaris", status: "Onboarding", accounts: 0, joined: "Jun 2026", payment: "Current", algorithm: "Unassigned" },
];

export interface PipelineStage { key: string; label: string; members: { name: string; tier: string; ago: string }[]; }
export const PIPELINE: PipelineStage[] = [
  { key: "invited", label: "Invited", members: [
    { name: "Hana Köhler", tier: "Compass", ago: "1d" },
    { name: "Priya Nair", tier: "Quadrant", ago: "4h" },
  ] },
  { key: "password_set", label: "Account created", members: [
    { name: "Diego Okafor", tier: "Polaris", ago: "2d" },
  ] },
  { key: "intake", label: "Intake complete", members: [
    { name: "Ryan Vance", tier: "Polaris", ago: "1d" },
  ] },
  { key: "active", label: "Active", members: [
    { name: "Amelia Foss", tier: "Quadrant", ago: "3mo" },
    { name: "Jordan Reyes", tier: "Polaris", ago: "18mo" },
  ] },
];

export type Stage = "New interest" | "Brief sent" | "Awaiting video" | "Compliance review" | "Approved" | "Published";
export interface Testimonial { id: string; member: string; tier: string; stage: Stage; consent: "Signed" | "Pending" | "—"; updated: string; }
export const TESTIMONIALS_ADMIN: Testimonial[] = [
  { id: "TS-12", member: "Jordan Reyes", tier: "Polaris", stage: "Compliance review", consent: "Signed", updated: "Jun 25, 2026" },
  { id: "TS-11", member: "Amelia Foss", tier: "Quadrant", stage: "Awaiting video", consent: "Pending", updated: "Jun 22, 2026" },
  { id: "TS-09", member: "Ryan Vance", tier: "Polaris", stage: "New interest", consent: "—", updated: "Jun 20, 2026" },
  { id: "TS-07", member: "Lena Park", tier: "Polaris", stage: "Published", consent: "Signed", updated: "Jun 10, 2026" },
];
export const TESTIMONIAL_STAGES: Stage[] = ["New interest", "Brief sent", "Awaiting video", "Compliance review", "Approved", "Published"];

export interface AlgoAssignUser { id: string; name: string; email: string; tier: string; current: string; lastAssigned: string; }
export const ALGO_ASSIGN: AlgoAssignUser[] = [
  { id: "U-1039", name: "Ryan Vance", email: "rvance@icloud.com", tier: "Polaris", current: "Polaris — All Nine", lastAssigned: "Jun 24, 2026" },
  { id: "U-0981", name: "Diego Okafor", email: "d.okafor@protonmail.com", tier: "Polaris", current: "Unassigned", lastAssigned: "—" },
  { id: "U-1021", name: "Amelia Foss", email: "afoss@gmail.com", tier: "Quadrant", current: "Quadrant — 7 configs", lastAssigned: "Mar 12, 2026" },
];
export const ALGO_OPTIONS = [
  { key: "compass", name: "Compass", desc: "4 core-session configurations." },
  { key: "quadrant", name: "Quadrant", desc: "7 configurations with adaptive filters." },
  { key: "polaris", name: "Polaris", desc: "All nine configurations + Custom Mode." },
];
export const SESSION_PRESETS = ["London Open", "NY Open", "NY Lunch", "PM Session", "Asia Early"];

export interface AdminActivity { who: string; what: string; ago: string; }
export const ADMIN_ACTIVITY: AdminActivity[] = [
  { who: "Ryan Vance", what: "completed intake", ago: "12m" },
  { who: "System", what: "7 new applications today", ago: "1h" },
  { who: "Amelia Foss", what: "requested a payout · $4,000", ago: "2h" },
  { who: "Tomas Brandt", what: "payment marked past due", ago: "5h" },
  { who: "Diego Okafor", what: "set password & activated", ago: "1d" },
];

export interface SupportThread { id: string; member: string; tier: string; preview: string; ago: string; unread: boolean; }
export const SUPPORT_THREADS: SupportThread[] = [
  { id: "U-1039", member: "Ryan Vance", tier: "Polaris", preview: "Webhook test is returning a 504 — any ideas?", ago: "8m", unread: true },
  { id: "U-1008", member: "Tomas Brandt", tier: "Compass", preview: "Thanks, that fixed it!", ago: "1h", unread: false },
  { id: "U-1021", member: "Amelia Foss", tier: "Quadrant", preview: "Can I add a second funded account?", ago: "3h", unread: true },
  { id: "U-0994", member: "Lena Park", tier: "Polaris", preview: "Pausing for a couple weeks, traveling.", ago: "1d", unread: false },
];
