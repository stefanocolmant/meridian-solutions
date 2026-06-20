"use client";

import { useState } from "react";
import { BRAND } from "@/content/site";

export function ApplyForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="form__ok" data-reveal>
        <p className="eyebrow" style={{ justifyContent: "center", marginBottom: "1rem" }}>
          <span className="dot" /> Application received
        </p>
        <h3 className="display d-sm" style={{ marginBottom: "0.8rem" }}>You&apos;re on the list.</h3>
        <p className="muted pretty" style={{ maxWidth: "44ch", margin: "0 auto" }}>
          Every application is reviewed by hand. If it&apos;s a fit, we&apos;ll reach out from{" "}
          <span className="accent">{BRAND.email.access}</span> to book your onboarding call. Watch
          your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      className="form"
      data-reveal
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="form__row">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" required placeholder="Jordan Reyes" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@email.com" />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="experience">Trading experience</label>
          <select id="experience" name="experience" defaultValue="">
            <option value="" disabled>Select…</option>
            <option>New to trading</option>
            <option>1–3 years</option>
            <option>3–5 years</option>
            <option>5+ years</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="route">How you&apos;ll deploy</label>
          <select id="route" name="route" defaultValue="">
            <option value="" disabled>Select…</option>
            <option>Prop firm account</option>
            <option>Personal brokerage account</option>
            <option>Both</option>
            <option>Not sure yet</option>
          </select>
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="capital">Starting capital</label>
          <select id="capital" name="capital" defaultValue="">
            <option value="" disabled>Select…</option>
            <option>Under $5k</option>
            <option>$5k – $25k</option>
            <option>$25k – $100k</option>
            <option>$100k+</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="platform">Primary platform</label>
          <select id="platform" name="platform" defaultValue="">
            <option value="" disabled>Select…</option>
            <option>TradingView</option>
            <option>NinjaTrader</option>
            <option>Tradovate</option>
            <option>MetaTrader</option>
            <option>Other / Not sure</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="msg">Anything we should know? (optional)</label>
        <textarea id="msg" name="msg" rows={3} placeholder="Tell us about your goals…" />
      </div>

      <button type="submit" className="btn btn--solid btn--lg" style={{ width: "100%" }}>
        Submit application
      </button>
      <p className="form__note">
        Applications are reviewed manually — this is a qualification step, not a sales process.
        Access is offered, not guaranteed. By applying you acknowledge our risk disclosure.
      </p>
    </form>
  );
}
