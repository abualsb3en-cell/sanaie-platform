"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function ProviderContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadProvider() {
      setLoading(true);
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFoundState(true);
      } else {
        setProvider(data);
      }
      setLoading(false);
    }

    loadProvider();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center" dir="rtl">جاري تحميل بيانات المهني...</div>;
  }

  if (notFoundState || !provider) {
    return <div className="p-6 text-center" dir="rtl">المهني غير موجود (404)</div>;
  }

  return (
    <main className="p-6 max-w-2xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-2">{provider.name}</h1>
      <p className="text-gray-600 mb-4">{provider.profession || provider.category}</p>
      {provider.phone && (
        <div className="flex gap-3 mt-4">
          <a
            href={`tel:${provider.phone}`}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            اتصال: {provider.phone}
          </a>
          <a
            href={`https://wa.me/${String(provider.phone).replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            واتساب
          </a>
        </div>
      )}
    </main>
  );
}

export default function ProviderPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center" dir="rtl">جاري التحميل...</div>}>
      <ProviderContent />
    </Suspense>
  );
}
