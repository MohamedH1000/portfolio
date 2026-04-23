"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations/contact";
import { sanitizeInput } from "@/lib/sanitize";

export async function submitContactForm(data: unknown) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid input", issues: parsed.error.issues };
  }

  const { name, email, subject, message } = parsed.data;
  const sanitized = {
    name: sanitizeInput(name),
    email: sanitizeInput(email),
    subject: subject ? sanitizeInput(subject) : null,
    message: sanitizeInput(message),
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("Contact form submission (no Supabase):", sanitized);
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert(sanitized);

  if (error) {
    console.error("Failed to insert contact:", error);
    return { success: false, error: "Failed to send message" };
  }

  return { success: true };
}
