import { SITE } from "@/lib/site";
import { routing } from "@/i18n/routing";

export default function sitemap() {
  const lastModified = new Date();
  const base = SITE.url.replace(/\/$/, "");

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${base}/${l}`])
  );

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
