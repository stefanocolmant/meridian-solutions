"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const SHOTS = Array.from({ length: 18 }, (_, i) => `/trades/trade-${String(i + 1).padStart(2, "0")}.jpg`);

export function ProofGallery() {
  const [open, setOpen] = useState<string | null>(null);
  // duplicate the set so the CSS marquee loops seamlessly
  const loop = [...SHOTS, ...SHOTS];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="lp-marquee">
        <div className="lp-marquee__track">
          {loop.map((src, i) => (
            <button key={i} type="button" className="lp-shot" onClick={() => setOpen(src)} aria-label="View trade">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Validated trade" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <button className="lightbox__close" aria-label="Close" onClick={() => setOpen(null)}><X size={18} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="Validated trade" onClick={(e) => e.stopPropagation()} />
          <p className="lightbox__cap">Hypothetical · educational · not a live account</p>
        </div>
      )}
    </>
  );
}
