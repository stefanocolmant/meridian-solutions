"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

type TextField = { name: string; label: string; placeholder: string; type?: string; half?: boolean };
type Step =
  | { kind: "text"; q: string; hint?: string; fields: TextField[] }
  | { kind: "choice"; q: string; hint?: string; name: string; options: string[] };

const STEPS: Step[] = [
  {
    kind: "text",
    q: "Start your application.",
    hint: "Every application is personally reviewed by the Meridian team.",
    fields: [
      { name: "firstName", label: "First name", placeholder: "Jordan", half: true },
      { name: "lastName", label: "Last name", placeholder: "Reyes", half: true },
    ],
  },
  {
    kind: "text",
    q: "Where should we send your access details?",
    hint: "We email from access@meridiansolutions.co — no spam, ever.",
    fields: [{ name: "email", label: "Email", placeholder: "you@email.com", type: "email" }],
  },
  {
    kind: "choice",
    q: "How long have you been trading?",
    name: "experience",
    options: ["New to trading", "1–3 years", "3–5 years", "5+ years"],
  },
  {
    kind: "choice",
    q: "How will you deploy the algorithms?",
    name: "deploy",
    options: ["At a prop firm", "On my own capital", "Both", "Still deciding"],
  },
  {
    kind: "choice",
    q: "What size account do you trade?",
    name: "capital",
    options: ["Under $25k", "$25k – $50k", "$50k – $150k", "$150k+"],
  },
  {
    kind: "choice",
    q: "What matters most to you right now?",
    name: "goal",
    options: ["Passing a prop evaluation", "Consistent monthly income", "Diversifying my trading", "Removing emotion from execution"],
  },
];

const KEYS = ["A", "B", "C", "D"];

export function LeadWizard() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const step = STEPS[i];
  const total = STEPS.length;
  const progress = done ? 100 : Math.round((i / total) * 100);

  function set(name: string, value: string) {
    setAnswers((a) => ({ ...a, [name]: value }));
  }

  function next() {
    setError("");
    if (i + 1 >= total) {
      // demo: no network — record the lead client-side and show success
      setDone(true);
      return;
    }
    setI(i + 1);
  }

  function submitText() {
    setError("");
    if (step.kind !== "text") return;
    for (const f of step.fields) {
      const v = (answers[f.name] || "").trim();
      if (!v) { setError("Please fill in every field."); return; }
      if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    next();
  }

  function choose(name: string, value: string) {
    set(name, value);
    setTimeout(next, 140); // brief highlight, then auto-advance
  }

  if (done) {
    return (
      <div className="lp-card" id="form">
        <div className="lp-success">
          <span className="lp-success__badge"><Check size={26} /></span>
          <p className="lp-eyebrow" style={{ justifyContent: "center" }}>Application received</p>
          <h2 className="lp-step__q" style={{ margin: 0 }}>
            You&apos;re on the list{answers.firstName ? `, ${answers.firstName}` : ""}.
          </h2>
          <p className="muted pretty" style={{ maxWidth: "42ch" }}>
            Every application is reviewed by hand. If it&apos;s a fit, we&apos;ll reach out from{" "}
            <span className="accent">access@meridiansolutions.co</span> to book your onboarding call.
          </p>
          <Link href="/login" className="btn btn--solid btn--lg" style={{ marginTop: "0.4rem" }}>
            See inside the platform <ArrowRight size={15} />
          </Link>
          <p className="lp-reassure">Application-gated · No card required · You keep full account control</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-card" id="form">
      <div className="lp-prog">
        <span className="lp-prog__label">Step {i + 1} of {total}</span>
        <span className="lp-prog__track"><span className="lp-prog__fill" style={{ width: `${progress}%` }} /></span>
      </div>

      <div className="lp-step" key={i}>
        <h2 className="lp-step__q">{step.q}</h2>
        {step.hint && <p className="lp-step__hint">{step.hint}</p>}

        {step.kind === "text" ? (
          <>
            <div className="form">
              <div className={step.fields.length > 1 ? "form__row" : ""}>
                {step.fields.map((f) => (
                  <div className="field" key={f.name}>
                    <label htmlFor={f.name}>{f.label}</label>
                    <input
                      id={f.name}
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={answers[f.name] || ""}
                      autoFocus={f.name === step.fields[0].name}
                      onChange={(e) => set(f.name, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") submitText(); }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="lp-step__hint" style={{ color: "var(--signal-soft)", marginTop: "0.8rem" }}>{error}</p>}
            <div className="lp-wnav">
              {i > 0 ? (
                <button type="button" className="lp-back" onClick={() => setI(i - 1)}>
                  <ArrowLeft size={12} style={{ verticalAlign: "middle" }} /> Back
                </button>
              ) : <span />}
              <button type="button" className="btn btn--solid" onClick={submitText}>
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="lp-opts">
              {step.options.map((opt, k) => (
                <button key={opt} type="button" className="lp-opt" onClick={() => choose(step.name, opt)}>
                  <span className="lp-opt__key">{KEYS[k]}</span>
                  {opt}
                </button>
              ))}
            </div>
            <div className="lp-wnav">
              {i > 0 ? (
                <button type="button" className="lp-back" onClick={() => setI(i - 1)}>
                  <ArrowLeft size={12} style={{ verticalAlign: "middle" }} /> Back
                </button>
              ) : <span />}
              <span />
            </div>
          </>
        )}
      </div>

      <p className="lp-reassure">Takes 30 seconds · Reviewed by hand · No card required</p>
    </div>
  );
}
