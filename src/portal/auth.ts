/* ============================================================================
   MERIDIAN PORTAL — auth core (runtime-agnostic: Node route handlers + Edge
   middleware). Zero external deps — uses the Web Crypto API available in both
   runtimes.

   Security model
   --------------
   • Passwords are never stored in plaintext: each demo account stores a random
     16-byte salt + PBKDF2-SHA256(120k iters) derived hash. Login re-derives and
     compares in constant time.
   • Sessions are stateless, signed JWT-style tokens: base64url(payload).base64url(HMAC-SHA256).
     Tampering invalidates the signature; an `exp` claim bounds the lifetime.
   • The signing secret comes from MERIDIAN_AUTH_SECRET; a baked default keeps the
     demo working out of the box (override in prod via env).
   • The token is delivered as an httpOnly + secure + sameSite=lax cookie, so it
     is invisible to JS (XSS-resistant) and not sent cross-site (CSRF-resistant).
   ========================================================================== */

export const SESSION_COOKIE = "meridian_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const PBKDF2_ITERS = 120_000;

export type Role = "user" | "admin";

export interface SessionPayload {
  sub: string; // email
  name: string;
  role: Role;
  tier: string;
  iat: number;
  exp: number;
}

interface DemoUser {
  email: string;
  name: string;
  role: Role;
  tier: string;
  salt: string; // base64
  hash: string; // base64 PBKDF2 derived key
}

/* Demo accounts. Hashes generated with PBKDF2-SHA256, 120k iters, 256-bit key.
   Plaintext (demo only):  demo@meridiansolutions.co / Scalprophecy-2026
                           admin@meridiansolutions.co / Meridian-Admin          */
const USERS: DemoUser[] = [
  {
    email: "demo@meridiansolutions.co",
    name: "Jordan Reyes",
    role: "user",
    tier: "Scalprophecy",
    salt: "IfOuJEhI0OtR41U+2hI1QQ==",
    hash: "KLrD6zwUOXVtYpLH8Rhw6uHMMnp3AjskoPipFgXzwkc=",
  },
  {
    email: "admin@meridiansolutions.co",
    name: "Operations Desk",
    role: "admin",
    tier: "Admin",
    salt: "yrG4thIIarBa13VTZ/v6tA==",
    hash: "AfYG1os4i8aBTbipQ010EHsEdU1TbcXxrhuHi0J5frw=",
  },
];

const DEFAULT_SECRET = "FkZGOyT3W5B0PHau9f14j7tz0/rY5zWgc57VC9YTUu4=";
function secret(): string {
  return process.env.MERIDIAN_AUTH_SECRET || DEFAULT_SECRET;
}

/* ------------------------------ base64 helpers --------------------------- */
function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64url(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64url(s: string): string {
  let r = s.replace(/-/g, "+").replace(/_/g, "/");
  while (r.length % 4) r += "=";
  return r;
}
function strToB64url(s: string): string {
  return b64url(bytesToB64(new TextEncoder().encode(s)));
}
function b64urlToStr(s: string): string {
  return new TextDecoder().decode(b64ToBytes(unb64url(s)));
}
/** Normalize to a guaranteed ArrayBuffer-backed view (Web Crypto BufferSource
    typing rejects the generic Uint8Array<ArrayBufferLike>). */
function buf(u: Uint8Array): Uint8Array<ArrayBuffer> {
  return new Uint8Array(u) as Uint8Array<ArrayBuffer>;
}
function enc(s: string): Uint8Array<ArrayBuffer> {
  return buf(new TextEncoder().encode(s));
}

/* timing-safe string compare (equal-length base64 strings) */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ------------------------------- password -------------------------------- */
async function derive(password: string, saltB64: string): Promise<string> {
  const salt = buf(b64ToBytes(saltB64));
  const key = await crypto.subtle.importKey(
    "raw",
    enc(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERS, hash: "SHA-256" },
    key,
    256,
  );
  return bytesToB64(new Uint8Array(bits));
}

/** Verify credentials. Returns the matched user (sans secrets) or null. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<Omit<DemoUser, "salt" | "hash"> | null> {
  const norm = email.trim().toLowerCase();
  const user = USERS.find((u) => u.email === norm);
  // Always derive (even on unknown user, against a decoy salt) to avoid
  // leaking account existence via timing.
  const probe = user ?? USERS[0];
  const got = await derive(password, probe.salt);
  if (!user) return null;
  if (!timingSafeEqual(got, user.hash)) return null;
  const { salt: _s, hash: _h, ...safe } = user;
  void _s;
  void _h;
  return safe;
}

/* ------------------------------- sessions -------------------------------- */
async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(
  user: Pick<SessionPayload, "sub" | "name" | "role" | "tier">,
): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    sub: user.sub,
    name: user.name,
    role: user.role,
    tier: user.tier,
    iat: now,
    exp: now + SESSION_TTL_MS,
  };
  const body = strToB64url(JSON.stringify(payload));
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc(body));
  return `${body}.${b64url(bytesToB64(new Uint8Array(sig)))}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || token.indexOf(".") < 0) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const key = await hmacKey();
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      buf(b64ToBytes(unb64url(sig))),
      enc(body),
    );
    if (!ok) return null;
    const payload = JSON.parse(b64urlToStr(body)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (payload.role !== "user" && payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionUserFromPayload(p: SessionPayload) {
  return { email: p.sub, name: p.name, role: p.role, tier: p.tier };
}
