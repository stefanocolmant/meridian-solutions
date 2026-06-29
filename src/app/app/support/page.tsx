"use client";

import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import {
  Headset, Send, Check, CheckCheck, Clock, ShieldCheck, GraduationCap, Radio, Mail,
  type LucideIcon,
} from "lucide-react";
import { PageHead, Panel, Badge, TierTag } from "@/portal/ui";
import { CopyButton } from "@/portal/ui-client";
import { ME } from "@/portal/data";

/* --------------------------------- types --------------------------------- */
type SenderRole = "client" | "admin";
interface Message {
  id: number;
  senderRole: SenderRole;
  senderName: string;
  body: string;
  time: string;
  edited?: boolean;
  read?: boolean;
}

/* ------------------------------- seed thread ----------------------------- */
const SEED: Message[] = [
  {
    id: 1,
    senderRole: "admin",
    senderName: "Meridian Desk",
    body: "Hi Jordan — Marcus from the Meridian Desk here. I can see you started Module 2, the webhook configuration. How's the setup going?",
    time: "9:28 AM",
    read: true,
  },
  {
    id: 2,
    senderRole: "client",
    senderName: ME.name,
    body: "Hey Marcus. My TradingView alerts fire fine, but TradersPost keeps logging \"no matching strategy\". Did I paste the forwarding URL wrong?",
    time: "9:30 AM",
    read: true,
  },
  {
    id: 3,
    senderRole: "admin",
    senderName: "Meridian Desk",
    body: "Common one — the URL is almost certainly fine. It's the alert message body. The JSON needs the strategy id, not just the action. Paste what you have in the alert and I'll check it.",
    time: "9:31 AM",
    read: true,
  },
  {
    id: 4,
    senderRole: "client",
    senderName: ME.name,
    body: "Here's the message I'm sending: {\"action\":\"buy\",\"symbol\":\"NQ\",\"qty\":1}",
    time: "9:32 AM",
    edited: true,
    read: true,
  },
  {
    id: 5,
    senderRole: "admin",
    senderName: "Meridian Desk",
    body: "That's the gap — you're missing the strategy field. Add \"strategy\":\"polaris-nq\" and TradersPost will match it. Keep the forwarding URL exactly as " + ME.forwardingUrl + " and fire a test alert when you're ready.",
    time: "9:33 AM",
    read: true,
  },
];

/* canned desk replies cycled after each client message */
const DESK_REPLIES: string[] = [
  "Got it — give me a moment to pull your account up on this end.",
  "Perfect, I can see the test signal landed and forwarded cleanly. The pipeline is live.",
  "You're all set. I'll keep this thread open through your first session in case anything else surfaces.",
  "Noted. If you hit another mismatch, paste the raw alert payload and I'll diff it against your config.",
];

