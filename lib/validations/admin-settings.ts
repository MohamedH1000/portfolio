import { z } from "zod/v4";

export const settingSchema = z.object({
  key: z.string().min(1),
  value_en: z.string().min(1, "English value is required"),
  value_ar: z.string().min(1, "Arabic value is required"),
});

export type SettingInput = z.infer<typeof settingSchema>;
