"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations/contact";
import { sanitizeInput } from "@/lib/sanitize";
import nodemailer from "nodemailer";

/** Resolves true when a notification actually went out, false when Gmail is
 *  not configured. Throws on an SMTP failure — the caller decides what that
 *  means for the request. */
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
}): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const recipientEmail = process.env.GMAIL_RECIPIENT || gmailUser;

  if (!gmailUser || !gmailAppPassword) {
    console.log("Gmail not configured, skipping email send");
    return false;
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

  return true;
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

  // The stored row is the real delivery — /admin/contacts reads from it. The
  // insert is the one step whose failure genuinely loses the message.
  let saved = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createServerClient } = await import("@supabase/ssr");
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll() { return []; }, setAll() {} } }
      );
      // supabase-js reports failures on the result rather than throwing, so
      // without this check `saved` would be true even for a rejected insert.
      const { error } = await supabase.from("contacts").insert(sanitized);
      if (error) throw error;
      saved = true;
    } catch (err) {
      console.error("Failed to insert contact:", err);
    }
  }

  // Gmail is a convenience notification on top of the stored row, so an SMTP
  // outage (a revoked app password, most likely) must not fail the request —
  // it previously threw straight through the API route as a bare 500, telling
  // the visitor their message was lost when it had already been saved.
  let notified = false;
  try {
    notified = await sendEmail(sanitized);
  } catch (err) {
    console.error("Failed to send contact email:", err);
  }

  // Only a total loss is worth reporting: nothing stored and nothing sent.
  if (!saved && !notified) {
    return { success: false, error: "Could not deliver your message. Please try again later." };
  }

  return { success: true };
}
