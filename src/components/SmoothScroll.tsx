"use client";

import { useEffect } from "react";
import { splitLines } from "@/lib/split";

/**
 * Meridian motion engine — Lenis smooth scroll + GSAP reveals.
 * Lenis lerp .1 / dur 1.2, masked line reveals, word-box text reveal,
 * scroll-reversing marquees, parallax.
 *
 *  [data-split]        → masked line reveal (staggered up)
 *  [data-reveal]       → fade + rise on enter (stagger children w/ .reveal)
 *  [data-text-reveal]  → per-word overlay box wipes off
 *  [data-marquee]      → seamless infinite loop, reverses with scroll direction
 *  [data-parallax]     → vertical parallax (data-parallax="0.15")
 */
export function SmoothScroll() {
  useEffect(() => {
    let killed = false;
    let cleanup = () => {};
    const reverts: Array<() => void> = [];

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

      // reveal the page (mirrors css-ready / has-loaded gate)
      root.classList.add("has-loaded");
      if (reduced) root.classList.add("has-reduced-motion");

      // ---------- Lenis ----------
      const lenis = new Lenis({ lerp: 0.1, duration: 1.2, anchors: true, autoRaf: false });
      (window as unknown as { lenis: unknown }).lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      if (reduced) lenis.stop();

      // ---------- header scrolled state ----------
      const onScroll = () => {
        if (window.scrollY > 8) root.classList.add("has-scrolled");
        else root.classList.remove("has-scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      await (document.fonts ? document.fonts.ready : Promise.resolve());
      if (killed) return;

      // ---------- masked line reveals ----------
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        if (el.dataset.splitDone === "1") return;
        el.dataset.splitDone = "1";
        const s = splitLines(el, { mask: true });
        reverts.push(s.revert);
        el.style.opacity = "1";
        if (reduced) {
          gsap.set(s.lines, { y: 0 });
          return;
        }
        gsap.set(s.lines, { yPercent: 120 });
        const onLoad = el.hasAttribute("data-split-load");
        const tl = gsap.to(s.lines, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          delay: onLoad ? 0.35 : 0,
          paused: !onLoad,
        });
        if (!onLoad) {
          ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tl.play() });
        }
      });

      // ---------- fade + rise reveals ----------
      if (!reduced) {
        root.classList.add("reveal-on");
        const animates = (el: HTMLElement) =>
          !el.hasAttribute("data-split") && !el.hasAttribute("data-text-reveal");
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((trigger) => {
          const inner = Array.from(
            trigger.querySelectorAll<HTMLElement>(".reveal"),
          ).filter(animates);
          const selfIsTarget = trigger.matches(".reveal") && animates(trigger);
          const targets = selfIsTarget
            ? [trigger, ...inner]
            : inner.length
              ? inner
              : [trigger];
          gsap.set(targets, { opacity: 0, y: 24 });
          ScrollTrigger.create({
            trigger,
            start: "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(targets, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: Number(trigger.dataset.reveal) || 0.08,
              }),
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
                  ov.style.cssText =
                    "position:absolute;inset:0;background:currentColor;transform-origin:bottom;transform:scaleY(1);pointer-events:none;z-index:1;";
                  word.appendChild(ov);
                  overlays.push(ov);
                  frag.appendChild(word);
                });
                node.replaceChild(frag, child);
              } else if (
                child.nodeType === Node.ELEMENT_NODE &&
                !(child as HTMLElement).classList.contains("text-reveal-word")
              ) walk(child);
            });
          };
          walk(el);
          return overlays;
        };
        document.querySelectorAll<HTMLElement>("[data-text-reveal]").forEach((el) => {
          if (el.dataset.trDone === "1") return;
          el.dataset.trDone = "1";
          const overlays = wrapWords(el);
          if (!overlays.length) return;
          gsap.set(overlays, { scaleY: 1 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 82%",
            once: true,
            onEnter: () =>
              gsap.to(overlays, {
                scaleY: 0,
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.06,
                onComplete: () => overlays.forEach((o) => o.remove()),
              }),
          });
        });
      }

      // ---------- marquees ----------
      document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((marquee) => {
        const track = marquee.querySelector<HTMLElement>(".marquee_track");
        if (!track || reduced || marquee.dataset.mqInit) return;
        marquee.dataset.mqInit = "1";
        const dir = marquee.dataset.marqueeDir === "right" ? 1 : -1;
        const baseSpeed = Number(marquee.dataset.marqueeSpeed) || 40; // px/s
        const original = track.cloneNode(true) as HTMLElement;
        // duplicate until track is at least 2× viewport for a seamless loop
        let guard = 0;
        while (track.scrollWidth < window.innerWidth * 2 && guard < 8) {
          track.appendChild(original.cloneNode(true)); guard++;
        }
        const half = track.scrollWidth / 2;
        const dur = half / baseSpeed;
        const loop = gsap.to(track, {
          x: dir === -1 ? -half : half,
          duration: dur,
          ease: "none",
          repeat: -1,
          modifiers: { x: (x: string) => `${(parseFloat(x) % half)}px` },
        });
        gsap.set(track, { x: dir === -1 ? 0 : -half });
        // marquee reverses with scroll direction (down = forward, up = reverse)
        ScrollTrigger.create({
          trigger: marquee,
          start: "top bottom",
          end: "bottom top",
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
          gsap.fromTo(
            el,
            { yPercent: -amount * 100 },
            {
              yPercent: amount * 100,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }

      // ---------- card clip-path wipe reveal ----------
      const wipeOK = !reduced && window.matchMedia("(min-width: 768px)").matches;
      document.querySelectorAll<HTMLElement>("[data-cards]").forEach((grid) => {
        if (grid.dataset.cardsInit === "1") return;
        grid.dataset.cardsInit = "1";
        const cards = Array.from(grid.children) as HTMLElement[];
        if (!cards.length || !wipeOK) return;
        gsap.set(cards, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
        ScrollTrigger.create({
          trigger: grid,
          start: "top 82%",
          once: true,
          onEnter: () =>
            gsap.to(cards, {
              clipPath: "inset(0 0% 0 0)",
              duration: 1,
              ease: "expo.out",
              stagger: 0.15,
              onComplete: () => gsap.set(cards, { clipPath: "none" }),
            }),
        });
      });

      // ---------- directional list-hover (overlay slides from nearest edge) ----------
      const hoverable =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        window.matchMedia("(min-width: 1025px)").matches;
      if (hoverable) {
        const edge: Record<string, string> = {
          top: "translateY(-101%)",
          bottom: "translateY(101%)",
          left: "translateX(-101%)",
          right: "translateX(101%)",
        };
        const nearest = (ev: MouseEvent, el: HTMLElement): string => {
          const r = el.getBoundingClientRect();
          const cx = ev.clientX - r.left;
          const cy = ev.clientY - r.top;
          const d: Record<string, number> = { top: cy, right: r.width - cx, bottom: r.height - cy, left: cx };
          return Object.entries(d).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
        };
        // pseudo-element fill driven by --lh-tf (no DOM mutation → layout-safe)
        document.querySelectorAll<HTMLElement>("[data-list-item]").forEach((item) => {
          if (item.dataset.lhInit === "1") return;
          item.dataset.lhInit = "1";
          const onEnter = (ev: MouseEvent) => {
            const s = nearest(ev, item);
            item.classList.add("lh-instant");
            item.style.setProperty("--lh-tf", edge[s]); // jump to the entering edge
            void item.offsetHeight; // reflow so the start state sticks
            item.classList.remove("lh-instant");
            item.style.setProperty("--lh-tf", "translate(0%, 0%)"); // slide in
            item.setAttribute("data-lh", "in");
          };
          const onLeave = (ev: MouseEvent) => {
            const s = nearest(ev, item);
            item.style.setProperty("--lh-tf", edge[s]); // slide out toward nearest edge
            item.setAttribute("data-lh", "out");
          };
          item.addEventListener("mouseenter", onEnter);
          item.addEventListener("mouseleave", onLeave);
          reverts.push(() => {
            item.removeEventListener("mouseenter", onEnter);
            item.removeEventListener("mouseleave", onLeave);
          });
        });
      }

      ScrollTrigger.refresh();

      cleanup = () => {
        gsap.ticker.remove(ticker);
        window.removeEventListener("scroll", onScroll);
        ScrollTrigger.getAll().forEach((s: { kill: () => void }) => s.kill());
        lenis.destroy();
        reverts.forEach((r) => { try { r(); } catch {} });
        root.classList.remove("has-scrolled");
      };
    })();

    return () => { killed = true; cleanup(); };
  }, []);

  return null;
}
