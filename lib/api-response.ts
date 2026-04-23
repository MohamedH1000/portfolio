import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { AppError } from "./errors";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, error: "Validation failed", issues: error.issues },
      { status: 400 }
    );
  }

  console.error("Unexpected error:", error);
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
