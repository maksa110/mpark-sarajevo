import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

/**
 * Kanonski metadata za SEO podstranicu (hreflang + OG/Twitter osnova).
 * @param {{ locale: string, namespace: string, slug: string }} opts
 */
export async function buildSeoArticleMetadata(opts) {
  const { locale, namespace, slug } = opts;
  const t = await getTranslations({ locale, namespace });
  const origin = SITE.url.replace(/\/$/, "");
  const path = `/${locale}/${slug}`;
  const keywordsRaw = t.raw("metaKeywords");
  const keywords = Array.isArray(keywordsRaw) ? keywordsRaw : [];

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${origin}/${l}/${slug}`])
  );
  languages["x-default"] = `${origin}/${routing.defaultLocale}/${slug}`;

  const metaLocale =
    locale === "bs" ? "bs_BA" : locale === "de" ? "de_DE" : "en_GB";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords,
    alternates: {
      canonical: `${origin}${path}`,
      languages,
    },
    openGraph: {
      type: "website",
      locale: metaLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) =>
          l === "bs" ? "bs_BA" : l === "de" ? "de_DE" : "en_GB"
        ),
      url: `${origin}${path}`,
      siteName: SITE.brand,
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
