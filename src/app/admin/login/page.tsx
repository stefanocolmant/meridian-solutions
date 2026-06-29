"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AdminLoginPage() {
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
        body: JSON.stringify({ email, password, intent: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }
      window.location.href = data.redirect || "/admin";
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("admin@meridiansolutions.co");
    setPassword("Meridian-Admin");
  }

  return (
    <div className="p-auth-wrap">
      <div className="p-auth-grid" aria-hidden />
      <Link href="/login" className="p-auth-back">← Member login</Link>

      <div className="p-authcard">
        <div className="p-authcard__brand"><Logo size={24} showText={false} /> <span>Meridian · Admin</span></div>
        <p className="eyebrow" style={{ justifyContent: "center", marginBottom: "0.4rem" }}>
          <span className="dot" /> Admin panel
        </p>
        <p className="muted" style={{ textAlign: "center", fontSize: "0.84rem", marginBottom: "1.6rem" }}>
          Authorized personnel only.
        </p>

        <form className="form" onSubmit={submit}>
          {error && <div className="p-auth-error">{error}</div>}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="username" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="admin@meridiansolutions.co" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn--solid btn--lg" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in to admin"}
          </button>
        </form>

        <div className="p-auth-demo">
          <b>Demo admin</b> — <span className="mono">admin@meridiansolutions.co</span> / <span className="mono">Meridian-Admin</span>
          <button type="button" onClick={fillDemo} className="p-copy" style={{ marginTop: "0.6rem" }}>
            Fill demo credentials
          </button>
        </div>
      </div>
    </div>
  );
}
