"use client";

import { useState } from "react";
import { Loader2, Unlock } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Pago {
  numero: number;
  comprador_nome: string | null;
  comprador_whatsapp: string | null;
  valor_pago: number | null;
}

export function RifaPagos({ pagos }: { pagos: Pago[] }) {
  const [liberados, setLiberados] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<number | null>(null);

  async function liberar(numero: number, nome: string | null) {
    if (!confirm(`Liberar número ${numero} (${nome ?? "sem nome"}) de volta ao estoque? Esta ação é irreversível.`)) return;
    setLoading(numero);
    try {
      const r = await fetch("/api/rifa/liberar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeros: [numero] }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Erro");
      setLiberados((s) => new Set([...s, numero]));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao liberar.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 space-y-2">
      {pagos.map((r) => {
        const lib = liberados.has(r.numero);
        return (
          <div key={r.numero} className={`card flex items-center justify-between gap-4 ${lib ? "opacity-40" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oceano/10 font-bold text-oceano">
                {r.numero}
              </span>
              <div>
                <p className="font-medium text-urbano">{r.comprador_nome ?? "—"}</p>
                <p className="text-sm text-urbano/50">{r.comprador_whatsapp ?? ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-oceano">
                {r.valor_pago ? formatBRL(Number(r.valor_pago)) : "—"}
              </span>
              {!lib && (
                <button
                  onClick={() => liberar(r.numero, r.comprador_nome)}
                  disabled={loading === r.numero}
                  title="Liberar número"
                  className="flex items-center gap-1 rounded-lg border border-urbano/20 px-2 py-1.5 text-xs text-urbano/40 transition hover:border-red-300 hover:text-red-600 disabled:opacity-60"
                >
                  {loading === r.numero ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlock className="h-3.5 w-3.5" />}
                </button>
              )}
              {lib && <span className="text-xs text-urbano/40">Liberado</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
