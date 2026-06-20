"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Client portal"
        title="Welcome back."
        lead="Sign in to access your chart templates, webhooks, configuration files and member resources."
        bg="/bg/nebula-3.webp"
      />
      <section className="section" style={{ paddingTop: "clamp(16px,2vw,32px)" }}>
        <div className="container">
          <div className="auth" data-reveal>
            {submitted ? (
              <div style={{ textAlign: "center" }}>
                <p className="eyebrow" style={{ justifyContent: "center", marginBottom: "1rem" }}>
                  <span className="dot" /> Member access
                </p>
                <h3 className="display d-sm" style={{ marginBottom: "0.6rem" }}>Portal launching soon.</h3>
                <p className="muted pretty">
                  The member portal is being provisioned. Licensed members receive their sign-in
                  details by email during onboarding.
                </p>
              </div>
            ) : (
              <form
                className="form reveal"
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              >
                <div className="field">
                  <label htmlFor="le">Email</label>
                  <input id="le" type="email" required placeholder="you@email.com" />
                </div>
                <div className="field">
                  <label htmlFor="lp">Password</label>
                  <input id="lp" type="password" required placeholder="••••••••" />
                </div>
                <button type="submit" className="btn btn--solid btn--lg" style={{ width: "100%" }}>
                  Sign in
                </button>
                <p className="form__note" style={{ textAlign: "center" }}>
                  Not a member yet? <Link href="/apply" className="accent">Apply for access →</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
