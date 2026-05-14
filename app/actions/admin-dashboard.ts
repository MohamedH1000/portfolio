"use server";

import { requireAdmin } from "@/features/admin/services/admin-guard";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getDashboardStats() {
  await requireAdmin();
  const db = getDb();

  const [projects, experiences, testimonials, unread] = await Promise.all([
    db.from("projects").select("id", { count: "exact", head: true }),
    db.from("experiences").select("id", { count: "exact", head: true }),
    db.from("testimonials").select("id", { count: "exact", head: true }),
    db.from("contacts").select("id", { count: "exact", head: true }).eq("read", false),
  ]);

  return {
    projects: projects.count ?? 0,
    experiences: experiences.count ?? 0,
    testimonials: testimonials.count ?? 0,
    unreadMessages: unread.count ?? 0,
  };
}

export async function getRecentContacts() {
  await requireAdmin();
  const db = getDb();

  const { data } = await db
    .from("contacts")
    .select("id, name, email, subject, read, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return data ?? [];
}
