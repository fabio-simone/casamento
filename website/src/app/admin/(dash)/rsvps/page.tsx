import { createAdminClient } from "@/lib/supabase/admin";
import { RsvpTable } from "@/components/RsvpTable";
import type { Rsvp } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminRsvpsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Confirmações de presença</h1>
      <p className="mt-1 text-urbano/60">Todos os convidados que confirmaram.</p>
      <div className="mt-6">
        <RsvpTable rsvps={(data ?? []) as Rsvp[]} />
      </div>
    </div>
  );
}
