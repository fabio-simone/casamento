import { getGiftsWithQuotas } from "@/lib/gifts";
import { AdminGifts } from "@/components/AdminGifts";

export const dynamic = "force-dynamic";

export default async function AdminPresentesPage() {
  const gifts = await getGiftsWithQuotas();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Presentes</h1>
      <p className="mt-1 text-urbano/60">
        Adicione, edite ou remova presentes e acompanhe quem pagou cada cota.
      </p>
      <div className="mt-6">
        <AdminGifts gifts={gifts} />
      </div>
    </div>
  );
}
