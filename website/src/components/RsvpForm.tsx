"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTextos } from "@/lib/textos-context";

interface FormState {
  nome: string;
  email: string;
  telefone: string;
  num_acompanhantes: number;
}

const initial: FormState = {
  nome: "",
  email: "",
  telefone: "",
  num_acompanhantes: 0,
};

export function RsvpForm() {
  const t = useTextos();
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
            setStatus("idle");
          }}
          className="btn-secondary mt-6"
        >
          Confirmar outra pessoa
        </button>
      </div>
    );
  }

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
          Número de acompanhantes
        </label>
        <select
          value={form.num_acompanhantes}
          onChange={(e) => update("num_acompanhantes", Number(e.target.value))}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
        >
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n === 0 ? "Vou sozinho(a)" : `${n} acompanhante${n > 1 ? "s" : ""}`}
            </option>
          ))}
        </select>
      </div>

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
