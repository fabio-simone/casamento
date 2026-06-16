import { getGifts } from "@/lib/gifts";
import { AdminGifts } from "@/components/AdminGifts";

export const dynamic = "force-dynamic";

export default async function AdminPresentesPage() {
  const gifts = await getGifts();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Presentes</h1>
      <p className="mt-1 text-urbano/60">
        Adicione, edite ou remova presentes do catálogo. Cada um pode ser comprado várias vezes.
      </p>
      <div className="mt-6">
        <AdminGifts gifts={gifts} />
      </div>
    </div>
  );
}
