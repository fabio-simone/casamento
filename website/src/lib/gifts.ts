import { createAdminClient } from "./supabase/admin";
import type { GiftWithQuotas } from "./types";

/** Busca todos os presentes com suas cotas, ordenados por criação. */
export async function getGiftsWithQuotas(): Promise<GiftWithQuotas[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gifts")
      .select("*, gift_quotas(*)")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[gifts] fetch error", error);
      return [];
    }
    return (data ?? []) as GiftWithQuotas[];
  } catch (e) {
    // Ex.: variáveis de ambiente ausentes no build/preview.
    console.error("[gifts] client error", e);
    return [];
  }
}
