import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/portal/session";
import { Shell } from "@/portal/Shell";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  if (s.role !== "admin") redirect("/app/dashboard");
  return (
    <Shell user={{ name: s.name, email: s.sub, role: s.role, tier: s.tier }} kind="admin">
      {children}
    </Shell>
  );
}
