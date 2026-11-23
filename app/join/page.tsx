"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
  Briefcase,
  User,
} from "lucide-react";
import { supabase, Category } from "@/lib/supabase";

const JORDAN_CITIES = [
  "عمان",
  "الطفيلة",
  "الزرقاء",
  "إربد",
  "العقبة",
  "السلط",
  "مادبا",
  "جرش",
  "عجلون",
  "الكرك",
  "معان",
  "المفرق",
];

export default function JoinProviderPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("عمان");
  const [areasInput, setAreasInput] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [bio, setBio] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at");

      if (!error && data) {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanWhatsapp = (sameAsPhone ? phone : whatsapp).trim();

    if (!cleanName || !cleanPhone || !categoryId || !city) {
      setErrorMsg("يرجى تعبئة الاسم، رقم الهاتف، المهنة، والمحافظة.");
      return;
    }

    const areasArray = areasInput
      .split(/[,،\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    setSubmitting(true);

    try {
      const { error } = await supabase.from("providers").insert({
        full_name: cleanName,
        phone: cleanPhone,
        whatsapp: cleanWhatsapp || cleanPhone,
        category_id: categoryId,
        city,
        areas: areasArray,
        bio: bio.trim() || null,
        experience_years: Number(experienceYears) || 0,
        is_available: isAvailable,
        is_verified: false,
        status: "approved",
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMsg("تم تسجيل حسابك كمهني بنجاح! جاري تحويلك للصفحة الرئيسية...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء حفظ البيانات، حاول مرة أخرى."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900">
                صنايعي
              </span>
              <p className="text-[11px] font-medium text-slate-500">
                تسجيل مهني جديد
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:text-sm"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>
      </header>

      {/* Form Card */}
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              انضم مجاناً • بدون عمولات
            </span>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              سجّل مهنتك وموقعك على صنايعي
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              عبي بياناتك وخلي الزبائن بمنطقتك يتواصلوا معك مباشرة عبر الاتصال أو
              الواتساب.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 sm:text-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 sm:text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* الاسم والمهنة */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <User className="h-3.5 w-3.5 text-amber-500" />
                  الاسم أو اللقب المهني *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أبو السبع للكهرباء"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Wrench className="h-3.5 w-3.5 text-amber-500" />
                  المهنة / التخصص *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* أرقام التواصل */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Phone className="h-3.5 w-3.5 text-amber-500" />
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="079xxxxxxx"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  disabled={sameAsPhone}
                  value={sameAsPhone ? phone : whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="079xxxxxxx"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left text-sm outline-none transition focus:border-amber-500 focus:bg-white disabled:opacity-60"
                />
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  نفس رقم الهاتف
                </label>
              </div>
            </div>

            {/* المحافظة والمناطق */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  المحافظة *
                </label>
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                >
                  {JORDAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  المناطق التي تخدمها
                </label>
                <input
                  type="text"
                  value={areasInput}
                  onChange={(e) => setAreasInput(e.target.value)}
                  placeholder="مثال: طبربور، الهاشمي، وسط البلد"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* سنوات الخبرة والحالة */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Briefcase className="h-3.5 w-3.5 text-amber-500" />
                  سنوات الخبرة
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 w-full">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  متاح لاستقبال طلبات حالياً
                </label>
              </div>
            </div>

            {/* نبذة قصيرة */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                نبذة مختصرة عن خدماتك وأعمالك
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب باختصار شو بتقدّم من خدمات أو صيانة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-60"
            >
              {submitting ? "جاري حفظ البيانات..." : "إتمام التسجيل ونشر حسابي"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}