"use server";

import { createClient } from "@/lib/supabase/server";
import { projects as fallbackData } from "@/data/temp";
import type { Project } from "@/data/temp";

const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function getProjects(): Promise<Project[]> {
  if (!USE_SUPABASE) return fallbackData;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return fallbackData;
  return data as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!USE_SUPABASE) return fallbackData.filter((p) => p.featured);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return fallbackData.filter((p) => p.featured);
  return data as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!USE_SUPABASE) return fallbackData.find((p) => p.slug === slug) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return fallbackData.find((p) => p.slug === slug) ?? null;
  return data as Project;
}
