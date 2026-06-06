"use client";

import { useState } from "react";
import { LifeBuoy } from "lucide-react";

const tipos = [
  "Problema ao confirmar presença (RSVP)",
  "Problema ao pagar um presente",
  "Problema ao abrir o site",
  "Outro",
];

export function ContatoForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    tipo: tipos[0],
    descricao: "",
    codigo_erro: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar.");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card mx-auto max-w-lg text-center">
        <LifeBuoy className="mx-auto h-12 w-12 text-oceano" strokeWidth={1.5} />
        <h2 className="mt-4 font-display text-2xl font-bold text-oceano">
          Recebemos sua mensagem!
        </h2>
        <p className="mt-2 text-urbano/70">
          O casal foi avisado e vai te responder no e-mail <strong>{form.email}</strong>.
          Obrigado por avisar — a gente resolve! 💙
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-lg space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-urbano">Seu nome *</label>
          <input
            required
            value={form.nome}
            onChange={(e) => update("nome", e.target.value)}
            className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            placeholder="Como te chamamos"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-urbano">Seu e-mail *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            placeholder="para te respondermos"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-urbano">
          Qual o tipo de problema?
        </label>
        <select
          value={form.tipo}
          onChange={(e) => update("tipo", e.target.value)}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
        >
          {tipos.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-urbano">
          Descreva o que aconteceu *
        </label>
        <textarea
          required
          rows={4}
          value={form.descricao}
          onChange={(e) => update("descricao", e.target.value)}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
          placeholder="Conta com detalhes: o que você tentou fazer, em qual página, o que apareceu..."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-urbano">
          Código ou mensagem de erro (se apareceu)
        </label>
        <input
          value={form.codigo_erro}
          onChange={(e) => update("codigo_erro", e.target.value)}
          className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
          placeholder="Cole aqui o erro, se houver (opcional)"
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error || "Algo deu errado. Tente novamente."}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
        {status === "sending" ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
