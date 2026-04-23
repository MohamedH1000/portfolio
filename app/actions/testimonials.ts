"use server";

import { createClient } from "@/lib/supabase/server";

export interface Testimonial {
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  message_en: string;
  message_ar: string;
}

const fallback: Testimonial[] = [
  { name_en: "Hany", name_ar: "هاني", title_en: "Director of Mafaz Company", title_ar: "مدير شركة مفاز", message_en: "He is one of the most respectful, professional, quick, and helpful people in the group. I was very pleased to deal with him.", message_ar: "هو أحد أكثر الأشخاص احتراماً واحترافية وسرعة ومساعدة في المجموعة. كنت سعيداً جداً بالتعامل معه" },
  { name_en: "Ahmed", name_ar: "أحمد", title_en: "CTO at TechStart", title_ar: "الرئيس التقني في تك ستارت", message_en: "Mohamed delivered our project ahead of schedule with exceptional quality.", message_ar: "محمد سلّم مشروعنا قبل الموعد المحدد بجودة استثنائية." },
  { name_en: "Sarah", name_ar: "سارة", title_en: "Product Manager at InnovateCo", title_ar: "مديرة المنتج في إنوفيت كو", message_en: "Working with Mohamed was a great experience. He understood our requirements perfectly.", message_ar: "العمل مع محمد كان تجربة رائعة. فهم متطلباتنا بشكل مثالي." },
  { name_en: "Khalid", name_ar: "خالد", title_en: "Founder of DigiVenture", title_ar: "مؤسس ديجي فينشر", message_en: "Mohamed's expertise in Next.js and React is impressive. He built our entire platform from scratch.", message_ar: "خبرة محمد في Next.js و React مثيرة للإعجاب. بنى منصتنا بالكامل من الصفر." },
];

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fallback;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return fallback;
  return data as Testimonial[];
}
