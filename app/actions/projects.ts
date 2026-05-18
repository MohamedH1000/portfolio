"use server";

import { createClient } from "@/lib/supabase/server";
import { projects as fallbackData } from "@/data/temp";
import type { Project } from "@/data/temp";

const isDev = process.env.NODE_ENV === "development";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return isDev ? fallbackData : [];
  return data as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return isDev ? fallbackData.filter((p) => p.featured) : [];
  return data as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return isDev ? (fallbackData.find((p) => p.slug === slug) ?? null) : null;
  return data as Project;
}
