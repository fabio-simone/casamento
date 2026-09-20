import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");
  if (!orderId) {
    return NextResponse.json({ error: "Sem order_id." }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("gift_orders")
    .select("status")
    .eq("id", orderId)
    .single();

  return NextResponse.json({ status: data?.status ?? "nao_encontrado" });
}
