/**
 * Kanonski interni pathname ključevi (isti kao Next.js `[locale]/…` folderi BS default).
 * Clean SEO model: 1 stranica = 1 intent (pillar pages + rezervacija + blog).
 */

export const SEO_DEFAULT_LOCALE = "bs";

export const PRIVACY_PATH = "/politika-privatnosti";

/** 5 glavnih pillar stranica — bez preklapanja intenta. */
export const SEO_PILLARS = {
  parkingPrices: "/cijene-parking-aerodrom-sarajevo",
  secureParking: "/sigurnost-parking-sarajevo-aerodrom",
  howParkingWorks: "/kako-funkcionise-parking-aerodrom-sarajevo",
  parkingNear: "/parking-blizu-aerodroma-sarajevo",
};

/** Redoslijed internog linkovanja: Home → Prices → Safety → How → Location */
export const PILLAR_ORDER = [
  SEO_PILLARS.parkingPrices,
  SEO_PILLARS.secureParking,
  SEO_PILLARS.howParkingWorks,
  SEO_PILLARS.parkingNear,
];

export const SEO_SLUGS = {
  ...SEO_PILLARS,
  reservation: "/rezervacija",
  blog: "/blog",
};

export const NEXT_INTL_PATHNAMES = {
  "/": "/",
  [SEO_SLUGS.parkingPrices]: {
    bs: "/cijene-parking-aerodrom-sarajevo",
    en: "/sarajevo-airport-parking-prices",
    de: "/sarajevo-flughafen-parkplatz-preise",
  },
  [SEO_SLUGS.secureParking]: {
    bs: "/sigurnost-parking-sarajevo-aerodrom",
    en: "/secure-sarajevo-airport-parking",
    de: "/sicherer-parkplatz-flughafen-sarajevo",
  },
  [SEO_SLUGS.howParkingWorks]: {
    bs: "/kako-funkcionise-parking-aerodrom-sarajevo",
    en: "/how-airport-parking-works-sarajevo",
    de: "/wie-funktioniert-flughafen-parken-sarajevo",
  },
  [SEO_SLUGS.parkingNear]: {
    bs: "/parking-blizu-aerodroma-sarajevo",
    en: "/parking-near-sarajevo-airport",
    de: "/parkplatz-nahe-flughafen-sarajevo",
  },
  [SEO_SLUGS.reservation]: {
    bs: "/rezervacija",
    en: "/book-sarajevo-airport-parking",
    de: "/flughafen-parkplatz-sarajevo-buchen",
  },
  [SEO_SLUGS.blog]: {
    bs: "/blog",
    en: "/blog",
    de: "/blog",
  },
  [PRIVACY_PATH]: {
    bs: "/politika-privatnosti",
    en: "/privacy-policy",
    de: "/datenschutz",
  },
};

const ALL_LOCALES = ["bs", "en", "de"];

