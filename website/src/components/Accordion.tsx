"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface QA {
  pergunta: string;
  resposta: string;
}

export function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-medium text-offwhite">
                {item.pergunta}
              </span>
              <span
                className={cn(
                  "shrink-0 text-2xl text-laranja transition-transform",
                  isOpen && "rotate-45"
                )}
              >
                +
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-offwhite/75">{item.resposta}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
