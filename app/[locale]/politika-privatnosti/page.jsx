import MarketingChrome from "@/components/MarketingChrome";
import { buildSeoArticleMetadata } from "@/lib/seo-metadata";
import { PRIVACY_PATH, SEO_SLUGS, seoPagePath } from "@/lib/seo-routes";
import { SITE } from "@/lib/site";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildSeoArticleMetadata({
    locale,
    namespace: "privacy",
    pathnameKey: PRIVACY_PATH,
  });
}

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <MarketingChrome
      skipBookingHref={`${seoPagePath(locale, SEO_SLUGS.reservation)}#book`}
      skipLabel={tCommon("skipToBooking")}
    >
      <main
        id="main"
        className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          {t("updated")}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700">
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              {t("sections.controller.title")}
            </h2>
            <p className="mt-2">{t("sections.controller.body")}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600">
              <li>
                {t("sections.controller.phone")}:{" "}
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="font-medium text-brand-navy underline-offset-2 hover:underline"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                {t("sections.controller.email")}:{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-medium text-brand-navy underline-offset-2 hover:underline"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                {t("sections.controller.address")}: {SITE.addressShort}
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              {t("sections.data.title")}
            </h2>
            <p className="mt-2">{t("sections.data.body")}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              {t("sections.purpose.title")}
            </h2>
            <p className="mt-2">{t("sections.purpose.body")}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              {t("sections.retention.title")}
            </h2>
            <p className="mt-2">{t("sections.retention.body")}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              {t("sections.sharing.title")}
            </h2>
            <p className="mt-2">{t("sections.sharing.body")}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              {t("sections.cookies.title")}
            </h2>
            <p className="mt-2">{t("sections.cookies.body")}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              {t("sections.rights.title")}
            </h2>
            <p className="mt-2">{t("sections.rights.body")}</p>
          </section>
        </div>
      </main>
    </MarketingChrome>
  );
}
