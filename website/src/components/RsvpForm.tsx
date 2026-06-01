"use client";

import { useState } from "react";

interface FormState {
  nome: string;
  email: string;
  telefone: string;
  num_acompanhantes: number;
  restricao_alimentar: string;
  mensagem: string;
}

const initial: FormState = {
  nome: "",
  email: "",
  telefone: "",
  num_acompanhantes: 0,
  restricao_alimentar: "",
  mensagem: "",
};

export function RsvpForm() {
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
        <span className="text-5xl">🎉</span>
        <h2 className="mt-4 font-display text-2xl font-bold text-oceano">
          Presença confirmada!
        </h2>
        <p className="mt-2 text-urbano/70">
          Obrigado, <strong>{form.nome.split(" ")[0]}</strong>! Enviamos um e-mail de
          confirmação para <strong>{form.email}</strong>. Já já a gente se vê em SP —
          com sotaque misturado e tudo.
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
          placeholder="Seu nome completo"
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
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-urbano">Telefone</label>
          <input
            value={form.telefone}
            onChange={(e) => update("telefone", e.target.value)}
            className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            placeholder="(11) 99999-9999"
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

      <div>
        <label className="mb-1 block text-sm font-medium text-urbano">
          Restrição alimentar
        </label>
        <input
          value={form.restricao_alimentar}
          onChange={(e) => update("restricao_alimentar", e.target.value)}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
          placeholder="Vegetariano, sem glúten, alérgico a... (opcional)"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-urbano">
          Mensagem para o casal
        </label>
        <textarea
          rows={3}
          value={form.mensagem}
          onChange={(e) => update("mensagem", e.target.value)}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
          placeholder="Opcional — manda aquela mensagem carinhosa (ou a piada)."
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error || "Algo deu errado. Tente novamente."}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
        {status === "sending" ? "Confirmando..." : "Confirmar presença"}
      </button>
      <p className="text-center text-xs text-urbano/50">
        Seus dados ficam só com a gente. Prometido. 🤞
      </p>
    </form>
  );
}
