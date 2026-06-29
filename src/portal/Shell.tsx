"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PORTAL_NAV, ADMIN_NAV, type NavSection } from "./nav";
import { cn } from "./ui";

interface ShellUser {
  name: string;
  email: string;
  role: "user" | "admin";
  tier: string;
}

function initialsOf(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/app/dashboard") return pathname === "/app/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function currentLabel(pathname: string, nav: NavSection[]): string {
  for (const s of nav) for (const i of s.items) if (isActive(pathname, i.href)) return i.label;
  return "";
}

export function Shell({ user, kind, children }: { user: ShellUser; kind: "portal" | "admin"; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nav = kind === "admin" ? ADMIN_NAV : PORTAL_NAV;
  const homeHref = kind === "admin" ? "/admin" : "/app/dashboard";
  const wordmark = kind === "admin" ? "Meridian · Admin" : "Meridian";
  const section = currentLabel(pathname, nav);

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    window.location.href = kind === "admin" ? "/admin/login" : "/login";
  }

  const navTree = (
    <nav className="p-side__nav">
      {nav.map((s, si) => (
        <div className="p-side__group" key={s.title ?? `g${si}`}>
          {s.title && <p className="p-side__heading">{s.title}</p>}
          {s.items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn("p-side__link", isActive(pathname, href) && "is-active")}
              onClick={() => setOpen(false)}
            >
              <Icon className="p-side__icon" size={16} strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );

  const userFooter = (
    <div className="p-side__foot">
      <div className="p-side__user">
        <span className="p-side__avatar">{initialsOf(user.name)}</span>
        <span className="p-side__umeta">
          <b>{user.name}</b>
          <span>{user.email}</span>
        </span>
      </div>
      <button type="button" className="p-side__signout" onClick={signOut}>
        <LogOut size={15} strokeWidth={1.75} /> Sign out
      </button>
    </div>
  );

  return (
    <div className={cn("p-shell", kind === "admin" && "p-shell--admin")}>
      {/* desktop sidebar */}
      <aside className="p-side">
        <Link href={homeHref} className="p-side__brand" aria-label={wordmark}>
          <Logo size={22} showText={false} />
          <span>{wordmark}</span>
        </Link>
        {navTree}
        {userFooter}
      </aside>

      {/* mobile drawer */}
      {open && <div className="p-drawer__scrim" onClick={() => setOpen(false)} />}
      <aside className={cn("p-drawer", open && "is-open")}>
        <div className="p-drawer__top">
          <Link href={homeHref} className="p-side__brand" onClick={() => setOpen(false)}>
            <Logo size={22} />
            <span>{wordmark}</span>
          </Link>
          <button type="button" className="p-iconbtn" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        {navTree}
        {userFooter}
      </aside>

      {/* main column */}
      <div className="p-main">
        <header className="p-topbar">
          <div className="p-topbar__left">
            <button type="button" className="p-iconbtn p-topbar__burger" aria-label="Open menu" onClick={() => setOpen(true)}>
              <Menu size={18} />
            </button>
            <span className="p-topbar__crumb">
              <span className="muted">{kind === "admin" ? "Admin" : "Portal"}</span>
              {section && <><span className="p-topbar__sep">/</span> {section}</>}
            </span>
          </div>
          <div className="p-topbar__right">
            <span className="p-topbar__demo"><Sparkles size={12} /> Demo</span>
            <span className={cn("p-tier", user.tier.toLowerCase())}>{user.tier}</span>
            <button type="button" className="p-topbar__signout" onClick={signOut} aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </header>
        <main className="p-content">{children}</main>
      </div>
    </div>
  );
}

/* re-export the router push helper so client pages can navigate if needed */
export { useRouter };
