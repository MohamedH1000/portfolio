import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center">
      <div
        aria-hidden="true"
        className="bg-blueprint bg-blueprint-fade pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
      />

      <div className="relative">
        <p className="text-gradient-brand text-[clamp(5rem,18vw,10rem)] font-bold leading-none tracking-tighter">
          404
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {t("notFound")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {t("notFoundDescription")}
        </p>
        <Link
          href={{ pathname: "/" }}
          className="focus-ring press sheen-hover mt-8 inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3 text-sm font-medium text-white shadow-[var(--shadow-2)] transition-shadow duration-300 hover:shadow-[var(--shadow-brand)]"
        >
          {t("goHome")}
        </Link>
      </div>
    </div>
  );
}
