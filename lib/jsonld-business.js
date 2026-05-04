import {
  SITE,
  getSameAsForSchema,
  SCHEMA_OPENING_HOURS_SPEC,
} from "@/lib/site";

/**
 * JSON-LD za parking lokalu — kombinacija tipova radi kompatibilnosti sa Rich rezultatima.
 * @param {{ locale: string, path?: string, description?: string, aggregateRating?: { ratingValue: string, reviewCount: number } | null }} opts
 */
export function buildParkingLocalBusinessJsonLd(opts) {
  const { locale, path = `/${locale}`, description, aggregateRating } = opts;
  const url = `${SITE.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  const sameAs = getSameAsForSchema();

  const base = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ParkingFacility"],
    "@id": `${url}#business`,
    name: SITE.brand,
    legalName: SITE.legalName,
    description: description || SITE.seoLine,
    url,
    telephone: SITE.phoneTel,
    email: SITE.email,
    image: `${SITE.url}/${locale}/opengraph-image`,
    logo: `${SITE.url}/logo.png`,
    priceRange: "7 KM – 9 KM",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kasindolskih Žrtava 18",
      addressLocality: "Sarajevo",
      addressCountry: "BA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: { "@type": "AdministrativeArea", name: "Sarajevo" },
    inLanguage: locale,
    openingHoursSpecification: SCHEMA_OPENING_HOURS_SPEC,
    ...(sameAs.length ? { sameAs } : {}),
  };

  if (
    aggregateRating &&
    Number.isFinite(Number(aggregateRating.ratingValue)) &&
    Number.isFinite(Number(aggregateRating.reviewCount))
  ) {
    const rc = Math.max(0, Math.trunc(Number(aggregateRating.reviewCount)));
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: rc,
      ratingCount: rc,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return base;
}

/**
 * @param {{ locale: string, items: Array<{ name: string, path: string }> }} opts
 */
export function buildBreadcrumbJsonLd(opts) {
  const origin = SITE.url.replace(/\/$/, "");
  const { locale, items } = opts;
  const list = items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${origin}${it.path.startsWith("/") ? it.path : `/${it.path}`}`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };
}

/**
 * @param {{ locale: string, path: string, title: string, description: string }} opts
 */
export function buildWebPageJsonLd(opts) {
  const origin = SITE.url.replace(/\/$/, "");
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${origin}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: opts.locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: SITE.brand,
      url: origin,
    },
  };
}
