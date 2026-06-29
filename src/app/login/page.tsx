"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, intent: "user" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }
      window.location.href = data.redirect || "/app/dashboard";
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("demo@meridiansolutions.co");
    setPassword("Scalprophecy-2026");
  }

  return (
    <div className="p-auth-wrap">
      <div className="p-auth-grid" aria-hidden />
      <Link href="/" className="p-auth-back">← Back to site</Link>
      <Link href="/admin/login" className="p-auth-alt">Admin →</Link>

      <div className="p-authcard">
        <div className="p-authcard__brand"><Logo size={24} /></div>
        <p className="muted" style={{ textAlign: "center", fontSize: "0.88rem", marginBottom: "1.6rem" }}>
          Sign in to your client workspace.
        </p>

        <form className="form" onSubmit={submit}>
          {error && <div className="p-auth-error">{error}</div>}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="username" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn--solid btn--lg" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="form__note" style={{ textAlign: "center" }}>
            Not a member yet? <Link href="/apply" className="accent">Apply for access →</Link>
          </p>
        </form>

        <div className="p-auth-demo">
          <b>Demo access</b> — <span className="mono">demo@meridiansolutions.co</span> / <span className="mono">Scalprophecy-2026</span>
          <button type="button" onClick={fillDemo} className="p-copy" style={{ marginTop: "0.6rem" }}>
            Fill demo credentials
          </button>
        </div>
      </div>
    </div>
  );
}
