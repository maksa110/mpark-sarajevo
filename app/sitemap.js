import { SITE } from "@/lib/site";
import { routing } from "@/i18n/routing";

/** Kanonski origin — mora odgovarati NEXT_PUBLIC_SITE_URL (apex). */
const base = SITE.url.replace(/\/$/, "");

export default function sitemap() {
  const lastModified = new Date();

  const languageUrls = Object.fromEntries(
    routing.locales.map((l) => [l, `${base}/${l}`])
  );
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
