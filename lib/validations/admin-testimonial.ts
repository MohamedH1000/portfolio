import { z } from "zod/v4";

export const testimonialSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  message_en: z.string().min(10, "English message is required"),
  message_ar: z.string().min(10, "Arabic message is required"),
  avatar_url: z.string().optional().default(""),
  sort_order: z.number().int().min(0).default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
