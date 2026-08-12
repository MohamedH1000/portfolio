import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CredentialsSignInForm } from "@/components/ui/credentials-form";
import { GoogleSignInButton } from "@/components/ui/google-button";

export const metadata = {
  title: "Sign In",
};

export default async function SignInPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20">
      <div aria-hidden="true" className="bg-blueprint bg-blueprint-fade pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 start-1/3 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 end-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/10 blur-[110px]" />

      <div className="relative w-full max-w-md">
        <div className="glass-panel border-gradient border-gradient-static rounded-2xl p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient text-2xl font-bold text-white shadow-[var(--shadow-brand)]">
              MH
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("welcomeBack")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("signInDescription")}
            </p>
          </div>

          <CredentialsSignInForm />

          <div className="relative my-6">
            <div className="divider-gradient absolute inset-x-0 top-1/2" />
            <div className="relative flex justify-center text-xs">
              <span className="rounded-full bg-[var(--card)] px-3 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          <GoogleSignInButton />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/auth/signup"
              className="focus-ring link-underline font-medium text-brand"
            >
              {t("signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
