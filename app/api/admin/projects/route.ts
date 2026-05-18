import { requireAdmin } from "@/features/admin/services/admin-guard";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

function getDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function revalidateProjects() {
  for (const locale of ["en", "ar"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/projects`);
  }
}

// GET /api/admin/projects
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = getDb();
    const { data, error } = await db.from("projects").select().order("sort_order");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ projects: data ?? [] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/admin/projects
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const db = getDb();
    const { data, error } = await db.from("projects").insert(body).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    revalidateProjects();
    return NextResponse.json({ project: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg.includes("Unauthorized") || msg.includes("Forbidden") ? 401 : 400 });
  }
}
