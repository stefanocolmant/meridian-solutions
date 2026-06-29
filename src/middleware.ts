import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/portal/auth";

/* Edge middleware — gates the portal. Verifies the signed session cookie on
   every /app and /admin request before any page code runs. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  const isAdminArea = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isAppArea = pathname.startsWith("/app");
  const isLogin = pathname === "/login";

  // Admin area (everything under /admin except the admin login itself)
  if (isAdminArea && !isAdminLogin) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/app/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // User portal
  if (isAppArea && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Already authenticated → don't show login screens
  if (session && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = session.role === "admin" ? "/admin" : "/app/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (session?.role === "admin" && isAdminLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/login"],
};
