"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kafamento_enquete_voto";

export function Enquete({
  pergunta,
  opcoes,
}: {
  pergunta: string;
  opcoes: string[];
}) {
  const [escolha, setEscolha] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [jaVotou, setJaVotou] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function carregar() {
    try {
      const res = await fetch("/api/enquete");
      const data = await res.json();
      setCounts(data.counts ?? {});
      setTotal(data.total ?? 0);
    } catch {
      /* silencioso */
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
      setJaVotou(true);
      setMostrarResultado(true);
    }
    carregar();
  }, []);

  async function votar() {
    if (!escolha) return;
    setEnviando(true);
    try {
      const res = await fetch("/api/enquete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opcao: escolha }),
      });
      if (!res.ok) throw new Error();
      localStorage.setItem(STORAGE_KEY, escolha);
      setJaVotou(true);
      setMostrarResultado(true);
      await carregar();
    } catch {
      /* ignora */
    } finally {
      setEnviando(false);
    }
  }

  const votoSalvo =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-3">
        {opcoes.map((opcao) => {
          const n = counts[opcao] ?? 0;
          const pct = total > 0 ? Math.round((n / total) * 100) : 0;
          const selecionada = escolha === opcao;
          const foiMeuVoto = votoSalvo === opcao;

          if (mostrarResultado) {
            return (
              <div
                key={opcao}
                className="relative overflow-hidden rounded-2xl border border-areia bg-white px-4 py-3"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-oceano/15 transition-all"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-urbano/90">
                    {foiMeuVoto && <Check className="h-4 w-4 text-oceano" strokeWidth={2.5} />}
                    {opcao}
                  </span>
                  <span className="text-sm font-semibold text-oceano">{pct}%</span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={opcao}
              type="button"
              onClick={() => setEscolha(opcao)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm transition",
                selecionada
                  ? "border-oceano ring-2 ring-oceano/30"
                  : "border-areia hover:border-oceano/50"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  selecionada ? "border-oceano bg-oceano" : "border-areia"
                )}
              >
                {selecionada && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
              <span className="text-urbano/90">{opcao}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        {!mostrarResultado && (
          <button
            onClick={votar}
            disabled={!escolha || enviando}
            className="btn-primary disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar voto"}
          </button>
        )}
        {!jaVotou && (
          <button
            onClick={() => setMostrarResultado((v) => !v)}
            className="text-sm font-semibold uppercase tracking-wide text-oceano hover:underline"
          >
            {mostrarResultado ? "Voltar a votar" : "Ver resultado"}
          </button>
        )}
      </div>

      {mostrarResultado && (
        <p className="mt-4 text-center text-xs text-urbano/50">
          {total} {total === 1 ? "voto" : "votos"} até agora
          {jaVotou && " · obrigado por votar!"}
        </p>
      )}
    </div>
  );
}
