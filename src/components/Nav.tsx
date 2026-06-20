"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { NAV, NAV_CTA, NAV_LOGIN, BRAND } from "@/content/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock scroll + lenis while drawer open, + a11y (Escape, focus management)
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (open) {
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
      // move focus into the drawer
      const first = drawerRef.current?.querySelector<HTMLElement>("a, button");
      first?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "Tab" && drawerRef.current) {
          const items = Array.from(drawerRef.current.querySelectorAll<HTMLElement>("a, button"));
          if (!items.length) return;
          const f = items[0];
          const l = items[items.length - 1];
          if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
          else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    } else {
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
  }, [open]);

  // restore focus to the burger when the drawer closes
  const closedOnce = useRef(false);
  useEffect(() => {
    if (!open && closedOnce.current) burgerRef.current?.focus();
    if (open) closedOnce.current = true;
  }, [open]);

  return (
    <header className="mer-nav">
      <div className="mer-nav__bar container">
        <Link href="/" aria-label={BRAND.name} className="mer-nav__logo">
          <Logo size={24} />
        </Link>

        <nav className="mer-nav__links" aria-label="Primary">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`mer-nav__link ${pathname === l.href ? "is-active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mer-nav__actions">
          <Link href={NAV_LOGIN.href} className="mer-nav__login">
            {NAV_LOGIN.label}
          </Link>
          <Link href={NAV_CTA.href} className="btn btn--solid">
            {NAV_CTA.label}
          </Link>
        </div>

        <button
          ref={burgerRef}
          className={`mer-burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      {/* mobile drawer */}
      <div ref={drawerRef} className={`mer-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="mer-drawer__links">
          {NAV.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="mer-drawer__link"
              style={{ transitionDelay: `${0.06 * i + 0.1}s` }}
            >
              <span className="mer-drawer__num">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </Link>
          ))}
          <Link
            href={NAV_LOGIN.href}
            className="mer-drawer__link"
            style={{ transitionDelay: `${0.06 * NAV.length + 0.1}s` }}
          >
            <span className="mer-drawer__num">{String(NAV.length + 1).padStart(2, "0")}</span>
            {NAV_LOGIN.label}
          </Link>
        </nav>

        <div className="mer-drawer__foot">
          <Link href={NAV_CTA.href} className="btn btn--solid btn--lg" style={{ width: "100%" }}>
            {NAV_CTA.label}
          </Link>
          <div className="mer-drawer__meta">
            <a href={`mailto:${BRAND.email.access}`}>{BRAND.email.access}</a>
            <span>{BRAND.location}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
