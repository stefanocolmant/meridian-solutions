"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { NAV, NAV_CTA, NAV_LOGIN, BRAND } from "@/content/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock scroll + lenis while drawer open
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (open) {
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
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
      <div className={`mer-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
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