/* quick-help links */
const HELP: { label: string; sub: string; href: string; icon: LucideIcon }[] = [
  { label: "Training library", sub: "Setup walkthroughs", href: "/app/training", icon: GraduationCap },
  { label: "Signal feed", sub: "Forwarding logs & retries", href: "/app/signal-feed", icon: Radio },
  { label: "Email the desk", sub: "desk@meridiansolutions.co", href: "mailto:desk@meridiansolutions.co", icon: Mail },
];

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [draft, setDraft] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);

  const nextId = useRef<number>(SEED.length + 1);
  const replyIdx = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const send = (): void => {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = { id: nextId.current++, senderRole: "client", senderName: ME.name, body: text, time: "Now", read: false };
    setMessages((prev) => [...prev, msg]);
    setDraft("");

    window.setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.senderRole === "client" ? { ...m, read: true } : m)));
      setTyping(true);
    }, 900);

    window.setTimeout(() => {
      const reply = DESK_REPLIES[replyIdx.current % DESK_REPLIES.length];
      replyIdx.current += 1;
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, senderRole: "admin", senderName: "Meridian Desk", body: reply, time: "Now", read: true },
      ]);
      setTyping(false);
    }, 2100);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onDraft = (e: ChangeEvent<HTMLTextAreaElement>): void => setDraft(e.target.value);

  return (
    <>
      {/* status banner */}
      <div
        className="p-panel"
        style={{ display: "flex", gap: "0.8rem", alignItems: "center", padding: "0.7rem 1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}
      >
        <Badge tone="pos">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <ShieldCheck size={12} /> Desk online
          </span>
        </Badge>
        <span style={{ fontSize: "0.85rem" }}>You&apos;re talking to a real Meridian engineer — not a bot.</span>
        <span className="mono muted" style={{ marginLeft: "auto", fontSize: "0.7rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <Clock size={13} /> Typical reply under 5 min
        </span>
      </div>

      <PageHead
        eyebrow="1-on-1"
        title="Support"
        sub="A private line to the Meridian Desk for setup, webhooks and account questions. Threads stay open — pick up where you left off."
        actions={<span className="tag">Polaris priority</span>}
      />

      <div className="p-split">
        {/* ------------------------------ conversation ------------------------------ */}
        <Panel
          eyebrow="Conversation"
          title="Webhook setup"
          action={
            <span className="p-row" style={{ gap: "0.5rem" }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--color-up)" }} />
              <span className="muted mono" style={{ fontSize: "0.64rem" }}>Live</span>
            </span>
          }
        >
          {/* thread */}
          <div
            ref={scrollRef}
            className="p-stack"
            style={{ gap: "0.9rem", maxHeight: 440, overflowY: "auto", paddingRight: "0.4rem" }}
          >
            {messages.map((m: Message) => {
              const isClient = m.senderRole === "client";
              return (
                <div
                  key={m.id}
                  className="p-row"
                  style={{ alignItems: "flex-end", gap: "0.5rem", flexDirection: isClient ? "row-reverse" : "row" }}
                >
                  <span
                    className="p-side__avatar"
                    style={{
                      width: 30,
                      height: 30,
                      flex: "none",
                      background: isClient ? "rgba(237,235,231,0.06)" : "rgba(204,100,55,0.16)",
                      color: isClient ? "var(--muted)" : "var(--signal)",
                      fontSize: "0.62rem",
                    }}
                  >
                    {isClient ? ME.initials : <Headset size={14} />}
                  </span>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: isClient ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                    <div
                      style={{
                        padding: "0.6rem 0.8rem",
                        borderRadius: 12,
                        border: "1px solid",
                        borderColor: isClient ? "rgba(204,100,55,0.32)" : "var(--line)",
                        background: isClient ? "rgba(204,100,55,0.10)" : "rgba(255,255,255,0.02)",
                        fontSize: "0.85rem",
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {m.body}
                    </div>

                    <span
                      className="muted mono"
                      style={{ fontSize: "0.6rem", marginTop: "0.32rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                    >
                      {isClient ? (
                        <>
                          <span>{m.time}</span>
                          {m.edited && <span>· edited</span>}
                          <span>·</span>
                          {m.read ? (
                            <span className="accent" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                              <CheckCheck size={11} /> Read
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                              <Check size={11} /> Sent
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span style={{ color: "var(--signal)" }}>{m.senderName}</span>
                          <span>· {m.time}</span>
                          {m.edited && <span>· edited</span>}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="p-row" style={{ alignItems: "flex-end", gap: "0.5rem" }}>
                <span className="p-side__avatar" style={{ width: 30, height: 30, flex: "none", background: "rgba(204,100,55,0.16)", color: "var(--signal)" }}>
                  <Headset size={14} />
                </span>
                <div
                  style={{
                    padding: "0.55rem 0.8rem",
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="muted mono" style={{ fontSize: "0.72rem", letterSpacing: "0.18em" }}>• • •</span>
                </div>
              </div>
            )}
          </div>

          {/* composer */}
          <div style={{ borderTop: "1px solid var(--line)", marginTop: "1rem", paddingTop: "1rem" }}>
            <div className="field">
              <textarea
                value={draft}
                onChange={onDraft}
                onKeyDown={onKey}
                rows={2}
                placeholder="Message the Meridian Desk…"
                style={{ minHeight: 64, resize: "vertical" }}
              />
            </div>
            <div className="p-row" style={{ justifyContent: "space-between", marginTop: "0.7rem", gap: "0.8rem", flexWrap: "wrap" }}>
              <span className="muted mono" style={{ fontSize: "0.62rem" }}>Enter to send · Shift + Enter for a new line</span>
              <button
                type="button"
                className="p-btn p-btn--solid"
                onClick={send}
                disabled={!draft.trim()}
                style={!draft.trim() ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
              >
                <Send size={13} /> Send
              </button>
            </div>
          </div>
        </Panel>

        {/* ---------------------------------- aside --------------------------------- */}
        <div className="p-stack">
          {/* who you're talking to */}
          <Panel eyebrow="Your desk" title="Meridian Desk">
            <div className="p-row" style={{ gap: "0.7rem", marginBottom: "1.1rem" }}>
              <span className="p-side__avatar" style={{ width: 42, height: 42, flex: "none", background: "rgba(204,100,55,0.16)", color: "var(--signal)" }}>
                <Headset size={18} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Marcus Hale</div>
                <div className="p-row" style={{ gap: "0.4rem", marginTop: "0.15rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--color-up)" }} />
                  <span className="muted" style={{ fontSize: "0.72rem" }}>Online · Onboarding engineer</span>
                </div>
              </div>
            </div>

            <div className="p-stack" style={{ gap: "0.7rem" }}>
              {[
                { k: "Your tier", v: <TierTag tier={ME.tierLabel} /> },
                { k: "Assigned algorithm", v: <span style={{ fontSize: "0.8rem" }}>{ME.assignedAlgorithm}</span> },
                { k: "Automation platform", v: <span style={{ fontSize: "0.8rem" }}>{ME.automationPlatform}</span> },
                { k: "Member since", v: <span style={{ fontSize: "0.8rem" }}>{ME.memberSince}</span> },
              ].map((row: { k: string; v: React.ReactNode }) => (
                <div key={row.k} className="p-row" style={{ justifyContent: "space-between", gap: "0.8rem", borderBottom: "1px solid var(--line)", paddingBottom: "0.5rem" }}>
                  <span className="p-stat__label">{row.k}</span>
                  {row.v}
                </div>
              ))}
            </div>
          </Panel>

          {/* your setup — copyable */}
          <Panel eyebrow="Reference" title="Your setup">
            <div className="p-stack" style={{ gap: "0.9rem" }}>
              <div>
                <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span className="p-stat__label">Forwarding URL</span>
                  <CopyButton text={ME.forwardingUrl} />
                </div>
                <div className="p-codeblock" style={{ wordBreak: "break-all" }}>{ME.forwardingUrl}</div>
              </div>
              <div>
                <div className="p-row" style={{ justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span className="p-stat__label">Webhook endpoint</span>
                  <CopyButton text={ME.webhookUrl} />
                </div>
                <div className="p-codeblock" style={{ wordBreak: "break-all" }}>{ME.webhookUrl}</div>
              </div>
              <div className="p-row" style={{ justifyContent: "space-between" }}>
                <span className="p-stat__label">TradingView user</span>
                <span className="mono" style={{ fontSize: "0.78rem" }}>{ME.tvUsername}</span>
              </div>
            </div>
          </Panel>

          {/* quick help */}
          <Panel eyebrow="Self-serve" title="Quick help">
            <div className="p-stack" style={{ gap: "0.1rem" }}>
              {HELP.map((h: { label: string; sub: string; href: string; icon: LucideIcon }, i: number) => {
                const Icon = h.icon;
                return (
                  <a
                    key={h.label}
                    href={h.href}
                    className="p-row"
                    style={{ padding: "0.65rem 0", borderBottom: i < HELP.length - 1 ? "1px solid var(--line)" : "none", gap: "0.7rem" }}
                  >
                    <span className="p-side__avatar" style={{ width: 30, height: 30, flex: "none", background: "rgba(237,235,231,0.05)", color: "var(--muted)" }}>
                      <Icon size={14} />
                    </span>
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 500 }}>{h.label}</span>
                      <span className="muted" style={{ fontSize: "0.7rem" }}>{h.sub}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
