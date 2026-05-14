import { z } from "zod/v4";

export const projectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  title_en: z.string().min(1, "English title is required").max(200),
  title_ar: z.string().min(1, "Arabic title is required").max(200),
  description_en: z.string().min(10, "English description must be at least 10 characters"),
  description_ar: z.string().min(10, "Arabic description must be at least 10 characters"),
  tech_stack: z.array(z.string()).min(1, "At least one technology is required"),
  image_url: z.string().optional().default(""),
  live_url: z.string().optional().default(""),
  github_url: z.string().optional().default(""),
  featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;
