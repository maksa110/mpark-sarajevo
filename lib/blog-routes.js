import { SEO_PILLARS } from "@/lib/seo-routes";

/** Blog članci — long-tail, bez preklapanja s pillar intentima. */
export const BLOG_ARTICLES = {
  parkingSafe: {
    id: "parkingSafe",
    namespace: "blogParkingSafe",
    pillarKey: SEO_PILLARS.secureParking,
    slugs: {
      bs: "da-li-je-parking-aerodrom-sarajevo-siguran",
      en: "is-sarajevo-airport-parking-safe",
      de: "ist-flughafen-parken-sarajevo-sicher",
    },
  },
  parkingVsTaxi: {
    id: "parkingVsTaxi",
    namespace: "blogParkingVsTaxi",
    pillarKey: SEO_PILLARS.parkingPrices,
    slugs: {
      bs: "parking-vs-taksi-aerodrom-sarajevo",
      en: "parking-vs-taxi-sarajevo-airport",
      de: "parkplatz-vs-taxi-sarajevo-flughafen",
    },
  },
  longTermGuide: {
    id: "longTermGuide",
    namespace: "blogLongTermGuide",
    pillarKey: SEO_PILLARS.parkingPrices,
    slugs: {
      bs: "vodic-dugorocni-parking-aerodrom-sarajevo",
      en: "long-term-parking-guide-sarajevo-airport",
      de: "langzeit-parken-leitfaden-sarajevo-flughafen",
    },
  },
  flyingTips: {
    id: "flyingTips",
    namespace: "blogFlyingTips",
    pillarKey: SEO_PILLARS.howParkingWorks,
    slugs: {
      bs: "savjeti-let-sarajevo-aerodrom",
      en: "tips-flying-from-sarajevo-airport",
      de: "tipps-flug-ab-sarajevo-flughafen",
    },
  },
};

export const BLOG_ARTICLE_LIST = Object.values(BLOG_ARTICLES);

export function blogArticleSlug(articleId, locale) {
  const article = BLOG_ARTICLES[articleId];
  if (!article) return null;
  return article.slugs[locale] ?? article.slugs.bs;
}

export function blogArticleBySlug(slug, locale) {
  return (
    BLOG_ARTICLE_LIST.find(
      (a) => a.slugs[locale] === slug || a.slugs.bs === slug
    ) ?? null
  );
}

export function blogArticlePath(locale, articleId) {
  const slug = blogArticleSlug(articleId, locale);
  return slug ? `/${locale}/blog/${slug}` : null;
}

export function blogArticleAbsoluteUrl(origin, locale, articleId) {
  const path = blogArticlePath(locale, articleId);
  if (!path) return null;
  return `${origin.replace(/\/$/, "")}${path}`;
}

export function blogAllPathsForSitemap(origin, locales) {
  const base = origin.replace(/\/$/, "");
  const entries = [];

  for (const locale of locales) {
    for (const article of BLOG_ARTICLE_LIST) {
      const slug = article.slugs[locale] ?? article.slugs.bs;
      entries.push({
        url: `${base}/${locale}/blog/${slug}`,
        articleId: article.id,
        locale,
      });
    }
  }

  return entries;
}
