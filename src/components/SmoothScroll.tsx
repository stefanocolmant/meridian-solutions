"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { splitLines } from "@/lib/split";

/**
 * Meridian motion engine — Lenis smooth scroll + GSAP reveals.
 * The Lenis instance + global listeners mount ONCE; all DOM-dependent motion
 * (reveals, splits, text-reveal, marquees, parallax, card-wipes, hover) is
 * re-run on every route change so client-side navigation never lands on a page
 * with hidden/unanimated sections.
 *
 *  [data-split]        → masked line reveal
 *  [data-reveal]       → fade + rise on enter
 *  [data-text-reveal]  → per-word overlay box wipes off
 *  [data-marquee]      → seamless loop, reverses with scroll direction
 *  [data-parallax]     → vertical parallax
 *  [data-cards]        → clip-path wipe reveal of a card grid
 *  [data-list-item]    → directional hover fill
 */
export function SmoothScroll() {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eng = useRef<any>(null);
  const pageCleanup = useRef<() => void>(() => {});

  // ---- mount the engine once ----
  useEffect(() => {
    let killed = false;
    (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;
      const gsap = gsapMod.gsap ?? gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const root = document.documentElement;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.classList.add("has-loaded");
      if (reduced) root.classList.add("has-reduced-motion");
      else root.classList.add("reveal-on");

      const lenis = new Lenis({ lerp: 0.1, duration: 1.2, anchors: true, autoRaf: false });
      (window as unknown as { lenis: unknown }).lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      if (reduced) lenis.stop();

      const onScroll = () => {
        if (window.scrollY > 8) root.classList.add("has-scrolled");
        else root.classList.remove("has-scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      eng.current = {
        gsap,
        ScrollTrigger,
        lenis,
        reduced,
        destroy: () => {
          gsap.ticker.remove(ticker);
          window.removeEventListener("scroll", onScroll);
          pageCleanup.current();
          lenis.destroy();
          root.classList.remove("has-scrolled");
        },
      };

      await (document.fonts ? document.fonts.ready : Promise.resolve());
      if (killed) return;
      runPage(); // initial page
    })();

    return () => {
      killed = true;
      eng.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- re-run page motion on every route change ----
  useEffect(() => {
    if (eng.current) runPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function runPage() {
    const e = eng.current;
    if (!e) return;
    pageCleanup.current(); // tear down the previous page's motion

    const { gsap, ScrollTrigger, reduced, lenis } = e;
    const reverts: Array<() => void> = [];
    const loops: Array<{ kill: () => void }> = [];
    const onTop = pathname !== undefined;
    if (onTop) {
      try { lenis.scrollTo(0, { immediate: true }); } catch {}
      window.scrollTo(0, 0);
    }

    // ---------- masked line reveals ----------
    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if (el.dataset.splitDone === "1") return;
      el.dataset.splitDone = "1";
      const s = splitLines(el, { mask: true });
      reverts.push(() => { s.revert(); delete el.dataset.splitDone; });
      el.style.opacity = "1";
      if (reduced) { gsap.set(s.lines, { y: 0 }); return; }
      gsap.set(s.lines, { yPercent: 120 });
      const onLoad = el.hasAttribute("data-split-load");
      const tl = gsap.to(s.lines, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, delay: onLoad ? 0.35 : 0, paused: !onLoad });
      loops.push(tl);
      if (!onLoad) ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tl.play() });
    });

    // ---------- fade + rise reveals ----------
    if (!reduced) {
      const animates = (el: HTMLElement) => !el.hasAttribute("data-split") && !el.hasAttribute("data-text-reveal");
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((trigger) => {
        const inner = Array.from(trigger.querySelectorAll<HTMLElement>(".reveal")).filter(animates);
        const selfIsTarget = trigger.matches(".reveal") && animates(trigger);
        const targets = selfIsTarget ? [trigger, ...inner] : inner.length ? inner : [trigger];
        gsap.set(targets, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger, start: "top 85%", once: true,
          onEnter: () => gsap.to(targets, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: Number(trigger.dataset.reveal) || 0.08 }),
        });
      });
    }

    // ---------- text-reveal word boxes ----------
    if (!reduced) {
      const wrapWords = (el: HTMLElement): HTMLElement[] => {
        const overlays: HTMLElement[] = [];
        const walk = (node: Node) => {
          Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              const text = child.textContent ?? "";
              if (!text.trim()) return;
              const frag = document.createDocumentFragment();
              text.split(/(\s+)/).forEach((part) => {
                if (part === "") return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                const word = document.createElement("span");
                word.className = "text-reveal-word";
                word.style.cssText = "position:relative;overflow:hidden;display:inline-block;";
                word.textContent = part;
                const ov = document.createElement("div");
                ov.style.cssText = "position:absolute;inset:0;background:currentColor;transform-origin:bottom;transform:scaleY(1);pointer-events:none;z-index:1;";
                word.appendChild(ov);
                overlays.push(ov);
                frag.appendChild(word);
              });
              node.replaceChild(frag, child);
            } else if (child.nodeType === Node.ELEMENT_NODE && !(child as HTMLElement).classList.contains("text-reveal-word")) walk(child);
          });
        };
        walk(el);
        return overlays;
      };
      document.querySelectorAll<HTMLElement>("[data-text-reveal]").forEach((el) => {
        if (el.dataset.trDone === "1") return;
        el.dataset.trDone = "1";
        const original = el.innerHTML;
        reverts.push(() => { el.innerHTML = original; delete el.dataset.trDone; });
        const overlays = wrapWords(el);
        if (!overlays.length) return;
        gsap.set(overlays, { scaleY: 1 });
        ScrollTrigger.create({
          trigger: el, start: "top 82%", once: true,
          onEnter: () => gsap.to(overlays, { scaleY: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, onComplete: () => overlays.forEach((o) => o.remove()) }),
        });
      });
    }

    // ---------- marquees ----------
    document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((marquee) => {
      const track = marquee.querySelector<HTMLElement>(".marquee_track");
      if (!track || reduced || marquee.dataset.mqInit) return;
      marquee.dataset.mqInit = "1";
      const dir = marquee.dataset.marqueeDir === "right" ? 1 : -1;
      const baseSpeed = Number(marquee.dataset.marqueeSpeed) || 40;
      const original = track.cloneNode(true) as HTMLElement;
      let guard = 0;
      while (track.scrollWidth < window.innerWidth * 2 && guard < 8) { track.appendChild(original.cloneNode(true)); guard++; }
      const half = track.scrollWidth / 2;
      const loop = gsap.to(track, { x: dir === -1 ? -half : half, duration: half / baseSpeed, ease: "none", repeat: -1, modifiers: { x: (x: string) => `${parseFloat(x) % half}px` } });
      loops.push(loop);
      gsap.set(track, { x: dir === -1 ? 0 : -half });
      reverts.push(() => { delete marquee.dataset.mqInit; });
      ScrollTrigger.create({
        trigger: marquee, start: "top bottom", end: "bottom top",
        onUpdate: (self: { direction: number }) => {
          loop.timeScale(self.direction === 1 ? 1 : -1);
          marquee.setAttribute("data-marquee-status", self.direction === 1 ? "normal" : "inverted");
        },
      });
    });

    // ---------- parallax ----------
    if (!reduced) {
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax) || 0.15;
        const tw = gsap.fromTo(el, { yPercent: -amount * 100 }, { yPercent: amount * 100, ease: "none", scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true } });
        loops.push(tw);
      });
    }

    // ---------- card clip-path wipe reveal ----------
    const wipeOK = !reduced && window.matchMedia("(min-width: 768px)").matches;
    document.querySelectorAll<HTMLElement>("[data-cards]").forEach((grid) => {
      if (grid.dataset.cardsInit === "1") return;
      grid.dataset.cardsInit = "1";
      reverts.push(() => { delete grid.dataset.cardsInit; });
      const cards = Array.from(grid.children) as HTMLElement[];
      if (!cards.length || !wipeOK) return;
      gsap.set(cards, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      ScrollTrigger.create({
        trigger: grid, start: "top 82%", once: true,
        onEnter: () => gsap.to(cards, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "expo.out", stagger: 0.15, onComplete: () => gsap.set(cards, { clipPath: "none" }) }),
      });
    });

    // ---------- directional list-hover ----------
    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches && window.matchMedia("(min-width: 1025px)").matches;
    if (hoverable) {
      const edge: Record<string, string> = { top: "translateY(-101%)", bottom: "translateY(101%)", left: "translateX(-101%)", right: "translateX(101%)" };
      const nearest = (ev: MouseEvent, el: HTMLElement): string => {
        const r = el.getBoundingClientRect();
        const cx = ev.clientX - r.left, cy = ev.clientY - r.top;
        const d: Record<string, number> = { top: cy, right: r.width - cx, bottom: r.height - cy, left: cx };
        return Object.entries(d).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
      };
      document.querySelectorAll<HTMLElement>("[data-list-item]").forEach((item) => {
        if (item.dataset.lhInit === "1") return;
        item.dataset.lhInit = "1";
        const onEnter = (ev: MouseEvent) => {
          const s = nearest(ev, item);
          item.classList.add("lh-instant");
          item.style.setProperty("--lh-tf", edge[s]);
          void item.offsetHeight;
          item.classList.remove("lh-instant");
          item.style.setProperty("--lh-tf", "translate(0%, 0%)");
          item.setAttribute("data-lh", "in");
        };
        const onLeave = (ev: MouseEvent) => { item.style.setProperty("--lh-tf", edge[nearest(ev, item)]); item.setAttribute("data-lh", "out"); };
        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        reverts.push(() => { item.removeEventListener("mouseenter", onEnter); item.removeEventListener("mouseleave", onLeave); delete item.dataset.lhInit; });
      });
    }

    ScrollTrigger.refresh();

    pageCleanup.current = () => {
      ScrollTrigger.getAll().forEach((s: { kill: () => void }) => s.kill());
      loops.forEach((l) => { try { l.kill(); } catch {} });
      reverts.forEach((r) => { try { r(); } catch {} });
    };
  }

  return null;
}
