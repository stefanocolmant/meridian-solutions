/* Server-only session reader. Used by server layouts/pages to gate access and
   personalize. Reads the signed httpOnly cookie and verifies it. */
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "./auth";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export type { SessionPayload };
