import { NextResponse } from "next/server";
import {
  verifyCredentials,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "@/portal/auth";

/* Best-effort in-memory rate limit (per-instance). Slows credential stuffing
   without an external store; not a substitute for a real WAF in production. */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now - rec.first < WINDOW_MS) {
    rec.count += 1;
    return rec.count > MAX_ATTEMPTS;
  }
  attempts.set(ip, { count: 1, first: now });
  return false;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { email, password, intent } = (body ?? {}) as {
    email?: unknown;
    password?: unknown;
    intent?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  if (intent === "admin" && user.role !== "admin") {
    return NextResponse.json(
      { error: "This account does not have administrator access." },
      { status: 403 },
    );
  }

  const token = await createSessionToken({
    sub: user.email,
    name: user.name,
    role: user.role,
    tier: user.tier,
  });

  const redirect = user.role === "admin" ? "/admin" : "/app/dashboard";
  const res = NextResponse.json({ ok: true, role: user.role, redirect });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}
