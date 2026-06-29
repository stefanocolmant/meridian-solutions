"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import { Bot, Send, RotateCcw, Sparkles, ArrowUpRight } from "lucide-react";
import { PageHead, Panel, Badge, cn } from "@/portal/ui";
import { ME } from "@/portal/data";

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

const QUICK_PROMPTS: string[] = [
  "How do I set up my webhook?",
  "Explain the daily-loss limit",
  "Which prop firm fits Polaris?",
  "How do I read a signal?",
];

/* Deterministic, keyword-matched canned answers — no network, no clock. */
const REPLIES: { match: string[]; answer: string }[] = [
  {
    match: ["webhook", "forward", "set up", "setup", "connect"],
    answer:
      `Your forwarding endpoint is ${ME.webhookUrl}. To wire it up:\n` +
      `1. Open ${ME.automationPlatform} and create a new webhook strategy.\n` +
      `2. Paste that URL as the inbound endpoint and select your funded account(s).\n` +
      `3. In TradingView, point every alert on the master chart at the same URL.\n` +
      `When Software Setup shows all-green, ${ME.assignedAlgorithm} signals route automatically — to one account or many.`,
  },
  {
    match: ["daily", "loss", "limit", "drawdown"],
    answer:
      "The daily-loss limit is an advisory safeguard, not a hard stop. Once your realized P&L for the session crosses the threshold you set, the portal flags it and the desk is notified — but Meridian never force-closes a position. You keep full account control. Most members size the limit at one to two times their average winning day so a single rough session can't undo a week.",
  },
  {
    match: ["prop", "firm", "polaris", "topstep", "apex", "evaluation", "funded"],
    answer:
      `On the ${ME.tierLabel} tier you can run all nine algorithms, so look for a firm with a generous trailing drawdown and no daily-loss lock — that lets the full strategy set breathe. Topstep, Apex and MyFundedFutures all accept webhook automation and pair well with Polaris. Because one signal can route to several accounts at once, members often stack two or three evaluations rather than scaling a single account.`,
  },
  {
    match: ["read", "signal", "entry", "stop", "target", "anatomy"],
    answer:
      "Every signal carries four things: the algorithm that fired it, the direction (long/short), the timeframe, and the price levels — entry, stop and target. On the Signal Feed you also see the forwarding status and which accounts it hit. Read it as: 'this algo, on this timeframe, wants this side here, risking to the stop, aiming for the target.' The Journal lets you annotate the reasoning so you can review it later.",
  },
  {
    match: ["payout", "withdraw", "cash"],
    answer:
      "Payouts are handled by your prop firm, not by Meridian — we never hold or custody capital. The portal's Payouts page mirrors your approved and pending withdrawals so you can track them in one place, but the request itself happens inside your firm's dashboard.",
  },
  {
    match: ["tier", "compass", "vega", "upgrade", "polaris"],
    answer:
      `Tiers map to how many algorithms you can run: Compass unlocks four, Vega seven, and ${ME.tierLabel} all nine. You're on ${ME.tierLabel}, so the full suite is available. Upgrades take effect on your next signal once the desk re-provisions your chart template.`,
  },
  {
    match: ["session", "hours", "time", "restrict"],
    answer:
      "Session restrictions let you mute signals outside the windows you trade. They're advisory — signals still log on the feed, they just won't forward to your accounts during a paused window. Useful for skipping low-liquidity overnight tape or news events.",
  },
];

function replyFor(input: string): string {
  const q = input.toLowerCase();
  for (const r of REPLIES) {
    if (r.match.some((m) => q.includes(m))) return r.answer;
  }
  return (
    `Here's how I can help, ${ME.firstName}: I answer product questions about your Meridian setup — ` +
    "webhooks and forwarding, the four risk safeguards, reading the Signal Feed, picking a prop firm, and where to find payouts or training. " +
    "Try one of the suggested prompts, or ask about your webhook, the daily-loss limit, or a specific algorithm."
  );
}

