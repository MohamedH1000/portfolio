import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { createMetadata, personJsonLd } from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/next"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return createMetadata({
    title: isAr ? "محمد هشام | مطور Full Stack" : "Mohamed Hesham | Full Stack Developer",
    description: isAr
      ? "مطور Full Stack متخصص في Next.js و React و TypeScript وتقنيات الويب الحديثة."
      : "Full Stack Developer specializing in Next.js, React, TypeScript, and modern web technologies.",
    locale,
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} lang={locale} style={{
      fontFamily:
        locale === "ar"
          ? "var(--font-noto-sans-arabic), var(--font-inter), sans-serif"
          : "var(--font-inter), sans-serif",
    }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <NextIntlClientProvider messages={messages}>
        <SessionProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer locale={locale} />
          <Analytics />
        </SessionProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}
