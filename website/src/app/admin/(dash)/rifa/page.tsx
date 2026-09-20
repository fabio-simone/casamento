import { createAdminClient } from "@/lib/supabase/admin";
import { getRifaConfig } from "@/lib/rifa";
import { formatBRL } from "@/lib/utils";
import { Wine, Users, Wallet, Hash } from "lucide-react";
import { RifaAdminContent } from "@/components/RifaAdminContent";

export const dynamic = "force-dynamic";

export default async function AdminRifaPage() {
  const supabase = createAdminClient();
  const config = await getRifaConfig();

  const { data: rows } = await supabase
    .from("rifa_numeros")
    .select("numero, status, comprador_nome, comprador_whatsapp, valor_pago, paid_at")
    .order("numero");

  const pagos = (rows ?? []).filter((r) => r.status === "pago");
  const reservados = (rows ?? []).filter((r) => r.status === "reservado");
  const totalArrecadado = pagos.reduce((acc, r) => acc + (Number(r.valor_pago) || 0), 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Rifa</h1>
      <p className="mt-1 text-urbano/60">Gestão e configuração da rifa virtual.</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Números vendidos", value: `${pagos.length} / ${config.total_numeros}`, icon: Hash },
          { label: "Reservas ativas", value: reservados.length, icon: Users },
          { label: "Total arrecadado", value: formatBRL(totalArrecadado), icon: Wallet },
          { label: "Prêmio", value: config.titulo, icon: Wine },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card">
              <Icon className="h-6 w-6 text-oceano" strokeWidth={1.5} />
              <p className="mt-2 text-xl font-bold text-oceano">{c.value}</p>
              <p className="text-sm text-urbano/60">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Compradores */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-urbano">Números vendidos</h2>
        {pagos.length === 0 ? (
          <p className="card mt-4 text-center text-urbano/50">Nenhum número vendido ainda.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {pagos.map((r) => (
              <div key={r.numero} className="card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oceano/10 font-bold text-oceano">
                    {r.numero}
                  </span>
                  <div>
                    <p className="font-medium text-urbano">{r.comprador_nome ?? "—"}</p>
                    <p className="text-sm text-urbano/50">{r.comprador_whatsapp ?? ""}</p>
                  </div>
                </div>
                <span className="font-semibold text-oceano">
                  {r.valor_pago ? formatBRL(Number(r.valor_pago)) : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Config editor */}
      <div className="mt-10">
        <h2 className="font-display text-lg font-bold text-urbano">Configurações da rifa</h2>
        <RifaAdminContent initialConfig={config} />
      </div>
    </div>
  );
}
