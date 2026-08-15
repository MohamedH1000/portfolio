import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignUpForm } from "@/components/ui/signup-form";
import { GoogleSignInButton } from "@/components/ui/google-button";

export const metadata = {
  title: "Sign Up",
};

export default async function SignUpPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20">
      <div aria-hidden="true" className="bg-blueprint bg-blueprint-fade pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 start-1/3 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 end-1/4 h-[24rem] w-[24rem] rounded-full bg-brand/10 blur-[110px]" />

      <div className="relative w-full max-w-md">
        <div className="glass-panel border-gradient border-gradient-static rounded-2xl p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl btn-accent text-2xl font-medium">
              MH
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("createAccountTitle")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("signUpDescription")}
            </p>
          </div>

          <SignUpForm />

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
            {t("hasAccount")}{" "}
            <Link
              href="/auth/signin"
              className="focus-ring link-underline font-medium text-brand"
            >
              {t("signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
