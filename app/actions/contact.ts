"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations/contact";
import { sanitizeInput } from "@/lib/sanitize";
import nodemailer from "nodemailer";

async function sendEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const recipientEmail = process.env.GMAIL_RECIPIENT || gmailUser;

  if (!gmailUser || !gmailAppPassword) {
    console.log("Gmail not configured, skipping email send");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${gmailUser}>`,
    to: recipientEmail,
    replyTo: email,
    subject: subject || `New message from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #CBACF9;">New Contact Form Message</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 80px;">Name:</td>
            <td style="padding: 8px 0; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #CBACF9;">${email}</a></td>
          </tr>
          ${subject ? `<tr>
            <td style="padding: 8px 0; color: #888;">Subject:</td>
            <td style="padding: 8px 0;">${subject}</td>
          </tr>` : ''}
        </table>
        <hr style="border: none; border-top: 1px solid #333; margin: 16px 0;" />
        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
    `,
  });
}

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

  // Save to Supabase (if configured) — best effort, don't block email
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createServerClient } = await import("@supabase/ssr");
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll() { return []; }, setAll() {} } }
      );
      await supabase.from("contacts").insert(sanitized);
    } catch (err) {
      console.error("Failed to insert contact:", err);
    }
  }

  // Send email via Gmail (if configured)
  await sendEmail(sanitized);

  return { success: true };
}
