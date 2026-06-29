"use client";

import { useState, type ChangeEvent, type CSSProperties } from "react";
import {
  User, Mail, Cpu, Send, KeyRound, ShieldCheck, Lock, Check, Clock, BadgeCheck,
} from "lucide-react";
import { PageHead, Panel, Badge, TierTag, cn } from "@/portal/ui";
import { CopyButton } from "@/portal/ui-client";
import { ME } from "@/portal/data";

const AUTOMATION_PLATFORMS = ["TradersPost", "CrossTrade", "Manual"] as const;
type AutomationPlatform = (typeof AUTOMATION_PLATFORMS)[number];

const readonlyBox: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  background: "rgba(0,0,0,0.18)",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "0.9rem 1rem",
  color: "var(--muted)",
  fontSize: "0.98rem",
};

function ReadOnly({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={readonlyBox}>
      <span style={{ color: "var(--muted)", display: "inline-flex" }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
      <Lock size={13} style={{ opacity: 0.45 }} />
    </div>
  );
}

export default function ProfilePage() {
  // editable, controlled fields
  const [name, setName] = useState<string>(ME.name);
  const [tvUsername, setTvUsername] = useState<string>(ME.tvUsername);
  const [forwardingUrl, setForwardingUrl] = useState<string>(ME.forwardingUrl);
  const [platform, setPlatform] = useState<AutomationPlatform>(ME.automationPlatform as AutomationPlatform);

  // ui state
  const [saved, setSaved] = useState<boolean>(false);
  const [pinEnabled, setPinEnabled] = useState<boolean>(false);

  const onText = (set: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) => set(e.target.value);

  const onSave = (): void => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <>
      <PageHead
        eyebrow="Account"
        title="Profile"
        sub="Your identity, trading connection and access controls. Changes apply across every linked account."
        actions={<TierTag tier={ME.tierLabel} />}
      />

      <div className="p-split" style={{ marginBottom: "1.2rem" }}>
        {/* ---- main column ---- */}
        <div className="p-stack" style={{ gap: "1.2rem" }}>
          {/* personal info */}
          <Panel eyebrow="Identity" title="Personal info">
            <div className="form">
              <div className="form__row">
                <div className="field">
                  <label htmlFor="pf-name">Full name</label>
                  <input id="pf-name" type="text" value={name} onChange={onText(setName)} placeholder="Your name" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <ReadOnly icon={<Mail size={14} />}>{ME.email}</ReadOnly>
                </div>
              </div>
              <div className="form__row">
                <div className="field">
                  <label>Product tier</label>
                  <div style={{ ...readonlyBox, padding: "0.7rem 1rem" }}>
                    <TierTag tier={ME.tierLabel} />
                    <span className="muted" style={{ flex: 1, fontSize: "0.82rem" }}>All nine configurations</span>
                    <BadgeCheck size={15} style={{ color: "var(--signal)" }} />
                  </div>
                </div>
                <div className="field">
                  <label>Member since</label>
                  <ReadOnly icon={<Clock size={14} />}>{ME.memberSince}</ReadOnly>
                </div>
              </div>
              <p className="form__note">
                Your email is your login and cannot be changed here — contact the desk to update it.
              </p>
            </div>
          </Panel>

          {/* trading setup */}
          <Panel eyebrow="Connection" title="Trading setup">
            <div className="form">
              <div className="form__row">
                <div className="field">
                  <label htmlFor="pf-tv">TradingView username</label>
                  <input id="pf-tv" type="text" value={tvUsername} onChange={onText(setTvUsername)} placeholder="tv_username" />
                </div>
                <div className="field">
                  <label htmlFor="pf-platform">Automation platform</label>
                  <select id="pf-platform" value={platform} onChange={(e) => setPlatform(e.target.value as AutomationPlatform)}>
                    {AUTOMATION_PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="pf-fwd">Forwarding URL</label>
                <input id="pf-fwd" type="text" value={forwardingUrl} onChange={onText(setForwardingUrl)} placeholder="https://hook.meridiansolutions.co/u/…" />
              </div>
              <div className="form__row">
                <div className="field">
                  <label>Assigned algorithm</label>
                  <ReadOnly icon={<Cpu size={14} />}>{ME.assignedAlgorithm}</ReadOnly>
                </div>
                <div className="field">
                  <label>Webhook endpoint</label>
                  <div style={{ ...readonlyBox, padding: "0.55rem 0.6rem 0.55rem 1rem" }}>
                    <Send size={14} />
                    <span className="mono" style={{ flex: 1, minWidth: 0, fontSize: "0.74rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ME.webhookUrl}
                    </span>
                    <CopyButton text={ME.webhookUrl} />
                  </div>
                </div>
              </div>
              <p className="form__note">
                Signals route from TradingView to your forwarder, then on to{" "}
                <span className="accent">{platform}</span>
                {platform === "Manual" ? " — you place the orders yourself." : " for execution."}
              </p>
            </div>
          </Panel>
        </div>

        {/* ---- aside ---- */}
        <div className="p-stack" style={{ gap: "1.2rem" }}>
          {/* identity summary */}
          <Panel pad>
            <div className="p-row" style={{ gap: "0.9rem", alignItems: "center" }}>
              <span
                className={cn("p-side__avatar")}
                style={{ width: 54, height: 54, fontSize: "1.05rem", fontWeight: 600, background: "rgba(204,100,55,0.16)", color: "var(--signal)" }}
              >
                {ME.initials}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>{name || ME.name}</div>
                <div className="muted" style={{ fontSize: "0.78rem" }}>{ME.email}</div>
              </div>
            </div>
            <div className="p-stack" style={{ gap: "0.7rem", marginTop: "1.1rem", paddingTop: "1.1rem", borderTop: "1px solid var(--line)" }}>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted" style={{ fontSize: "0.8rem" }}>Tier</span>
                <TierTag tier={ME.tierLabel} />
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted" style={{ fontSize: "0.8rem" }}>Platform</span>
                <span className="mono" style={{ fontSize: "0.76rem" }}>{platform}</span>
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted" style={{ fontSize: "0.8rem" }}>Timezone</span>
                <span className="mono" style={{ fontSize: "0.76rem" }}>{ME.timezone}</span>
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="muted" style={{ fontSize: "0.8rem" }}>PIN unlock</span>
                <Badge tone={pinEnabled ? "pos" : "flat"}>{pinEnabled ? "Enabled" : "Off"}</Badge>
              </div>
            </div>
          </Panel>

          {/* security */}
          <Panel eyebrow="Safeguards" title="Security">
            <p className="muted" style={{ fontSize: "0.84rem", lineHeight: 1.6 }}>
              Add a four-digit PIN to gate sensitive actions — payout requests, webhook changes and
              account links — with a quick local unlock on this device.
            </p>

            <div
              className="p-row"
              style={{
                marginTop: "1rem",
                gap: "0.6rem",
                padding: "0.8rem 0.9rem",
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "rgba(0,0,0,0.18)",
              }}
            >
              <span
                className={cn("p-side__avatar")}
                style={{ width: 32, height: 32, background: pinEnabled ? "rgba(95,167,119,0.16)" : "rgba(237,235,231,0.05)", color: pinEnabled ? "var(--color-up)" : "var(--muted)" }}
              >
                {pinEnabled ? <ShieldCheck size={15} /> : <KeyRound size={15} />}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 500 }}>
                  {pinEnabled ? "PIN unlock enabled" : "PIN unlock not set"}
                </span>
                <span className="muted" style={{ fontSize: "0.72rem" }}>
                  {pinEnabled ? "Required for sensitive actions" : "Recommended for funded accounts"}
                </span>
              </span>
            </div>

            <button
              type="button"
              className={cn("p-btn", pinEnabled ? "p-btn--ghost" : "p-btn--solid")}
              style={{ marginTop: "1rem", width: "100%" }}
              onClick={() => setPinEnabled((v) => !v)}
            >
              {pinEnabled ? "Disable PIN unlock" : "Set up PIN unlock"}
            </button>
          </Panel>
        </div>
      </div>

      {/* save row */}
      <div className="p-row" style={{ justifyContent: "flex-end", gap: "0.8rem", alignItems: "center" }}>
        {saved && (
          <span className="mono pos" style={{ fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <Check size={14} /> Saved
          </span>
        )}
        <button type="button" className="p-btn p-btn--solid" onClick={onSave}>
          <User size={14} /> {saved ? "Saved" : "Save changes"}
        </button>
      </div>
    </>
  );
}
