import { z } from "zod/v4";

export const experienceSchema = z.object({
  role_en: z.string().min(1, "English role is required"),
  role_ar: z.string().min(1, "Arabic role is required"),
  company: z.string().min(1, "Company name is required"),
  company_logo_url: z.string().optional().default(""),
  description_en: z.string().min(10, "English description is required"),
  description_ar: z.string().min(10, "Arabic description is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().default(null),
  sort_order: z.number().int().min(0).default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
