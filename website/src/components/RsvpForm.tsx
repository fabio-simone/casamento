"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTextos } from "@/lib/textos-context";
import {
  FAIXA_LABEL,
  MAX_ACOMPANHANTES,
  type Acompanhante,
  type FaixaIdade,
} from "@/lib/types";

interface FormState {
  nome: string;
  email: string;
  telefone: string;
  acompanhantes: Acompanhante[];
}

const initial: FormState = {
  nome: "",
  email: "",
  telefone: "",
  acompanhantes: [],
};

export function RsvpForm() {
  const t = useTextos();
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [limiteMsg, setLimiteMsg] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Ajusta a quantidade de acompanhantes (e os campos), limitando ao máximo.
  function setQuantidade(valor: number) {
    let n = Number.isNaN(valor) || valor < 0 ? 0 : valor;
    if (n > MAX_ACOMPANHANTES) {
      setLimiteMsg(true);
      n = MAX_ACOMPANHANTES;
    } else {
      setLimiteMsg(false);
    }
    setForm((f) => {
      const atual = f.acompanhantes;
      let lista: Acompanhante[];
      if (n <= atual.length) {
        lista = atual.slice(0, n);
      } else {
        lista = [...atual];
        while (lista.length < n) lista.push({ nome: "", faixa: "8mais" });
      }
      return { ...f, acompanhantes: lista };
    });
  }

  function setAcomp(i: number, patch: Partial<Acompanhante>) {
    setForm((f) => ({
      ...f,
      acompanhantes: f.acompanhantes.map((a, idx) =>
        idx === i ? { ...a, ...patch } : a
      ),
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          acompanhantes: form.acompanhantes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao confirmar.");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card mx-auto max-w-lg text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-oceano" strokeWidth={1.5} />
        <h2 className="mt-4 font-display text-2xl font-bold text-oceano">
          {t.rsvp_sucesso_titulo}
        </h2>
        <p className="mt-2 text-urbano/70">
          {t.rsvp_sucesso_texto
            .split("{nome}").join(form.nome.split(" ")[0])
            .split("{email}").join(form.email)}
        </p>
        <button
          onClick={() => {
            setForm(initial);
            setLimiteMsg(false);
            setStatus("idle");
          }}
          className="btn-secondary mt-6"
        >
          Confirmar outra pessoa
        </button>
      </div>
    );
  }

  const qtd = form.acompanhantes.length;

  return (
    <form onSubmit={submit} className="card mx-auto max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-urbano">Nome completo *</label>
        <input
          required
          value={form.nome}
          onChange={(e) => update("nome", e.target.value)}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
          placeholder={t.rsvp_ph_nome}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-urbano">E-mail *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            placeholder={t.rsvp_ph_email}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-urbano">Telefone</label>
          <input
            value={form.telefone}
            onChange={(e) => update("telefone", e.target.value)}
            className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            placeholder={t.rsvp_ph_telefone}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-urbano">
          Número de acompanhantes{" "}
          <span className="text-urbano/40">(máx. {MAX_ACOMPANHANTES})</span>
        </label>
        <input
          type="number"
          min={0}
          max={MAX_ACOMPANHANTES}
          value={qtd}
          onChange={(e) => setQuantidade(parseInt(e.target.value, 10))}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
        />
        {limiteMsg && (
          <p className="mt-1 text-xs font-medium text-red-600">
            Limite máximo de {MAX_ACOMPANHANTES} acompanhantes por convite atingido.
          </p>
        )}
      </div>

      {form.acompanhantes.map((a, i) => (
        <div key={i} className="rounded-xl border border-areia bg-offwhite p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-laranja">
            Acompanhante {i + 1}
          </p>
          <input
            required
            value={a.nome}
            onChange={(e) => setAcomp(i, { nome: e.target.value })}
            className="w-full rounded-xl border border-areia bg-white px-4 py-2.5 text-sm outline-none focus:border-oceano"
            placeholder="Nome do acompanhante"
          />
          <select
            value={a.faixa}
            onChange={(e) => setAcomp(i, { faixa: e.target.value as FaixaIdade })}
            className="mt-2 w-full rounded-xl border border-areia bg-white px-4 py-2.5 text-sm outline-none focus:border-oceano"
          >
            {(Object.keys(FAIXA_LABEL) as FaixaIdade[]).map((f) => (
              <option key={f} value={f}>
                {FAIXA_LABEL[f]}
              </option>
            ))}
          </select>
        </div>
      ))}

      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error || "Algo deu errado. Tente novamente."}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
        {status === "sending" ? "Confirmando..." : t.rsvp_btn}
      </button>
      <p className="text-center text-xs text-urbano/50">
        Seus dados ficam só com a gente. Prometido. 🤞
      </p>
    </form>
  );
}
