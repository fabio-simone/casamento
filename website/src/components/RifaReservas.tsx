"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Reserva {
  numero: number;
  comprador_nome: string | null;
  comprador_whatsapp: string | null;
  valor_pago: number | null;
  external_reference: string | null;
  reservado_ate: string | null;
}

export function RifaReservas({ reservas }: { reservas: Reserva[] }) {
  const [confirmados, setConfirmados] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});

  async function confirmar(ref: string) {
    setLoading(ref);
    setErros((e) => ({ ...e, [ref]: "" }));
    try {
      const r = await fetch("/api/rifa/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ external_reference: ref }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Erro");
      setConfirmados((s) => new Set([...s, ref]));
    } catch (e) {
      setErros((prev) => ({ ...prev, [ref]: e instanceof Error ? e.message : "Erro" }));
    } finally {
      setLoading(null);
    }
  }

  // Group by external_reference (one ref can cover multiple numbers)
  const grupos = reservas.reduce<Record<string, Reserva[]>>((acc, r) => {
    const ref = r.external_reference ?? r.numero.toString();
    if (!acc[ref]) acc[ref] = [];
    acc[ref].push(r);
    return acc;
  }, {});

  return (
    <div className="mt-4 space-y-3">
      {Object.entries(grupos).map(([ref, itens]) => {
        const first = itens[0];
        const nums = itens.map((i) => i.numero).sort((a, b) => a - b);
        const total = itens.reduce((acc, i) => acc + (Number(i.valor_pago) || 0), 0);
        const confirmado = confirmados.has(ref);
        const expira = first.reservado_ate ? new Date(first.reservado_ate) : null;
        const expirado = expira ? expira < new Date() : false;

        return (
          <div
            key={ref}
            className={`card flex items-center justify-between gap-4 ${confirmado ? "opacity-50" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-wrap gap-1">
                {nums.map((n) => (
                  <span key={n} className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                    {n}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-medium text-urbano">{first.comprador_nome ?? "—"}</p>
                <p className="text-sm text-urbano/50">{first.comprador_whatsapp ?? ""}</p>
                {expira && !expirado && (
                  <p className="text-xs text-amber-600">
                    Expira às {expira.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
                {expirado && <p className="text-xs text-red-500">Reserva expirada</p>}
                {erros[ref] && <p className="text-xs text-red-500">{erros[ref]}</p>}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="font-semibold text-oceano">{formatBRL(total)}</span>
              {!confirmado ? (
                <button
                  onClick={() => confirmar(ref)}
                  disabled={loading === ref}
                  className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  {loading === ref ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Confirmar PIX
                </button>
              ) : (
                <span className="text-xs font-semibold text-green-600">Confirmado!</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
