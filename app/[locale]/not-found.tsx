import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-brand mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">{t("notFound")}</h2>
      <p className="text-muted-foreground mb-8">{t("notFoundDescription")}</p>
      <Link
        href={{ pathname: "/" }}
        className="px-6 py-2 rounded-lg bg-brand text-primary-foreground hover:bg-brand/90 transition-colors"
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
