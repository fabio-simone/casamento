import { createAdminClient } from "./supabase/admin";
import type { Gift, GiftOrder } from "./types";

/** Lista os presentes disponíveis (catálogo), ordenados por criação. */
export async function getGifts(): Promise<Gift[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[gifts] fetch error", error);
      return [];
    }
    return (data ?? []) as Gift[];
  } catch (e) {
    console.error("[gifts] client error", e);
    return [];
  }
}

/** Lista os pedidos de presentes (carrinho), mais recentes primeiro. */
export async function getGiftOrders(): Promise<GiftOrder[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gift_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[orders] fetch error", error);
      return [];
    }
    return (data ?? []) as GiftOrder[];
  } catch (e) {
    console.error("[orders] client error", e);
    return [];
  }
}
