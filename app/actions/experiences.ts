"use server";

import { createClient } from "@/lib/supabase/server";

export interface Experience {
  role_en: string;
  role_ar: string;
  company: string;
  description_en: string;
  description_ar: string;
  start_date: string;
  end_date: string | null;
}

const fallback: Experience[] = [
  { role_en: "Frontend Engineer Intern", role_ar: "مهندس واجهات أمامية متدرب", company: "Tech Corp", description_en: "Assisted in the development of a web-based platform using React.js, enhancing interactivity and user experience.", description_ar: "ساعدت في تطوير منصة ويب باستخدام React.js، معززاً التفاعلية وتجربة المستخدم.", start_date: "2023-06-01", end_date: "2023-09-01" },
  { role_en: "Mobile App Developer", role_ar: "مطور تطبيقات الهاتف", company: "JSM Tech", description_en: "Designed and developed mobile apps for both iOS and Android platforms using React Native.", description_ar: "صممت وطورت تطبيقات الهاتف لمنصتي iOS و Android باستخدام React Native.", start_date: "2023-09-01", end_date: "2024-01-01" },
  { role_en: "Freelance Developer", role_ar: "مطور مستقل", company: "Self-employed", description_en: "Led the development of a mobile app for a client, from initial concept to deployment on app stores.", description_ar: "قُدت تطوير تطبيق هاتف لعميل، من المفهوم الأولي إلى النشر في متاجر التطبيقات.", start_date: "2024-01-01", end_date: "2024-06-01" },
  { role_en: "Lead Frontend Developer", role_ar: "مطور واجهات أمامية رئيسي", company: "WebFlow Agency", description_en: "Developed and maintained user-facing features using modern frontend technologies. Led a team of 3 developers.", description_ar: "طورت وصيانت الميزات الموجهة للمستخدم باستخدام تقنيات الواجهة الأمامية الحديثة. قُدت فريقاً من 3 مطورين.", start_date: "2024-06-01", end_date: null },
];

export async function getExperiences(): Promise<Experience[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fallback;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return fallback;
  return data as Experience[];
}
