import { SEO_PILLARS } from "@/lib/seo-routes";
import { BLOG_INLINE_CONTENT } from "@/lib/blog-content";

/** Blog članci — long-tail, bez preklapanja s pillar intentima. */
export const BLOG_ARTICLES = {
  parkingSafe: {
    id: "parkingSafe",
    namespace: "blogParkingSafe",
    pillarKey: SEO_PILLARS.secureParking,
    publishedAt: "2026-06-14T14:19:04+02:00",
    modifiedAt: "2026-06-15T12:36:52+02:00",
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
    publishedAt: "2026-06-14T14:19:04+02:00",
    modifiedAt: "2026-06-15T12:36:52+02:00",
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
    publishedAt: "2026-06-14T14:19:04+02:00",
    modifiedAt: "2026-06-15T12:36:52+02:00",
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
    publishedAt: "2026-06-14T14:19:04+02:00",
    modifiedAt: "2026-06-15T12:36:52+02:00",
    slugs: {
      bs: "savjeti-let-sarajevo-aerodrom",
      en: "tips-flying-from-sarajevo-airport",
      de: "tipps-flug-ab-sarajevo-flughafen",
    },
  },
  flightDelaySarajevo: {
    id: "flightDelaySarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    publishedAt: "2026-07-03T17:15:37+02:00",
    modifiedAt: "2026-07-08T20:13:01+02:00",
    metaTitles: {
      en: "Flight delayed from Sarajevo? What to do | M Park",
      de: "Flug ab Sarajevo verspätet? Was tun | M Park",
    },
    slugs: {
      bs: "sta-uraditi-kad-let-iz-sarajeva-kasni",
      en: "what-to-do-if-your-flight-from-sarajevo-is-delayed",
      de: "was-tun-wenn-sich-ihr-flug-ab-sarajevo-verspaetet",
    },
    content: BLOG_INLINE_CONTENT.flightDelaySarajevo,
  },
  howEarlyArriveSarajevo: {
    id: "howEarlyArriveSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    publishedAt: "2026-07-03T17:15:37+02:00",
    modifiedAt: "2026-07-08T20:13:01+02:00",
    metaTitles: {
      bs: "Kada stići na Aerodrom Sarajevo | M Park",
      en: "When to arrive at Sarajevo Airport | M Park",
      de: "Wann am Flughafen Sarajevo sein? | M Park",
    },
    slugs: { bs: "koliko-ranije-doci-na-aerodrom-sarajevo", en: "how-early-should-you-arrive-at-sarajevo-airport", de: "wie-frueh-sollten-sie-am-flughafen-sarajevo-sein" },
    content: BLOG_INLINE_CONTENT.howEarlyArriveSarajevo,
  },
  prepareCarBeforeAirportParking: {
    id: "prepareCarBeforeAirportParking",
    pillarKey: SEO_PILLARS.secureParking,
    contentLocale: "en",
    publishedAt: "2026-07-03T17:15:37+02:00",
    modifiedAt: "2026-07-08T20:13:01+02:00",
    metaTitles: {
      bs: "Priprema auta za aerodromski parking | M Park",
      en: "Prepare your car for airport parking | M Park",
      de: "Auto fürs Flughafenparken vorbereiten | M Park",
    },
    slugs: { bs: "kako-pripremiti-auto-prije-aerodromskog-parkinga", en: "how-to-prepare-your-car-before-leaving-it-at-airport-parking", de: "wie-sie-ihr-auto-vor-dem-flughafenparken-vorbereiten" },
    content: BLOG_INLINE_CONTENT.prepareCarBeforeAirportParking,
  },
  airportParkingSavesTimeSarajevo: {
    id: "airportParkingSavesTimeSarajevo",
    pillarKey: SEO_PILLARS.parkingPrices,
    contentLocale: "en",
    publishedAt: "2026-07-03T17:15:37+02:00",
    modifiedAt: "2026-07-08T20:13:01+02:00",
    metaTitles: {
      bs: "Kako parking štedi vrijeme prije leta | M Park",
      en: "How airport parking saves time | M Park",
      de: "Wie Flughafenparken Zeit spart | M Park",
    },
    slugs: { bs: "kako-aerodromski-parking-stedi-vrijeme", en: "how-airport-parking-saves-time-before-your-flight", de: "wie-flughafenparken-vor-ihrem-flug-zeit-spart" },
    content: BLOG_INLINE_CONTENT.airportParkingSavesTimeSarajevo,
  },
  firstTimeFlyingSarajevoGuide: {
    id: "firstTimeFlyingSarajevoGuide",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    publishedAt: "2026-07-03T17:15:37+02:00",
    modifiedAt: "2026-07-08T20:13:01+02:00",
    metaTitles: {
      en: "First flight from Sarajevo: beginner guide | M Park",
      de: "Erster Flug ab Sarajevo: Einsteiger-Guide | M Park",
    },
    slugs: { bs: "prvi-let-iz-sarajeva-vodic", en: "first-time-flying-from-sarajevo-beginner-guide", de: "zum-ersten-mal-fliegen-ab-sarajevo-einsteiger-guide" },
    content: BLOG_INLINE_CONTENT.firstTimeFlyingSarajevoGuide,
  },
};

export const BLOG_ARTICLE_LIST = Object.values(BLOG_ARTICLES);

export function isBlogArticlePublished(article) {
  if (!article?.content) return true;
  return article.content.published === true;
}

export const PUBLISHED_BLOG_ARTICLE_LIST = BLOG_ARTICLE_LIST.filter(
  isBlogArticlePublished
);

export function blogArticleSlug(articleId, locale, { includeDrafts = false } = {}) {
  const article = BLOG_ARTICLES[articleId];
  if (!article) return null;
  if (!includeDrafts && !isBlogArticlePublished(article)) return null;
  return article.slugs[locale] ?? article.slugs.bs;
}

export function blogArticleBySlug(slug, locale, { includeDrafts = false } = {}) {
  const source = includeDrafts ? BLOG_ARTICLE_LIST : PUBLISHED_BLOG_ARTICLE_LIST;
  return (
    source.find(
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
    for (const article of PUBLISHED_BLOG_ARTICLE_LIST) {
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
