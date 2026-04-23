import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mohamedhesham.dev";

export function createMetadata({
  title,
  description,
  path = "",
  image,
  locale = "en",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  locale?: string;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const isAr = locale === "ar";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ar: `${SITE_URL}/ar${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: isAr ? "محمد هشام" : "Mohamed Hesham",
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data);
}

export function personJsonLd() {
  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mohamed Hesham",
    jobTitle: "Full Stack Developer",
    url: SITE_URL,
    sameAs: [
      "https://github.com/MohamedH1000",
      "https://x.com/mohamed94818836",
      "https://www.linkedin.com/in/mohamed-hesham-726903209/",
    ],
    knowsAbout: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "Supabase"],
  });
}

export function projectJsonLd(project: {
  title: string;
  description: string;
  url?: string;
  image?: string;
  techStack: string[];
}) {
  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    ...(project.url ? { url: project.url } : {}),
    ...(project.image ? { screenshot: project.image } : {}),
    applicationCategory: "WebApplication",
    programmingLanguage: project.techStack,
    author: {
      "@type": "Person",
      name: "Mohamed Hesham",
    },
  });
}
