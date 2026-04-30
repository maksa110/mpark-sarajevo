import { getRequestSiteOrigin } from "@/lib/request-site-origin";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const lastModified = new Date();
  const base = await getRequestSiteOrigin();

  const languageUrls = Object.fromEntries(
    routing.locales.map((l) => [l, `${base}/${l}`])
  );
  // Google preporučuje x-default (obično glavna verzija / default locale).
  const languages = {
    ...languageUrls,
    "x-default": `${base}/${routing.defaultLocale}`,
  };

  return [
    {
      url: `${base}/${routing.defaultLocale}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    ...routing.locales
      .filter((l) => l !== routing.defaultLocale)
      .map((locale) => ({
        url: `${base}/${locale}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages },
      })),
  ];
}
