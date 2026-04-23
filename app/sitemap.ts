import type { MetadataRoute } from "next";
import { getProjects } from "@/app/actions/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mohamedhesham.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const locales = ["en", "ar"];
  const routes = ["", "/about", "/projects", "/experience", "/contact"];

  const staticPages = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );

  const projectPages = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...projectPages];
}
