import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata = {
  title: "Authentication Error",
};

export default async function AuthErrorPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div aria-hidden="true" className="bg-blueprint bg-blueprint-fade pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 text-center">
          <div className="relative mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl bg-destructive/15 motion-safe:animate-[pulse-ring_2.6s_ease-out_infinite]"
            />
            <span className="relative text-2xl font-bold text-destructive">!</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("errorTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("errorDescription")}
          </p>
          <Link
            href="/"
            className="focus-ring press sheen-hover mt-6 inline-flex items-center gap-2 rounded-xl btn-accent px-6 py-3 text-sm font-medium"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
