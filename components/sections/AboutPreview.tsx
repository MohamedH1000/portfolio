import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface AboutPreviewProps {
  locale: string;
}

export function AboutPreview({ locale }: AboutPreviewProps) {
  const t = useTranslations("about");

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="section-heading">
          {locale === "ar" ? (
            <>
              عن <span className="text-brand">Mohamed</span>
            </>
          ) : (
            <>
              About <span className="text-brand">Me</span>
            </>
          )}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("bio")}
        </p>
        <Link
          href={{ pathname: "/about" }}
          className="inline-block text-brand hover:text-brand/80 underline underline-offset-4 transition-colors"
        >
          {locale === "ar" ? "اقرأ المزيد" : "Read more"}
        </Link>
      </div>
    </section>
  );
}