export function seoLocalizedSegment(pathnameKey, locale) {
  if (!pathnameKey || pathnameKey === "/") return "";
  const map = NEXT_INTL_PATHNAMES[pathnameKey];
  if (!map) return pathnameKey.replace(/^\//, "");
  const entry =
    typeof map === "string" ? map : map[locale] ?? map[SEO_DEFAULT_LOCALE];
  return entry.replace(/^\//, "");
}

export function seoPagePath(locale, pathnameKey) {
  if (!pathnameKey || pathnameKey === "/") {
    return `/${locale}`;
  }
  const segment = seoLocalizedSegment(pathnameKey, locale);
  return `/${locale}/${segment}`;
}

export function seoAbsoluteUrl(origin, locale, pathnameKey) {
  const base = origin.replace(/\/$/, "");
  return `${base}${seoPagePath(locale, pathnameKey)}`;
}

export function seoLocalizedPathMatches(pathnameHook, pathnameKey) {
  if (pathnameHook == null) return false;

  const raw = pathnameHook === "/" ? "" : pathnameHook;
  const cur =
    raw === "" ? "" : String(raw).replace(/^\/+|\/+$/g, "");

  return ALL_LOCALES.some(
    (l) => seoLocalizedSegment(pathnameKey, l) === cur
  );
}

/** 301: BS slug na /en i /de lokalizirane verzije. */
export function listLegacySlugRedirects() {
  const olds = [];
  const slugKeys = [...Object.values(SEO_SLUGS), PRIVACY_PATH];

  for (const key of slugKeys) {
    const map = NEXT_INTL_PATHNAMES[key];
    if (!map || typeof map === "string") continue;

    const bsSeg = seoLocalizedSegment(key, SEO_DEFAULT_LOCALE);

    for (const loc of ["en", "de"]) {
      const newSeg = seoLocalizedSegment(key, loc);
      if (bsSeg !== newSeg) {
        olds.push({ locale: loc, fromSeg: bsSeg, toSeg: newSeg });
      }
    }
  }

  return olds;
}

/**
 * 301: uklonjene / preimenovane stranice (anti-cannibalization).
 * @returns {{ locale: string, fromSeg: string, toSeg: string }[]}
 */
export function listCannibalizationRedirects() {
  const r = (locale, fromSeg, toSeg) => ({ locale, fromSeg, toSeg });

  return [
    // BS — preimenovanje piliera
    r("bs", "parking-aerodrom-sarajevo-cijene", "cijene-parking-aerodrom-sarajevo"),
    r("bs", "siguran-parking-aerodrom-sarajevo", "sigurnost-parking-sarajevo-aerodrom"),
    // BS — uklonjeni landing → pillar ili blog
    r("bs", "najjeftiniji-parking-aerodrom-sarajevo", "cijene-parking-aerodrom-sarajevo"),
    r("bs", "dugorocni-parking-aerodrom-sarajevo", "blog/vodic-dugorocni-parking-aerodrom-sarajevo"),
    r("bs", "parking-aerodrom-sarajevo-vs-taksi", "blog/parking-vs-taksi-aerodrom-sarajevo"),
    r("bs", "transfer-aerodrom-sarajevo", "kako-funkcionise-parking-aerodrom-sarajevo"),
    r("bs", "privatni-vs-javni-parking-sarajevo", "cijene-parking-aerodrom-sarajevo"),
    r("bs", "faq-parking-aerodrom-sarajevo", "kako-funkcionise-parking-aerodrom-sarajevo"),
    r("bs", "kako-doci-do-aerodroma-sarajevo", "parking-blizu-aerodroma-sarajevo"),
    // EN
    r("en", "airport-parking-sarajevo-prices", "sarajevo-airport-parking-prices"),
    r("en", "sarajevo-airport-parking-transfer", "how-airport-parking-works-sarajevo"),
    r("en", "airport-transfer-sarajevo-parking", "how-airport-parking-works-sarajevo"),
    r("en", "cheapest-sarajevo-airport-parking", "sarajevo-airport-parking-prices"),
    r("en", "long-term-sarajevo-airport-parking", "blog/long-term-parking-guide-sarajevo-airport"),
    r("en", "parking-vs-taxi-sarajevo-airport", "blog/parking-vs-taxi-sarajevo-airport"),
    r("en", "private-vs-public-airport-parking-sarajevo", "sarajevo-airport-parking-prices"),
    r("en", "sarajevo-airport-parking-faq", "how-airport-parking-works-sarajevo"),
    r("en", "how-to-get-to-sarajevo-airport", "parking-near-sarajevo-airport"),
    // DE (isti clean model)
    r("de", "flughafen-parkplatz-sarajevo-preise", "sarajevo-flughafen-parkplatz-preise"),
    r("de", "guenstigster-parkplatz-flughafen-sarajevo", "sarajevo-flughafen-parkplatz-preise"),
    r("de", "langzeit-parken-flughafen-sarajevo", "blog/long-term-parking-guide-sarajevo-airport"),
    r("de", "parkplatz-vs-taxi-sarajevo-flughafen", "blog/parking-vs-taxi-sarajevo-airport"),
    r("de", "sarajevo-flughafen-transfer-service", "wie-funktioniert-flughafen-parken-sarajevo"),
    r("de", "flughafen-transfer-sarajevo-parkplatz", "wie-funktioniert-flughafen-parken-sarajevo"),
    r("de", "privat-vs-oeffentlich-parkplatz-sarajevo-flughafen", "sarajevo-flughafen-parkplatz-preise"),
    r("de", "faq-flughafen-parkplatz-sarajevo", "wie-funktioniert-flughafen-parken-sarajevo"),
    r("de", "anreise-flughafen-sarajevo", "parkplatz-nahe-flughafen-sarajevo"),
  ];
}
