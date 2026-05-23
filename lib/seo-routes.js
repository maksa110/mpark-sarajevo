/**
 * Kanonski interni pathname ključevi (isti kao Next.js `[locale]/…` folderi BS default).
 * Localized slugovi koriste isti ključ u `NEXT_INTL_PATHNAMES`.
 */

export const SEO_DEFAULT_LOCALE = "bs";

/** @type {Record<string, string>} pathname ključevi (= BS segment u Next folderu gdje ima smisla) */
export const SEO_SLUGS = {
  parkingPrices: "/parking-aerodrom-sarajevo-cijene",
  transfer: "/transfer-aerodrom-sarajevo",
  vsPublic: "/privatni-vs-javni-parking-sarajevo",
  reservation: "/rezervacija",
  faqAirport: "/faq-parking-aerodrom-sarajevo",
  directionsAirport: "/kako-doci-do-aerodroma-sarajevo",
  longTermParking: "/dugorocni-parking-aerodrom-sarajevo",
};

/**
 * Localized javni pathname mapa za defineRouting ({ pathnames }).
 */
export const NEXT_INTL_PATHNAMES = {
  "/": "/",
  [SEO_SLUGS.parkingPrices]: {
    bs: "/parking-aerodrom-sarajevo-cijene",
    en: "/airport-parking-sarajevo-prices",
    de: "/flughafen-parkplatz-sarajevo-preise",
  },
  [SEO_SLUGS.transfer]: {
    bs: "/transfer-aerodrom-sarajevo",
    en: "/sarajevo-airport-parking-transfer",
    de: "/sarajevo-flughafen-transfer-service",
  },
  [SEO_SLUGS.vsPublic]: {
    bs: "/privatni-vs-javni-parking-sarajevo",
    en: "/private-vs-public-airport-parking-sarajevo",
    de: "/privat-vs-oeffentlich-parkplatz-sarajevo-flughafen",
  },
  [SEO_SLUGS.reservation]: {
    bs: "/rezervacija",
    en: "/book-sarajevo-airport-parking",
    de: "/flughafen-parkplatz-sarajevo-buchen",
  },
  [SEO_SLUGS.faqAirport]: {
    bs: "/faq-parking-aerodrom-sarajevo",
    en: "/sarajevo-airport-parking-faq",
    de: "/faq-flughafen-parkplatz-sarajevo",
  },
  [SEO_SLUGS.directionsAirport]: {
    bs: "/kako-doci-do-aerodroma-sarajevo",
    en: "/how-to-get-to-sarajevo-airport",
    de: "/anreise-flughafen-sarajevo",
  },
  [SEO_SLUGS.longTermParking]: {
    bs: "/dugorocni-parking-aerodrom-sarajevo",
    en: "/long-term-sarajevo-airport-parking",
    de: "/langzeit-parken-flughafen-sarajevo",
  },
};

const ALL_LOCALES = ["bs", "en", "de"];

/**
 * Lokalni segment bez leading slash-a (koristi za usporedbu s usePathname()).
 */
export function seoLocalizedSegment(pathnameKey, locale) {
  if (!pathnameKey || pathnameKey === "/") return "";
  const map = NEXT_INTL_PATHNAMES[pathnameKey];
  if (!map) return pathnameKey.replace(/^\//, "");
  const entry =
    typeof map === "string" ? map : map[locale] ?? map[SEO_DEFAULT_LOCALE];
  return entry.replace(/^\//, "");
}

/** `/bs`, `/en` ili `/de/segment` */
export function seoPagePath(locale, pathnameKey) {
  if (!pathnameKey || pathnameKey === "/") {
    return `/${locale}`;
  }
  const segment = seoLocalizedSegment(pathnameKey, locale);
  return `/${locale}/${segment}`;
}

/** Apsolutni URL bez trailing slash origin-a */
export function seoAbsoluteUrl(origin, locale, pathnameKey) {
  const base = origin.replace(/\/$/, "");
  return `${base}${seoPagePath(locale, pathnameKey)}`;
}

/**
 * Uskladiti s localized usePathname() (bez locale prefiksa; segment već localized).
 */
export function seoLocalizedPathMatches(pathnameHook, pathnameKey) {
  if (pathnameHook == null) return false;

  const raw = pathnameHook === "/" ? "" : pathnameHook;
  const cur =
    raw === "" ? "" : String(raw).replace(/^\/+|\/+$/g, "");

  return ALL_LOCALES.some(
    (l) => seoLocalizedSegment(pathnameKey, l) === cur
  );
}

/** 301 liste za next.config redirects (bosanski slug na /en i /de). */
export function listLegacySlugRedirects() {
  const olds = [];

  const slugKeys = Object.values(SEO_SLUGS);

  for (const key of slugKeys) {
    const map = NEXT_INTL_PATHNAMES[key];
    if (!map || typeof map === "string") continue;

    const bsSeg = seoLocalizedSegment(key, SEO_DEFAULT_LOCALE);

    for (const loc of ["en", "de"]) {
      const newSeg = seoLocalizedSegment(key, loc);
      if (bsSeg !== newSeg) {
        olds.push({
          locale: loc,
          fromSeg: bsSeg,
          toSeg: newSeg,
        });
      }
    }
  }

  return olds;
}
