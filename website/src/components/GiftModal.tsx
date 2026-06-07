"use client";

import { useEffect, useState } from "react";
import type { GiftWithQuotas } from "@/lib/types";
import { formatBRL } from "@/lib/utils";

export function GiftModal({
  gift,
  pagas,
  valorCota,
  onClose,
}: {
  gift: GiftWithQuotas;
  pagas: number;
  valorCota: number;
  onClose: () => void;
}) {
  const disponiveis = gift.num_cotas - pagas;
  const [quantidade, setQuantidade] = useState(1);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function presentear(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_id: gift.id,
          quantidade,
          pagador_nome: nome,
          pagador_email: email,
          mensagem,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error ?? "Não foi possível iniciar o pagamento.");
      }
      // Redireciona para o Checkout Pro do Mercado Pago.
      window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-urbano/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-offwhite p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-urbano">{gift.nome}</h3>
            {gift.descricao && (
              <p className="mt-1 text-sm text-urbano/60">{gift.descricao}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-2xl leading-none text-urbano/50 hover:text-urbano"
          >
            ×
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-oceano/5 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-urbano/70">Valor por cota</span>
            <span className="font-semibold text-oceano">{formatBRL(valorCota)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-urbano/70">Cotas disponíveis</span>
            <span className="font-semibold">{disponiveis}</span>
          </div>
        </div>

        <form onSubmit={presentear} className="space-y-3">
          {gift.num_cotas > 1 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-urbano">
                Quantas cotas?
              </label>
              <select
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
              >
                {Array.from({ length: disponiveis }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} cota{n > 1 ? "s" : ""} — {formatBRL(valorCota * n)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-urbano">Seu nome</label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
              placeholder="Para o casal saber quem presenteou 💙"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-urbano">Seu e-mail</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-urbano">
              Mensagem para o casal <span className="text-urbano/40">(opcional)</span>
            </label>
            <textarea
              rows={3}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              maxLength={500}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
              placeholder="Deixe um recado carinhoso — ele aparece no mural do site 💙"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Redirecionando..." : `Pagar ${formatBRL(valorCota * quantidade)}`}
          </button>
          <p className="text-center text-xs text-urbano/50">
            Pagamento seguro via Mercado Pago (cartão, Pix ou boleto).
          </p>
        </form>
      </div>
    </div>
  );
}
