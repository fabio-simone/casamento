"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Recado } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RecadosCarousel() {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recados")
      .then((r) => r.json())
      .then((d) => setRecados(d.recados ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(
    () => setI((v) => (recados.length ? (v + 1) % recados.length : 0)),
    [recados.length]
  );
  const prev = () =>
    setI((v) => (recados.length ? (v - 1 + recados.length) % recados.length : 0));

  // auto-avança a cada 5s
  useEffect(() => {
    if (recados.length < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [recados.length, next]);

  if (loading) {
    return <p className="text-offwhite/50">Carregando recados...</p>;
  }

  if (recados.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-white/25 p-8 text-offwhite/60">
        Ainda não há recados. Os primeiros chegam junto com os presentes 💙
      </div>
    );
  }

  const r = recados[i];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative min-h-[180px] rounded-3xl border border-white/15 bg-white/[0.06] p-8 backdrop-blur-sm sm:p-10">
        <Quote className="mx-auto mb-4 h-8 w-8 text-laranja/70" strokeWidth={1.5} />
        <p
          key={r.id}
          className="animate-fade-up font-display text-xl italic leading-relaxed text-offwhite/90 sm:text-2xl"
        >
          “{r.mensagem}”
        </p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.15em] text-laranja">
          {r.nome}
        </p>
      </div>

      {recados.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-offwhite transition hover:bg-offwhite hover:text-oceanoDark"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-1.5">
            {recados.slice(0, 8).map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  idx === i % Math.min(recados.length, 8) ? "bg-laranja" : "bg-white/30"
                )}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Próximo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-offwhite transition hover:bg-offwhite hover:text-oceanoDark"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
