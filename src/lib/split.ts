// Minimal line/char splitter (GSAP SplitText is licensed — this is a clean
// re-implementation). Produces masked lines (overflow-clip wrapper + a
// transform-able `.line`) and optional per-letter `.char` spans.

export interface SplitResult {
  lines: HTMLElement[];
  chars: HTMLElement[];
  revert: () => void;
}

function measureLines(el: HTMLElement): string[][] {
  const text = el.textContent ?? "";
  const tokens = text.split(/(\s+)/).filter((t) => t !== "");
  el.textContent = "";
  const spans: HTMLElement[] = [];
  tokens.forEach((tok) => {
    if (tok.trim() === "") {
      el.appendChild(document.createTextNode(tok));
      return;
    }
    const s = document.createElement("span");
    s.style.display = "inline-block";
    s.textContent = tok;
    el.appendChild(s);
    el.appendChild(document.createTextNode(" "));
    spans.push(s);
  });
  const rows = new Map<number, string[]>();
  spans.forEach((s) => {
    const top = Math.round(s.offsetTop);
    if (!rows.has(top)) rows.set(top, []);
    rows.get(top)!.push(s.textContent ?? "");
  });
  return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, w]) => w);
}

export function splitLines(
  el: HTMLElement,
  opts: { mask?: boolean; chars?: boolean } = {},
): SplitResult {
  if (el.dataset.splitOriginal != null) {
    el.innerHTML = el.dataset.splitOriginal;
  } else {
    el.dataset.splitOriginal = el.innerHTML;
  }
  const original = el.dataset.splitOriginal;
  const rows = measureLines(el);

  el.innerHTML = "";
  const lines: HTMLElement[] = [];
  const chars: HTMLElement[] = [];

  rows.forEach((wordTexts) => {
    const lineText = wordTexts.join(" ");
    const mask = document.createElement("span");
    mask.className = "line-mask";
    if (opts.mask) {
      mask.style.overflow = "clip";
      mask.style.overflowClipMargin = "0.4em";
    }
    const inner = document.createElement("span");
    inner.className = "line";
    inner.style.willChange = "transform";

    if (opts.chars) {
      for (const ch of lineText) {
        if (ch === " ") {
          inner.appendChild(document.createTextNode(" "));
          continue;
        }
        const c = document.createElement("span");
        c.className = "char";
        c.style.display = "inline-block";
        c.textContent = ch;
        inner.appendChild(c);
        chars.push(c);
      }
    } else {
      inner.textContent = lineText;
    }
    mask.appendChild(inner);
    el.appendChild(mask);
    lines.push(inner);
  });

  return {
    lines,
    chars,
    revert: () => {
      el.innerHTML = original;
      delete el.dataset.splitOriginal;
    },
  };
}
