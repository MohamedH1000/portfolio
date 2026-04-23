import { z } from "zod/v4";

export const projectSchema = z.object({
  slug: z.string(),
  title_en: z.string(),
  title_ar: z.string(),
  description_en: z.string(),
  description_ar: z.string(),
  tech_stack: z.array(z.string()),
  image_url: z.string().nullable(),
  live_url: z.string().nullable(),
  github_url: z.string().nullable().optional(),
  featured: z.boolean(),
  sort_order: z.number().optional(),
});

export const insertProjectSchema = projectSchema.omit({ sort_order: true }).extend({
  sort_order: z.number().default(0),
});

export type Project = z.infer<typeof projectSchema>;
