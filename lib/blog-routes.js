import { SEO_PILLARS } from "@/lib/seo-routes";
import { BLOG_INLINE_CONTENT } from "@/lib/blog-content";

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
  flightDelaySarajevo: {
    id: "flightDelaySarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
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
    slugs: { bs: "koliko-ranije-doci-na-aerodrom-sarajevo", en: "how-early-should-you-arrive-at-sarajevo-airport", de: "wie-frueh-sollten-sie-am-flughafen-sarajevo-sein" },
    content: BLOG_INLINE_CONTENT.howEarlyArriveSarajevo,
  },
  travellingWithChildrenSarajevo: {
    id: "travellingWithChildrenSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "putovanje-sa-djecom-aerodrom-sarajevo", en: "travelling-with-children-from-sarajevo-airport", de: "reisen-mit-kindern-ab-flughafen-sarajevo" },
    content: BLOG_INLINE_CONTENT.travellingWithChildrenSarajevo,
  },
  earlyMorningFlightsSarajevo: {
    id: "earlyMorningFlightsSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "savjeti-rani-jutarnji-letovi-sarajevo", en: "tips-for-early-morning-flights-from-sarajevo", de: "tipps-fuer-fruehe-morgenfluege-ab-sarajevo" },
    content: BLOG_INLINE_CONTENT.earlyMorningFlightsSarajevo,
  },
  documentsBeforeFlyingSarajevo: {
    id: "documentsBeforeFlyingSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "koje-dokumente-provjeriti-prije-leta", en: "what-documents-should-you-check-before-flying", de: "welche-dokumente-sollten-sie-vor-dem-flug-pruefen" },
    content: BLOG_INLINE_CONTENT.documentsBeforeFlyingSarajevo,
  },
  prepareCarBeforeAirportParking: {
    id: "prepareCarBeforeAirportParking",
    pillarKey: SEO_PILLARS.secureParking,
    contentLocale: "en",
    slugs: { bs: "kako-pripremiti-auto-prije-aerodromskog-parkinga", en: "how-to-prepare-your-car-before-leaving-it-at-airport-parking", de: "wie-sie-ihr-auto-vor-dem-flughafenparken-vorbereiten" },
    content: BLOG_INLINE_CONTENT.prepareCarBeforeAirportParking,
  },
  carryOnVsCheckedLuggageGuide: {
    id: "carryOnVsCheckedLuggageGuide",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "rucni-vs-predati-prtljag-vodic", en: "carry-on-vs-checked-luggage-complete-guide", de: "handgepaeck-vs-aufgabegepaeck-kompletter-guide" },
    content: BLOG_INLINE_CONTENT.carryOnVsCheckedLuggageGuide,
  },
  bestTimeSummerTravelSarajevo: {
    id: "bestTimeSummerTravelSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "najbolje-vrijeme-za-ljetno-putovanje-iz-sarajeva", en: "best-time-to-travel-from-sarajevo-during-summer", de: "beste-zeit-fuer-sommerreisen-ab-sarajevo" },
    content: BLOG_INLINE_CONTENT.bestTimeSummerTravelSarajevo,
  },
  winterFlightsSarajevo: {
    id: "winterFlightsSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "zimski-letovi-iz-sarajeva-sta-ocekivati", en: "winter-flights-from-sarajevo-what-to-expect", de: "winterfluege-ab-sarajevo-was-sie-erwartet" },
    content: BLOG_INLINE_CONTENT.winterFlightsSarajevo,
  },
  commonMistakesBeforeFlyingSarajevo: {
    id: "commonMistakesBeforeFlyingSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "najcesce-greske-prije-leta-iz-sarajeva", en: "common-mistakes-travellers-make-before-flying-from-sarajevo", de: "haeufige-fehler-vor-dem-flug-ab-sarajevo" },
    content: BLOG_INLINE_CONTENT.commonMistakesBeforeFlyingSarajevo,
  },
  packEfficientlyOneWeekTrip: {
    id: "packEfficientlyOneWeekTrip",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "kako-spakovati-efikasno-za-sedam-dana", en: "how-to-pack-efficiently-for-a-one-week-trip", de: "wie-man-effizient-fuer-eine-einwoechige-reise-packt" },
    content: BLOG_INLINE_CONTENT.packEfficientlyOneWeekTrip,
  },
  airportParkingSavesTimeSarajevo: {
    id: "airportParkingSavesTimeSarajevo",
    pillarKey: SEO_PILLARS.parkingPrices,
    contentLocale: "en",
    slugs: { bs: "kako-aerodromski-parking-stedi-vrijeme", en: "how-airport-parking-saves-time-before-your-flight", de: "wie-flughafenparken-vor-ihrem-flug-zeit-spart" },
    content: BLOG_INLINE_CONTENT.airportParkingSavesTimeSarajevo,
  },
  returnFlightDelayedSarajevo: {
    id: "returnFlightDelayedSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "sta-ako-povratni-let-kasni", en: "what-happens-if-your-return-flight-is-delayed", de: "was-passiert-wenn-sich-ihr-rueckflug-verspaetet" },
    content: BLOG_INLINE_CONTENT.returnFlightDelayedSarajevo,
  },
  travelChecklistBeforeLeavingHome: {
    id: "travelChecklistBeforeLeavingHome",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "checklista-prije-polaska-od-kuce", en: "travel-checklist-before-leaving-home", de: "reise-checkliste-vor-dem-verlassen-des-hauses" },
    content: BLOG_INLINE_CONTENT.travelChecklistBeforeLeavingHome,
  },
  vehiclePickupByAnotherPerson: {
    id: "vehiclePickupByAnotherPerson",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "moze-li-druga-osoba-preuzeti-vozilo", en: "can-someone-else-pick-up-your-vehicle-after-your-trip", de: "kann-jemand-anders-ihr-fahrzeug-nach-der-reise-abholen" },
    content: BLOG_INLINE_CONTENT.vehiclePickupByAnotherPerson,
  },
  businessTravelSarajevoAirport: {
    id: "businessTravelSarajevoAirport",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "poslovna-putovanja-iz-sarajeva-savjeti", en: "business-travel-from-sarajevo-airport-planning-tips", de: "geschaeftsreisen-ab-flughafen-sarajevo-planungstipps" },
    content: BLOG_INLINE_CONTENT.businessTravelSarajevoAirport,
  },
  firstTimeFlyingSarajevoGuide: {
    id: "firstTimeFlyingSarajevoGuide",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "prvi-let-iz-sarajeva-vodic", en: "first-time-flying-from-sarajevo-beginner-guide", de: "zum-ersten-mal-fliegen-ab-sarajevo-einsteiger-guide" },
    content: BLOG_INLINE_CONTENT.firstTimeFlyingSarajevoGuide,
  },
  weekendTripsFromSarajevo: {
    id: "weekendTripsFromSarajevo",
    pillarKey: SEO_PILLARS.parkingPrices,
    contentLocale: "en",
    slugs: { bs: "vikend-putovanja-iz-sarajeva-planiranje", en: "weekend-trips-from-sarajevo-parking-and-planning", de: "wochenendreisen-ab-sarajevo-parken-und-planung" },
    content: BLOG_INLINE_CONTENT.weekendTripsFromSarajevo,
  },
  weatherAffectsFlightSarajevo: {
    id: "weatherAffectsFlightSarajevo",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "kako-vrijeme-utice-na-let-iz-sarajeva", en: "how-weather-can-affect-your-flight-from-sarajevo", de: "wie-das-wetter-ihren-flug-ab-sarajevo-beeinflussen-kann" },
    content: BLOG_INLINE_CONTENT.weatherAffectsFlightSarajevo,
  },
  sarajevoAirportTravelFaq: {
    id: "sarajevoAirportTravelFaq",
    pillarKey: SEO_PILLARS.howParkingWorks,
    contentLocale: "en",
    slugs: { bs: "najcesca-pitanja-prije-leta-iz-sarajeva", en: "frequently-asked-questions-before-flying-from-sarajevo-airport", de: "haeufige-fragen-vor-dem-flug-ab-sarajevo" },
    content: BLOG_INLINE_CONTENT.sarajevoAirportTravelFaq,
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
