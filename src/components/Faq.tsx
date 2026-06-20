"use client";

import { useState } from "react";
import { FAQ } from "@/content/data";

export function Faq({ items = FAQ, limit }: { items?: typeof FAQ; limit?: number }) {
  const list = limit ? items.slice(0, limit) : items;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq">
      {list.map((item, i) => (
        <div className="acc-item" key={item.q} data-open={open === i}>
          <button
            className="acc-head"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="acc-q">{item.q}</span>
            <span className="acc-icon" />
          </button>
          <div className="acc-body">
            <div>
              <p className="acc-answer pretty">{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
