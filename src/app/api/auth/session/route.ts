import { NextResponse } from "next/server";
import { getSession } from "@/portal/session";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: { email: s.sub, name: s.name, role: s.role, tier: s.tier },
  });
}
