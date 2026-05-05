import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ContactForm } from "@/components/sections/ContactForm";
import { Mail, MapPin } from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent locale={locale} />;
}

function ContactContent({ locale }: { locale: string }) {
  const t = useTranslations("contact");
  const isAr = locale === "ar";

  return (
    <PageWrapper>
      <section className="py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="section-heading">
              {isAr ? (
                <>
                  هل أنت مستعد للارتقاء بحضورك <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">الرقمي</span> إلى المستوى التالي؟
                </>
              ) : (
                <>
                  Ready to take your <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">digital</span> presence to the next level?
                </>
              )}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-5">
                <a
                  href="mailto:mohammedhisham115@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-low border border-transparent hover:border-brand/15 transition-all duration-300 group"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:bg-brand/20 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground">mohammedhisham115@gmail.com</p>
                  </div>
                </a>

                <a
                  href="https://github.com/MohamedH1000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-low border border-transparent hover:border-brand/15 transition-all duration-300 group"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:bg-brand/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">GitHub</p>
                    <p className="text-sm text-foreground">MohamedH1000</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/mohamed-hesham-726903209/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-low border border-transparent hover:border-brand/15 transition-all duration-300 group"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:bg-brand/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">LinkedIn</p>
                    <p className="text-sm text-foreground">Mohamed Hesham</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-low border border-transparent">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{isAr ? "الموقع" : "Location"}</p>
                    <p className="text-sm text-foreground">{isAr ? "مصر" : "Egypt"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 rounded-2xl p-6 md:p-8 bg-surface-low border border-brand/10">
              <h2 className="text-lg font-semibold mb-6">
                {isAr ? "أرسل رسالة" : "Send a message"}
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
