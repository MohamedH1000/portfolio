import { NextRequest } from "next/server";
import { submitContactForm } from "@/app/actions/contact";
import { contactSchema } from "@/lib/validations/contact";
import { rateLimit } from "@/lib/rate-limit";
import { successResponse, errorResponse } from "@/lib/api-response";
import { RateLimitError, ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const { allowed } = rateLimit(`contact:${ip}`);
    if (!allowed) {
      throw new RateLimitError("Too many messages. Please wait a few minutes.");
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed");
    }

    const result = await submitContactForm(parsed.data);

    if (!result.success) {
      return errorResponse(new Error(result.error));
    }

    return successResponse({ message: "Message sent successfully" }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
