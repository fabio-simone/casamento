import { createAdminClient } from "@/lib/supabase/admin";
import { getRifaConfig } from "@/lib/rifa";
import { RifaPage } from "@/components/RifaPage";
import type { RifaNumero } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Rifa() {
  const config = await getRifaConfig();

  let numerosIniciais: RifaNumero[] = [];
  try {
    const supabase = createAdminClient();

    // Expire stale reservations
    await supabase
      .from("rifa_numeros")
      .update({ status: "disponivel", comprador_nome: null, comprador_whatsapp: null, external_reference: null })
      .eq("status", "reservado")
      .lt("reservado_ate", new Date().toISOString());

    const { data } = await supabase
      .from("rifa_numeros")
      .select("numero, status, comprador_nome")
      .order("numero");

    numerosIniciais = (data ?? []).map((r) => ({
      numero: r.numero,
      status: r.status,
      comprador_nome: r.status === "pago" ? r.comprador_nome : null,
    }));
  } catch {
    // DB not ready yet — generate placeholder grid
  }

  // If table doesn't exist or is empty, show all 50 as disponivel
  if (numerosIniciais.length === 0) {
    numerosIniciais = Array.from({ length: 50 }, (_, i) => ({
      numero: i + 1,
      status: "disponivel" as const,
      comprador_nome: null,
    }));
  }

  return <RifaPage config={config} numerosIniciais={numerosIniciais} />;
}
