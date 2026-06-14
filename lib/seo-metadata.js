import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";
import { seoAbsoluteUrl, seoPagePath } from "@/lib/seo-routes";
import { buildHreflangAlternates } from "@/lib/hreflang";

/**
 * Kanonski metadata za SEO podstranicu (hreflang + OG/Twitter osnova).
 * @param {{ locale: string, namespace: string, pathnameKey: string }} opts
 */
export async function buildSeoArticleMetadata(opts) {
  const { locale, namespace, pathnameKey } = opts;
  const t = await getTranslations({ locale, namespace });
  const origin = SITE.url.replace(/\/$/, "");

  const languages = buildHreflangAlternates((l) =>
    seoPagePath(l, pathnameKey)
  );

  const metaLocale =
    locale === "bs" ? "bs_BA" : locale === "de" ? "de_DE" : "en_GB";
  const canonical = seoAbsoluteUrl(origin, locale, pathnameKey);

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
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
      url: canonical,
      siteName: SITE.brand,
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [{ alt: t("metaTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: { alt: t("metaTitle") },
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
