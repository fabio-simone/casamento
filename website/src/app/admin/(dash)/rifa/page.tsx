import { createAdminClient } from "@/lib/supabase/admin";
import { getRifaConfig } from "@/lib/rifa";
import { formatBRL } from "@/lib/utils";
import { Wine, Users, Wallet, Hash } from "lucide-react";
import { RifaAdminContent } from "@/components/RifaAdminContent";
import { RifaReservas } from "@/components/RifaReservas";
import { RifaPagos } from "@/components/RifaPagos";

export const dynamic = "force-dynamic";

export default async function AdminRifaPage() {
  const supabase = createAdminClient();
  const config = await getRifaConfig();

  const { data: rows } = await supabase
    .from("rifa_numeros")
    .select("numero, status, comprador_nome, comprador_whatsapp, valor_pago, paid_at, external_reference, reservado_ate")
    .order("numero");

  const pagos = (rows ?? []).filter((r) => r.status === "pago");
  const reservados = (rows ?? []).filter((r) => r.status === "reservado");
  const totalArrecadado = pagos.reduce((acc, r) => acc + (Number(r.valor_pago) || 0), 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Rifa</h1>
      <p className="mt-1 text-urbano/60">Gestão e configuração da rifa virtual.</p>

      {!config.pix_chave && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ <strong>Chave PIX não configurada.</strong> Os convidados não conseguirão gerar o QR Code. Configure abaixo.
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Números vendidos", value: `${pagos.length} / ${config.total_numeros}`, icon: Hash },
          { label: "Reservas pendentes", value: reservados.length, icon: Users },
          { label: "Total arrecadado", value: formatBRL(totalArrecadado), icon: Wallet },
          { label: "Status", value: config.ativa ? "Ativa" : "Pausada", icon: Wine },
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

      {/* Reservas pendentes com confirmação */}
      {reservados.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-urbano">Reservas aguardando confirmação</h2>
          <p className="mt-1 text-sm text-urbano/60">Confirme manualmente após verificar o recebimento do PIX.</p>
          <RifaReservas reservas={reservados} />
        </div>
      )}

      {/* Compradores confirmados */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-urbano">Números pagos</h2>
        {pagos.length === 0 ? (
          <p className="card mt-4 text-center text-urbano/50">Nenhum número confirmado ainda.</p>
        ) : (
          <RifaPagos pagos={pagos} />
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
