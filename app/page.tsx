"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Phone,
  MessageCircle,
  BadgeCheck,
  Wrench,
  Zap,
  Droplets,
  Car,
  Paintbrush,
  Wind,
  Hammer,
  Briefcase,
  ArrowUpLeft,
  RotateCcw,
} from "lucide-react";
import { supabase, Category, LocationItem, Provider } from "@/lib/supabase";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Droplets,
  Car,
  Paintbrush,
  Wind,
  Hammer,
  Wrench,
};

function formatWhatsAppNumber(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("07") && digits.length === 10) {
    return `962${digits.slice(1)}`;
  }
  if (digits.startsWith("7") && digits.length === 9) {
    return `962${digits}`;
  }
  return digits;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const [
          { data: cats, error: catsError },
          { data: locs, error: locsError },
          { data: provs, error: provsError },
        ] = await Promise.all([
          supabase.from("categories").select("*").order("created_at"),
          supabase.from("locations").select("*").order("city"),
          supabase
            .from("providers")
            .select("*, categories(name_ar, slug, icon)")
            .eq("status", "approved")
            .order("created_at", { ascending: false }),
        ]);

        if (catsError || locsError || provsError) {
          throw new Error(
            catsError?.message ||
              locsError?.message ||
              provsError?.message ||
              "تعذر تحميل البيانات من قاعدة البيانات"
          );
        }

        if (!isMounted) return;
        setCategories(cats ?? []);
        setLocations(locs ?? []);
        setProviders((provs as Provider[]) ?? []);
      } catch (err) {
        if (!isMounted) return;
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "حدث خطأ غير متوقع أثناء تحميل البيانات"
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const uniqueCities = useMemo(
    () => Array.from(new Set(locations.map((l) => l.city))).filter(Boolean),
    [locations]
  );

  const filteredProviders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return providers.filter((p) => {
      const matchesCategory =
        !selectedCategory || p.category_id === selectedCategory;
      const matchesCity = !selectedCity || p.city === selectedCity;
      const matchesQuery =
        !q ||
        p.full_name.toLowerCase().includes(q) ||
        (p.bio ? p.bio.toLowerCase().includes(q) : false) ||
        (p.categories?.name_ar
          ? p.categories.name_ar.toLowerCase().includes(q)
          : false) ||
        (Array.isArray(p.areas)
          ? p.areas.some((a) => a.toLowerCase().includes(q))
          : false);

      return matchesCategory && matchesCity && matchesQuery;
    });
  }, [providers, selectedCategory, selectedCity, searchQuery]);

  const hasActiveFilters = Boolean(
    selectedCategory || selectedCity || searchQuery.trim()
  );

  function resetFilters() {
    setSelectedCategory("");
    setSelectedCity("");
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900">
                صنايعي
              </span>
              <p className="text-[11px] font-medium text-slate-500">
                دليل الحرف والمهن اليدوية
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:text-sm"
            >
              بحث متقدم
            </Link>
            <Link
              href="/join"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 sm:text-sm"
            >
              سجّل كمهني
            </Link>
          </div>
        </div>
      </header>
      {/* Hero & Search */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/30">
            سريع • موثوق • تواصل مباشر بدون عمولات
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
            اللي بدك إياه من{" "}
            <span className="text-amber-400">الصنايعية</span> بمنطقتك بضغطة
            زر
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            كهربائي، مواسرجي، ميكانيكي، دهين، تكييف، ونجارة — تواصل مباشرة مع
            المهنيين في مدينتك وشوف أعمالهم وتقييماتهم.
          </p>

          {/* Search Box */}
          <div className="mt-8 rounded-2xl bg-white p-3 text-slate-900 shadow-xl sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-3.5 right-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو المنطقة أو الخدمة..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-9 pl-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                />
              </div>

              <select
                aria-label="اختر التخصص"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              >
                <option value="">كل التخصصات</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_ar}
                  </option>
                ))}
              </select>

              <select
                aria-label="اختر المحافظة"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              >
                <option value="">كل المحافظات</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            التخصصات الحرفية
          </h2>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Wrench;
            const active = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(active ? "" : cat.id)
                }
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition ${
                  active
                    ? "border-amber-500 bg-amber-50 text-amber-900 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50/40"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    active
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold sm:text-sm">
                  {cat.name_ar}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Providers List */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            المهنيون المتاحون ({filteredProviders.length})
          </h2>
        </div>

        {errorMsg ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-700">
            {errorMsg}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              />
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-base font-bold text-slate-800">
              لا يوجد مهنيون مطابقون للبحث حالياً
            </p>
            <p className="mt-1 text-sm text-slate-500">
              جرّب تغيير المحافظة أو التخصص، أو كن أول من يسجّل في هذا القسم!
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  عرض جميع المهنيين
                </button>
              )}
              <Link
                href="/join"
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-600"
              >
                سجّل كمهني الآن
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/providers/${provider.id}`}
                          className="inline-flex items-center gap-1 text-base font-extrabold text-slate-900 hover:text-amber-600"
                        >
                          <span>{provider.full_name}</span>
                          <ArrowUpLeft className="h-3.5 w-3.5 opacity-60" />
                        </Link>
                        {provider.is_verified && (
                          <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-amber-600">
                        {provider.categories?.name_ar || "مهني"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        provider.is_available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {provider.is_available ? "متاح الآن" : "مشغول"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {provider.city}
                      {provider.areas?.length
                        ? ` - ${provider.areas.slice(0, 2).join("، ")}`
                        : ""}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {provider.experience_years} سنوات خبرة
                    </span>
                  </div>

                  {provider.bio && (
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {provider.bio}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    اتصال
                  </a>
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(
                      provider.whatsapp
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    واتساب
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}