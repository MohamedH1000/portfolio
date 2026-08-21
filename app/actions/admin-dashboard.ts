"use server";

import { requireAdminPage } from "@/features/admin/services/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export interface DashboardStats {
  projects: number;
  experiences: number;
  testimonials: number;
  unreadMessages: number;
}

export interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  read: boolean;
  created_at: string;
}

const emptyStats: DashboardStats = {
  projects: 0,
  experiences: 0,
  testimonials: 0,
  unreadMessages: 0,
};

/**
 * Never throws. This used to build its own Supabase client from raw
 * `process.env` reads with non-null assertions — if the deployed environment
 * was ever missing a var (or a value came through empty), `createClient()`
 * threw synchronously and crashed the entire dashboard render with Next's
 * generic "error occurred in the Server Components render" page.
 *
 * `createAdminClient()` validates the environment with the app's Zod schema
 * (a much clearer error naming the exact missing var) and the try/catch below
 * means a config or network hiccup degrades to a flagged empty result — the
 * sidebar/header shell and the rest of the dashboard still render — instead
 * of taking the whole page down.
 */
export async function getDashboardStats(): Promise<{
  stats: DashboardStats;
  error: string | null;
}> {
  await requireAdminPage();

  try {
    const db = createAdminClient();

    const [projects, experiences, testimonials, unread] = await Promise.all([
      db.from("projects").select("id", { count: "exact", head: true }),
      db.from("experiences").select("id", { count: "exact", head: true }),
      db.from("testimonials").select("id", { count: "exact", head: true }),
      db.from("contacts").select("id", { count: "exact", head: true }).eq("read", false),
    ]);

    return {
      stats: {
        projects: projects.count ?? 0,
        experiences: experiences.count ?? 0,
        testimonials: testimonials.count ?? 0,
        unreadMessages: unread.count ?? 0,
      },
      error: null,
    };
  } catch {
    return { stats: emptyStats, error: "Couldn't load dashboard stats." };
  }
}

export async function getRecentContacts(): Promise<{
  contacts: RecentContact[];
  error: string | null;
}> {
  await requireAdminPage();

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("contacts")
      .select("id, name, email, subject, read, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    return { contacts: data ?? [], error: null };
  } catch {
    return { contacts: [], error: "Couldn't load recent messages." };
  }
}
