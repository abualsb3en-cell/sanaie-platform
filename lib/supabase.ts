import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name_ar: string;
  slug: string;
  icon: string;
};

export type LocationItem = {
  id: string;
  city: string;
  area: string;
};

export type Provider = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  category_id: string | null;
  city: string;
  areas: string[];
  bio: string | null;
  experience_years: number;
  avatar_url: string | null;
  is_available: boolean;
  is_verified: boolean;
  status: string;
  categories?: {
    name_ar: string;
    slug: string;
    icon: string;
  } | null;
};