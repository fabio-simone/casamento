import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { visitor_id, path } = await req.json();
    if (!visitor_id || !path) return NextResponse.json({ ok: false });

    const supabase = createAdminClient();
    await supabase.from("page_views").insert({ visitor_id, path });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
