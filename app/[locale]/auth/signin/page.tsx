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
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 mb-4">
              <span className="text-2xl font-bold text-brand">MH</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("welcomeBack")}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {t("signInDescription")}
            </p>
          </div>

          <CredentialsSignInForm />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          <GoogleSignInButton />

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("noAccount")}{" "}
            <Link
              href="/auth/signup"
              className="text-brand hover:underline font-medium"
            >
              {t("signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
