import { SITE } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { SEO_SLUGS } from "@/lib/seo-routes";

/** Kanonski origin — mora odgovarati NEXT_PUBLIC_SITE_URL (www). */
const base = SITE.url.replace(/\/$/, "");

const SEO_PATHS = [
  SEO_SLUGS.parkingPrices,
  SEO_SLUGS.transfer,
  SEO_SLUGS.vsPublic,
  SEO_SLUGS.reservation,
];

export default function sitemap() {
  const lastModified = new Date();

  const homeLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, `${base}/${l}`])
  );
  homeLanguages["x-default"] = `${base}/${routing.defaultLocale}`;

  const homeEntries = [
    {
      url: `${base}/${routing.defaultLocale}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    ...routing.locales
      .filter((l) => l !== routing.defaultLocale)
      .map((locale) => ({
        url: `${base}/${locale}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.95,
        alternates: { languages: homeLanguages },
      })),
  ];

  const guideEntries = SEO_PATHS.flatMap((slug) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${base}/${l}/${slug}`])
    );
    languages["x-default"] = `${base}/${routing.defaultLocale}/${slug}`;

    return routing.locales.map((locale) => ({
      url: `${base}/${locale}/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: slug === SEO_SLUGS.reservation ? 0.9 : 0.82,
      alternates: { languages },
    }));
  });

  return [...homeEntries, ...guideEntries];
}
