import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata = {
  title: "Authentication Error",
};

export default async function AuthErrorPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-lg text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <span className="text-2xl font-bold text-destructive">!</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("errorTitle")}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {t("errorDescription")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
