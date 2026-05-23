import { SITE } from "@/lib/site";
import { routing } from "@/i18n/routing";
import {
  PRIVACY_PATH,
  SEO_SLUGS,
  seoAbsoluteUrl,
} from "@/lib/seo-routes";

/** Kanonski origin — mora odgovarati NEXT_PUBLIC_SITE_URL (www). */
const base = SITE.url.replace(/\/$/, "");

function buildSitemapSafe() {
  const lastModified = new Date();

  const homeLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, seoAbsoluteUrl(base, l, "/")])
  );
  homeLanguages["x-default"] = seoAbsoluteUrl(
    base,
    routing.defaultLocale,
    "/"
  );

  const homeEntries = [
    {
      url: seoAbsoluteUrl(base, routing.defaultLocale, "/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    ...routing.locales
      .filter((l) => l !== routing.defaultLocale)
      .map((locale) => ({
        url: seoAbsoluteUrl(base, locale, "/"),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.95,
        alternates: { languages: homeLanguages },
      })),
  ];

  const seoKeys = Object.values(SEO_SLUGS);
  const secondarySeo = new Set([
    SEO_SLUGS.faqAirport,
    SEO_SLUGS.directionsAirport,
    SEO_SLUGS.longTermParking,
  ]);

  const guideEntries = seoKeys.flatMap((pathnameKey) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, seoAbsoluteUrl(base, l, pathnameKey)])
    );
    languages["x-default"] = seoAbsoluteUrl(
      base,
      routing.defaultLocale,
      pathnameKey
    );

    return routing.locales.map((locale) => ({
      url: seoAbsoluteUrl(base, locale, pathnameKey),
      lastModified,
      changeFrequency: "monthly",
      priority:
        pathnameKey === SEO_SLUGS.reservation
          ? 0.9
          : secondarySeo.has(pathnameKey)
            ? 0.8
            : 0.82,
      alternates: { languages },
    }));
  });

  const privacyLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, seoAbsoluteUrl(base, l, PRIVACY_PATH)])
  );
  privacyLanguages["x-default"] = seoAbsoluteUrl(
    base,
    routing.defaultLocale,
    PRIVACY_PATH
  );
  const privacyEntries = routing.locales.map((locale) => ({
    url: seoAbsoluteUrl(base, locale, PRIVACY_PATH),
    lastModified,
    changeFrequency: "yearly",
    priority: 0.4,
    alternates: { languages: privacyLanguages },
  }));

  return [...homeEntries, ...guideEntries, ...privacyEntries];
}

/** Uvijek validan odgovor: izbjegni 500 u produkciji ako nešto pukne tijekom generacije. */
export default function sitemap() {
  try {
    return buildSitemapSafe();
  } catch (err) {
    console.error("[sitemap] generation failed:", err);
    const lastModified = new Date();
    return [
      {
        url: seoAbsoluteUrl(base, routing.defaultLocale, "/"),
        lastModified,
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }
}
