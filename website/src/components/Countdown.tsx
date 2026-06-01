"use client";

import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/constants";

function diff(target: number) {
  const now = Date.now();
  const d = Math.max(0, target - now);
  return {
    dias: Math.floor(d / 86400000),
    horas: Math.floor((d / 3600000) % 24),
    min: Math.floor((d / 60000) % 60),
    seg: Math.floor((d / 1000) % 60),
    acabou: d === 0,
  };
}

const labels: Record<string, string> = {
  dias: "dias",
  horas: "horas",
  min: "min",
  seg: "seg",
};

export function Countdown() {
  const target = new Date(WEDDING.dataISO).getTime();
  const [t, setT] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.acabou) {
    return (
      <p className="font-display text-2xl text-oceano">
        🎉 Hoje é o grande dia! Rio e SP finalmente se uniram.
      </p>
    );
  }

  const items: [string, number][] = [
    ["dias", t.dias],
    ["horas", t.horas],
    ["min", t.min],
    ["seg", t.seg],
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {items.map(([key, value]) => (
        <div
          key={key}
          className="flex min-w-[64px] flex-col items-center rounded-2xl border border-areia bg-white/80 px-3 py-3 shadow-sm backdrop-blur sm:min-w-[88px] sm:px-5 sm:py-4"
        >
          <span
            // suppressHydrationWarning: valor calculado por tempo difere no SSR
            suppressHydrationWarning
            className="font-display text-3xl font-bold tabular-nums text-oceano sm:text-5xl"
          >
            {mounted ? String(value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-urbano/60 sm:text-xs">
            {labels[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
