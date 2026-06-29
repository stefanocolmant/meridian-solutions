"use client";

import { useState, type ChangeEvent } from "react";
import {
  Plug, RefreshCw, Unlink, Check, Clock, Globe, AlertTriangle, Link2,
} from "lucide-react";
import { PageHead, Panel, StatCard, Badge, EmptyState, cn } from "@/portal/ui";
import { Toggle } from "@/portal/ui-client";
import { ACCOUNTS, ME } from "@/portal/data";

type BrokerKey = "tradovate" | "tradelocker" | "mt";
type ConnectState = "idle" | "connecting" | "done";

const BROKERS: { key: BrokerKey; label: string; soon: boolean }[] = [
  { key: "tradovate", label: "Tradovate", soon: false },
  { key: "tradelocker", label: "TradeLocker", soon: true },
  { key: "mt", label: "MT4 / MT5", soon: true },
];

const TIMEZONES: { value: string; label: string }[] = [
  { value: "America/New_York", label: "New York — ET (UTC−4)" },
  { value: "America/Chicago", label: "Chicago — CT (UTC−5)" },
  { value: "America/Los_Angeles", label: "Los Angeles — PT (UTC−7)" },
  { value: "Europe/London", label: "London — BST (UTC+1)" },
  { value: "Asia/Tokyo", label: "Tokyo — JST (UTC+9)" },
  { value: "UTC", label: "UTC — Coordinated Universal" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<BrokerKey>("tradovate");
  const [timezone, setTimezone] = useState<string>(ME.timezone);

  // per-account state
  const [unlinked, setUnlinked] = useState<Record<string, boolean>>({});
  const [autoSync, setAutoSync] = useState<Record<string, boolean>>(
    () => Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.environment === "Funded"]))
  );
  const [syncedNow, setSyncedNow] = useState<Record<string, boolean>>({});
  const [confirmUnlink, setConfirmUnlink] = useState<string | null>(null);

  // connect-with-tradovate demo flow
  const [connect, setConnect] = useState<ConnectState>("idle");

  // danger zone
  const [deleteText, setDeleteText] = useState<string>("");
  const [deleted, setDeleted] = useState<boolean>(false);

  const linked = ACCOUNTS.filter((a) => !unlinked[a.id]);
  const fundedLinked = linked.filter((a) => a.environment === "Funded").length;
  const autoOn = linked.filter((a) => autoSync[a.id]).length;

  const onSync = (id: string): void => {
    setSyncedNow((s) => ({ ...s, [id]: true }));
    setTimeout(() => setSyncedNow((s) => ({ ...s, [id]: false })), 2200);
  };
  const onUnlink = (id: string): void => {
    setUnlinked((u) => ({ ...u, [id]: true }));
    setConfirmUnlink(null);
  };
  const onReconnect = (id: string): void => setUnlinked((u) => ({ ...u, [id]: false }));
  const setAuto = (id: string) => (v: boolean) => setAutoSync((s) => ({ ...s, [id]: v }));

  const onConnect = (): void => {
    setConnect("connecting");
    setTimeout(() => setConnect("done"), 1400);
  };

  const onDelete = (): void => {
    if (deleteText.trim() !== "DELETE") return;
    setDeleted(true);
  };

  return (
    <>
      <PageHead
        eyebrow="Connections"
        title="Settings"
        sub="Link your broker, choose how Meridian reports the clock, and manage each account connection. Nothing here ever holds or trades your capital."
        actions={
          <span className="tag">
            <Plug size={13} style={{ verticalAlign: "-2px", marginRight: "0.35rem" }} />
            {linked.length} connected
          </span>
        }
      />

      {/* broker tabs */}
      <div className="p-tabs" style={{ marginBottom: "1.4rem" }}>
        {BROKERS.map((b) => (
          <button
            key={b.key}
            type="button"
            className={cn("p-tab", tab === b.key && "is-on")}
            onClick={() => setTab(b.key)}
          >
            {b.label}
            {b.soon && <span className="muted" style={{ marginLeft: "0.45rem", textTransform: "none", letterSpacing: 0 }}>· soon</span>}
          </button>
        ))}
      </div>

      {tab === "tradovate" ? (
        <>
          {/* connected summary */}
          <div className="p-grid-4" style={{ marginBottom: "1.2rem" }}>
            <StatCard label="Linked accounts" value={linked.length} tone="signal" sub={`of ${ACCOUNTS.length} on Tradovate`} icon={<Link2 size={15} />} />
            <StatCard label="Funded" value={fundedLinked} sub="Live capital" />
            <StatCard label="Auto-sync on" value={autoOn} tone="pos" sub="Hands-off refresh" />
            <StatCard label="Reporting clock" value="ET" sub={timezone} icon={<Globe size={15} />} />
          </div>

          {/* global timezone */}
          <Panel eyebrow="Preferences" title="Reporting timezone" action={<Badge tone="info">Applies to all accounts</Badge>}>
            <div className="form">
              <div className="form__row">
                <label className="field">
                  <span>Timezone</span>
                  <select value={timezone} onChange={(e: ChangeEvent<HTMLSelectElement>) => setTimezone(e.target.value)}>
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </label>
                <div className="field" style={{ justifyContent: "flex-end" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                    Effect
                  </span>
                  <p className="muted" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                    Trade timestamps, the calendar and session windows all render in{" "}
                    <span className="accent">{timezone}</span>.
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          {/* per-account cards */}
          <div style={{ marginTop: "1.2rem" }}>
            <Panel eyebrow="Tradovate" title="Connected accounts" action={<span className="mono muted" style={{ fontSize: "0.7rem" }}>{linked.length} active</span>}>
              <div className="p-grid-2" style={{ gap: "0.9rem" }}>
                {ACCOUNTS.map((a) => {
                  const off = !!unlinked[a.id];
                  const confirming = confirmUnlink === a.id;
                  const did = !!syncedNow[a.id];
                  return (
                    <div
                      key={a.id}
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: 10,
                        padding: "0.9rem",
                        background: off ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.12)",
                        opacity: off ? 0.72 : 1,
                      }}
                    >
                      <div className="p-row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: "0.6rem" }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{a.name}</div>
                          <div className="muted mono" style={{ fontSize: "0.68rem", marginTop: "0.2rem" }}>{a.accountId} · {a.firm}</div>
                        </div>
                        {off
                          ? <Badge tone="flat">Disconnected</Badge>
                          : <Badge tone={a.environment === "Funded" ? "pos" : "info"}>{a.environment}</Badge>}
                      </div>

                      {off ? (
                        <div className="p-row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: "0.9rem" }}>
                          <span className="muted" style={{ fontSize: "0.76rem" }}>Connection removed.</span>
                          <button type="button" className="p-btn p-btn--ghost" onClick={() => onReconnect(a.id)}>
                            <Link2 size={13} /> Reconnect
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="p-row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: "0.85rem", paddingTop: "0.75rem", borderTop: "1px solid var(--line)" }}>
                            <span className="muted mono" style={{ fontSize: "0.68rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <Clock size={12} /> {did ? "synced just now" : `synced ${a.lastSync}`}
                            </span>
                            <Toggle on={!!autoSync[a.id]} onChange={setAuto(a.id)} label="Auto-sync" />
                          </div>

                          <div className="p-row" style={{ gap: "0.5rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
                            {confirming ? (
                              <>
                                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--signal)" }}>Unlink this account?</span>
                                <button type="button" className="p-btn p-btn--danger" onClick={() => onUnlink(a.id)}>Confirm</button>
                                <button type="button" className="p-btn p-btn--ghost" onClick={() => setConfirmUnlink(null)}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <button type="button" className="p-btn p-btn--ghost" onClick={() => onSync(a.id)}>
                                  {did ? <><Check size={13} /> Synced</> : <><RefreshCw size={13} /> Sync</>}
                                </button>
                                <button type="button" className="p-btn" onClick={() => setConfirmUnlink(a.id)}>
                                  <Unlink size={13} /> Unlink
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* always-visible connect card */}
              <div
                style={{
                  marginTop: "1rem",
                  border: "1px dashed var(--line)",
                  borderRadius: 10,
                  padding: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div className="p-row" style={{ gap: "0.7rem" }}>
                  <span className="p-side__avatar" style={{ width: 34, height: 34, background: "rgba(204,100,55,0.16)", color: "var(--signal)" }}>
                    <Plug size={16} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600 }}>Connect another Tradovate account</span>
                    <span className="muted" style={{ fontSize: "0.74rem" }}>OAuth handshake — read-only positions &amp; orders. No withdrawal scope.</span>
                  </span>
                </div>
                {connect === "done" ? (
                  <span className="mono pos" style={{ fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <Check size={14} /> Authorised — pulling accounts
                  </span>
                ) : (
                  <button type="button" className="p-btn p-btn--solid" onClick={onConnect} disabled={connect === "connecting"}>
                    {connect === "connecting" ? "Authorising…" : "Connect with Tradovate"}
                  </button>
                )}
              </div>
            </Panel>
          </div>
        </>
      ) : (
        <Panel eyebrow="Brokers" title={BROKERS.find((b) => b.key === tab)?.label ?? "Broker"}>
          <EmptyState
            icon={<Plug size={20} />}
            title="Coming soon"
            body={`${BROKERS.find((b) => b.key === tab)?.label ?? "This broker"} integration is on the roadmap. Tradovate is fully supported today — switch tabs to manage it.`}
          />
        </Panel>
      )}

      {/* danger zone */}
      <section className="p-panel" style={{ marginTop: "1.6rem", borderColor: "rgba(217,121,79,0.45)" }}>
        <div className="p-panel__head">
          <div>
            <span className="p-panel__eyebrow">Irreversible</span>
            <h2 className="p-panel__title">Danger zone</h2>
          </div>
          <div className="p-panel__action"><Badge tone="neg">Permanent</Badge></div>
        </div>
        <div className="p-panel__body">
          {deleted ? (
            <div className="p-empty" style={{ textAlign: "left", alignItems: "flex-start" }}>
              <div className="p-empty__icon"><AlertTriangle size={20} /></div>
              <p className="p-empty__title">Deletion scheduled.</p>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Your account and all linked connections are queued for removal. The desk will email{" "}
                <span className="accent">{ME.email}</span> to confirm. This is a demo &mdash; nothing was actually deleted.
              </p>
            </div>
          ) : (
            <div className="p-row" style={{ justifyContent: "space-between", gap: "1.2rem", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="muted" style={{ fontSize: "0.84rem", lineHeight: 1.6, maxWidth: "52ch", marginBottom: "0.9rem" }}>
                  Deleting your account unlinks every broker connection and erases your journal, signal history and
                  preferences. Type <span className="accent mono">DELETE</span> to confirm.
                </p>
                <label className="field" style={{ maxWidth: 260 }}>
                  <span>Confirmation</span>
                  <input
                    type="text"
                    value={deleteText}
                    placeholder="DELETE"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDeleteText(e.target.value)}
                  />
                </label>
              </div>
              <button
                type="button"
                className="p-btn p-btn--danger"
                onClick={onDelete}
                disabled={deleteText.trim() !== "DELETE"}
              >
                <AlertTriangle size={13} /> Delete account
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