const CAPABILITIES: string[] = [
  "Webhook & forwarding setup",
  "The four risk safeguards",
  "Reading the Signal Feed",
  "Prop-firm fit by tier",
  "Payouts & training paths",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function autoGrow(el: HTMLTextAreaElement): void {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }

  function send(text: string): void {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: t },
      { role: "assistant", content: replyFor(t) },
    ]);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    setInput(e.target.value);
    autoGrow(e.target);
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    send(input);
  }

  function reset(): void {
    setMessages([]);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
  }

  return (
    <>
      <PageHead
        eyebrow="Assistant"
        title="AI Navigator"
        sub="Ask about your setup, safeguards and signals. Answers are product guidance, not financial advice."
        actions={
          <div className="p-row" style={{ gap: "0.6rem" }}>
            <Badge tone="signal">Beta</Badge>
            {messages.length > 0 && (
              <button type="button" className="p-btn p-btn--ghost" onClick={reset}>
                <RotateCcw size={13} /> New chat
              </button>
            )}
          </div>
        }
      />

      <div className="p-split">
        {/* ---- chat column ---- */}
        <Panel pad={false} className="p-chatwrap">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 248px)",
              minHeight: 460,
            }}
          >
            {/* scrollable messages */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.2rem 1.1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    margin: "auto",
                    maxWidth: 480,
                    width: "100%",
                    textAlign: "center",
                    padding: "1rem 0",
                  }}
                >
                  <span
                    className="p-side__avatar"
                    style={{
                      width: 48,
                      height: 48,
                      margin: "0 auto 1rem",
                      background: "rgba(204,100,55,0.16)",
                      color: "var(--signal)",
                    }}
                  >
                    <Bot size={22} />
                  </span>
                  <h3 className="display d-sm" style={{ marginBottom: "0.4rem" }}>
                    How can I help?
                  </h3>
                  <p className="muted" style={{ fontSize: "0.82rem", marginBottom: "1.4rem" }}>
                    I answer product questions about your Meridian portal. Pick a starting point.
                  </p>
                  <div className="p-grid-2" style={{ gap: "0.6rem", textAlign: "left" }}>
                    {QUICK_PROMPTS.map((p: string) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => send(p)}
                        className="p-row"
                        style={{
                          gap: "0.55rem",
                          textAlign: "left",
                          padding: "0.7rem 0.8rem",
                          border: "1px solid var(--line)",
                          borderRadius: 10,
                          background: "rgba(0,0,0,0.15)",
                          color: "var(--fg)",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        <Sparkles size={14} style={{ color: "var(--signal)", flexShrink: 0 }} />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m: Message, i: number) =>
                  m.role === "user" ? (
                    <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div
                        style={{
                          maxWidth: "80%",
                          background: "rgba(204,100,55,0.12)",
                          border: "1px solid rgba(204,100,55,0.34)",
                          borderRadius: "12px 12px 4px 12px",
                          padding: "0.65rem 0.9rem",
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                      <span
                        className="p-side__avatar"
                        style={{
                          width: 30,
                          height: 30,
                          flexShrink: 0,
                          background: "rgba(204,100,55,0.16)",
                          color: "var(--signal)",
                        }}
                      >
                        <Bot size={15} />
                      </span>
                      <div
                        style={{
                          maxWidth: "80%",
                          background: "rgba(237,235,231,0.04)",
                          border: "1px solid var(--line)",
                          borderRadius: "4px 12px 12px 12px",
                          padding: "0.7rem 0.9rem",
                          fontSize: "0.85rem",
                          lineHeight: 1.55,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* fixed composer */}
            <form
              onSubmit={handleSubmit}
              style={{ borderTop: "1px solid var(--line)", padding: "0.8rem 0.9rem" }}
            >
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end" }}>
                <textarea
                  ref={taRef}
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleKey}
                  rows={1}
                  placeholder="Ask the Navigator…"
                  aria-label="Message the AI Navigator"
                  style={{
                    flex: 1,
                    resize: "none",
                    maxHeight: 140,
                    minHeight: 40,
                    padding: "0.6rem 0.75rem",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    color: "var(--fg)",
                    fontFamily: "inherit",
                    fontSize: "0.85rem",
                    lineHeight: 1.4,
                  }}
                />
                <button
                  type="submit"
                  className="p-btn p-btn--solid"
                  disabled={!input.trim()}
                  style={{ opacity: input.trim() ? 1 : 0.45 }}
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="muted" style={{ fontSize: "0.68rem", marginTop: "0.55rem" }}>
                The Navigator explains how your Meridian portal works. It does not place orders and
                its answers are not financial, investment, or trading advice.
              </p>
            </form>
          </div>
        </Panel>

        {/* ---- context aside ---- */}
        <div className="p-stack" style={{ gap: "1.2rem" }}>
          <Panel eyebrow="Scope" title="What I can help with">
            <div className="p-stack" style={{ gap: "0.1rem" }}>
              {CAPABILITIES.map((c: string, i: number) => (
                <div
                  key={c}
                  className="p-row"
                  style={{
                    gap: "0.55rem",
                    padding: "0.55rem 0",
                    borderBottom:
                      i < CAPABILITIES.length - 1 ? "1px solid var(--line)" : "none",
                    fontSize: "0.82rem",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--signal)", flexShrink: 0 }} />
                  {c}
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Shortcuts" title="Suggested prompts">
            <div className="p-stack" style={{ gap: "0.5rem" }}>
              {QUICK_PROMPTS.map((p: string) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="p-row"
                  style={{
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.6rem 0.7rem",
                    border: "1px solid var(--line)",
                    borderRadius: 9,
                    background: "rgba(0,0,0,0.15)",
                    color: "var(--fg)",
                    fontSize: "0.78rem",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {p}
                  <ArrowUpRight size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Context" title="Your configuration">
            <div className="p-stack" style={{ gap: "0.7rem", fontSize: "0.82rem" }}>
              {[
                ["Tier", ME.tierLabel],
                ["Algorithm", ME.assignedAlgorithm],
                ["Automation", ME.automationPlatform],
              ].map(([k, v]: string[]) => (
                <div key={k} className="p-row" style={{ justifyContent: "space-between", gap: "0.6rem" }}>
                  <span className="p-stat__label">{k}</span>
                  <span style={{ textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <div className="p-row" style={{ justifyContent: "space-between", gap: "0.6rem", alignItems: "flex-start" }}>
                <span className="p-stat__label">Webhook</span>
                <span className={cn("mono")} style={{ fontSize: "0.68rem", textAlign: "right", wordBreak: "break-all", color: "var(--signal)" }}>
                  {ME.webhookUrl}
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
