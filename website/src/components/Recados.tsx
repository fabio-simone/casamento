"use client";

import { useEffect, useState } from "react";
import type { Recado } from "@/lib/types";
import { formatDateSP } from "@/lib/utils";

export function Recados() {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/recados");
      const data = await res.json();
      setRecados(data.recados ?? []);
    } catch {
      /* silencioso */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !mensagem.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/recados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, mensagem }),
      });
      if (!res.ok) throw new Error();
      setNome("");
      setMensagem("");
      setStatus("ok");
      await load();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={submit} className="card h-fit">
        <h3 className="font-display text-2xl font-bold text-urbano">
          Deixe um recado
        </h3>
        <p className="mt-1 text-sm text-urbano/60">
          Sem torcida proibida — exceto se for contra os dois ao mesmo tempo.
        </p>
        <div className="mt-4 space-y-3">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            maxLength={80}
            required
            className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
          />
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Sua mensagem para o casal..."
            rows={4}
            maxLength={500}
            required
            className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
          />
          <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
            {status === "sending" ? "Enviando..." : "Enviar recado"}
          </button>
          {status === "ok" && (
            <p className="text-sm font-medium text-oceano">Recado enviado! Obrigado 💙</p>
          )}
          {status === "error" && (
            <p className="text-sm font-medium text-red-600">
              Ops, deu ruim. Tenta de novo?
            </p>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {loading && <p className="text-urbano/50">Carregando recados...</p>}
        {!loading && recados.length === 0 && (
          <p className="text-urbano/50">
            Seja o primeiro a deixar um recado para o casal!
          </p>
        )}
        <div className="max-h-[480px] space-y-4 overflow-y-auto pr-1">
          {recados.map((r) => (
            <div key={r.id} className="card border-oceano/20 bg-oceano/5">
              <p className="text-urbano/90">{r.mensagem}</p>
              <p className="mt-3 text-sm font-semibold text-oceano">
                — {r.nome}{" "}
                <span className="font-normal text-urbano/40">
                  · {formatDateSP(r.created_at, { dateStyle: "short" })}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
