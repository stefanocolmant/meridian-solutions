"use client";

import { useEffect, useRef } from "react";

/** Subtle constellation canvas: drifting stars + a faint meridian arc.
 *  Cursor-parallax on desktop; renders a single static frame under
 *  reduced-motion or on small screens. Cheap (one rAF, ~90 points). */
export function Starfield({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 760px)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;
    let stars: { x: number; y: number; r: number; a: number; tw: number; vx: number; vy: number }[] = [];
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

    const rand = (() => { let s = 20260620; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; })();

    const build = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = small ? 46 : 92;
      stars = Array.from({ length: count }, () => ({
        x: rand() * w,
        y: rand() * h,
        r: rand() * 1.5 + 0.3,
        a: rand() * 0.5 + 0.2,
        tw: rand() * Math.PI * 2,
        vx: (rand() - 0.5) * 0.08,
        vy: (rand() - 0.5) * 0.08,
      }));
    };

    const drawArc = () => {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(204,100,55,0.10)";
      ctx.lineWidth = 1;
      // a wide meridian arc sweeping across the field
      ctx.ellipse(w * 0.5 + parallax.x * 0.5, h * 1.15, w * 0.62, h * 0.78, 0, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drawArc();
      for (const s of stars) {
        const tw = reduced ? 0 : Math.sin(s.tw) * 0.25;
        const alpha = Math.max(0, Math.min(1, s.a + tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(237,235,231,${alpha})`;
        ctx.arc(s.x + parallax.x, s.y + parallax.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    const tick = () => {
      for (const s of stars) {
        s.x += s.vx; s.y += s.vy; s.tw += 0.02;
        if (s.x < -2) s.x = w + 2; if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2; if (s.y > h + 2) s.y = -2;
      }
      parallax.x += (parallax.tx - parallax.x) * 0.06;
      parallax.y += (parallax.ty - parallax.y) * 0.06;
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      parallax.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
      parallax.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    };

    build();
    if (reduced || small) {
      draw();
    } else {
      raf = requestAnimationFrame(tick);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    const ro = new ResizeObserver(() => { build(); if (reduced || small) draw(); });
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
