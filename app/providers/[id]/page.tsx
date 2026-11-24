import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, type Provider } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ProviderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const provider = data as Provider;
  const cleanPhone = provider.phone.replace(/\D/g, "");
  const whatsappNumber = cleanPhone.startsWith("0")
    ? `962${cleanPhone.slice(1)}`
    : cleanPhone;

  return (
    <main className="mx-auto max-w-2xl p-6" dir="rtl">
      <Link
        href="/"
        className="mb-6 inline-block rounded border px-4 py-2 text-sm"
      >
        ← العودة للرئيسية
      </Link>

      <div className="rounded-xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{provider.full_name}</h1>
        <p className="mt-1 text-gray-600">
          {provider.city}
          {provider.areas?.length ? ` - ${provider.areas.join("، ")}` : ""}
        </p>

        {provider.bio && <p className="mt-4">{provider.bio}</p>}

        <p className="mt-3 text-sm">
          سنوات الخبرة: {provider.experience_years}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`tel:${cleanPhone}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            اتصال ({provider.phone})
          </a>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            واتساب
          </a>
        </div>
      </div>
    </main>
  );
}
