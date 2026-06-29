import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/portal/session";
import { Shell } from "@/portal/Shell";

export const metadata: Metadata = { title: "Portal" };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/login");
  return (
    <Shell user={{ name: s.name, email: s.sub, role: s.role, tier: s.tier }} kind="portal">
      {children}
    </Shell>
  );
}
