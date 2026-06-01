"use client";

import { useMemo, useState } from "react";
import type { Rsvp } from "@/lib/types";
import { formatDateSP } from "@/lib/utils";

export function RsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  const [busca, setBusca] = useState("");
  const [comAcompanhante, setComAcompanhante] = useState<"todos" | "sim" | "nao">("todos");
  const [ordem, setOrdem] = useState<"recentes" | "antigos">("recentes");

  const filtrados = useMemo(() => {
    let list = [...rsvps];
    if (busca.trim()) {
      const q = busca.toLowerCase();
      list = list.filter(
        (r) =>
          r.nome.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.telefone ?? "").includes(q)
      );
    }
    if (comAcompanhante === "sim") list = list.filter((r) => r.num_acompanhantes > 0);
    if (comAcompanhante === "nao") list = list.filter((r) => r.num_acompanhantes === 0);
    list.sort((a, b) =>
      ordem === "recentes"
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at)
    );
    return list;
  }, [rsvps, busca, comAcompanhante, ordem]);

  const totalPessoas = filtrados.reduce(
    (acc, r) => acc + 1 + r.num_acompanhantes,
    0
  );

  function exportarCSV() {
    const header = [
      "Nome",
      "E-mail",
      "Telefone",
      "Acompanhantes",
      "Restrição alimentar",
      "Mensagem",
      "Data",
    ];
    const linhas = filtrados.map((r) => [
      r.nome,
      r.email,
      r.telefone ?? "",
      String(r.num_acompanhantes),
      r.restricao_alimentar ?? "",
      (r.mensagem ?? "").replace(/\n/g, " "),
      formatDateSP(r.created_at),
    ]);
    const csv = [header, ...linhas]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `confirmacoes-kafamento-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou telefone"
          className="min-w-[220px] flex-1 rounded-xl border border-areia px-4 py-2 text-sm outline-none focus:border-oceano"
        />
        <select
          value={comAcompanhante}
          onChange={(e) => setComAcompanhante(e.target.value as typeof comAcompanhante)}
          className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
        >
          <option value="todos">Todos</option>
          <option value="sim">Com acompanhantes</option>
          <option value="nao">Sem acompanhantes</option>
        </select>
        <select
          value={ordem}
          onChange={(e) => setOrdem(e.target.value as typeof ordem)}
          className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
        >
          <option value="recentes">Mais recentes</option>
          <option value="antigos">Mais antigos</option>
        </select>
        <button onClick={exportarCSV} className="btn-secondary py-2">
          Exportar CSV
        </button>
      </div>

      <div className="mb-3 flex gap-4 text-sm text-urbano/70">
        <span><strong>{filtrados.length}</strong> confirmações</span>
        <span><strong>{totalPessoas}</strong> pessoas no total</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-areia bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-oceano/5 text-urbano/70">
            <tr>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">Contato</th>
              <th className="px-4 py-3 font-semibold">Acomp.</th>
              <th className="px-4 py-3 font-semibold">Restrição</th>
              <th className="px-4 py-3 font-semibold">Mensagem</th>
              <th className="px-4 py-3 font-semibold">Data</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((r) => (
              <tr key={r.id} className="border-t border-areia/60 align-top">
                <td className="px-4 py-3 font-medium text-urbano">{r.nome}</td>
                <td className="px-4 py-3 text-urbano/70">
                  <div>{r.email}</div>
                  {r.telefone && <div className="text-xs text-urbano/50">{r.telefone}</div>}
                </td>
                <td className="px-4 py-3 text-urbano/70">{r.num_acompanhantes}</td>
                <td className="px-4 py-3 text-urbano/70">{r.restricao_alimentar || "—"}</td>
                <td className="max-w-[220px] px-4 py-3 text-urbano/70">{r.mensagem || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-urbano/50">
                  {formatDateSP(r.created_at, { dateStyle: "short" })}
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-urbano/50">
                  Nenhuma confirmação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
