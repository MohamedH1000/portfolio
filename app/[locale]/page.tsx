import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { ExperienceHighlights } from "@/components/sections/ExperienceHighlights";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getFeaturedProjects } from "@/app/actions/projects";
import { getTestimonials } from "@/app/actions/testimonials";
import { getExperiences } from "@/app/actions/experiences";
import { personJsonLd } from "@/lib/metadata";

export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featuredProjects, testimonials, experiences] = await Promise.all([
    getFeaturedProjects(),
    getTestimonials(),
    getExperiences(),
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd() }}
      />
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} locale={locale} />
      <TestimonialsCarousel testimonials={testimonials} locale={locale} />
      <ExperienceHighlights experiences={experiences} locale={locale} />
      <AboutPreview locale={locale} />
    </PageWrapper>
  );
}
