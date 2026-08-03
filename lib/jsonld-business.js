import {
  SITE,
  getSameAsForSchema,
  SCHEMA_OPENING_HOURS_SPEC,
} from "@/lib/site";
import { SEO_DEFAULT_LOCALE, seoPagePath } from "@/lib/seo-routes";

/**
 * JSON-LD za parking lokalu — kombinacija tipova radi kompatibilnosti sa Rich rezultatima.
 * @param {{ locale: string, path?: string, description?: string, aggregateRating?: { ratingValue: string, reviewCount: number } | null }} opts
 */
export function buildParkingLocalBusinessJsonLd(opts) {
  const { locale, description, aggregateRating } = opts;
  const origin = SITE.url.replace(/\/$/, "");

  const sameAs = getSameAsForSchema();

  const base = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${origin}#business`,
    name: SITE.brand,
    description: description || SITE.seoLine,
    url: origin,
    telephone: SITE.phoneTel,
    email: SITE.email,
    image: `${SITE.url}/${locale}/opengraph-image`,
    logo: `${SITE.url}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.addressShort.replace(/, Sarajevo$/, ""),
      addressLocality: "Sarajevo",
      addressCountry: "BA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: SCHEMA_OPENING_HOURS_SPEC,
    priceRange: "7–9 BAM per day",
    currenciesAccepted: "BAM",
    paymentAccepted: "Cash, credit card",
    areaServed: {
      "@type": "City",
      name: "Sarajevo",
    },
    hasMap: SITE.googleProfileUrl,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneTel,
      email: SITE.email,
      contactType: "customer support",
      availableLanguage: ["bs", "en", "de"],
    },
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Private airport parking with Sarajevo Airport transfer",
        serviceType: "Private airport parking",
        areaServed: {
          "@type": "City",
          name: "Sarajevo",
        },
      },
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}${seoPagePath(locale, "/rezervacija")}`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Airport parking reservation",
      },
    },
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

export function buildOrganizationJsonLd() {
  const sameAs = getSameAsForSchema();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url.replace(/\/$/, "")}#organization`,
    name: SITE.brand,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    email: SITE.email,
    telephone: SITE.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.addressShort.replace(/, Sarajevo$/, ""),
      addressLocality: "Sarajevo",
      addressCountry: "BA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneTel,
      email: SITE.email,
      contactType: "customer support",
      availableLanguage: ["bs", "en", "de"],
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildBlogPostingJsonLd(opts) {
  const origin = SITE.url.replace(/\/$/, "");
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${origin}${path}`;
  const organizationId = `${origin}#organization`;

  return {
    "@context": "https://schema.org",
    "@type": ["BlogPosting", "Article"],
    "@id": `${url}#article`,
    url: origin,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
    },
    headline: opts.title,
    description: opts.description,
    inLanguage: opts.locale,
    image: `${origin}/${opts.locale}/opengraph-image`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE.brand,
      url: origin,
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE.brand,
      logo: {
        "@type": "ImageObject",
        url: `${origin}/logo.png`,
      },
    },
    about: {
      "@type": "Service",
      name: "Private airport parking near Sarajevo Airport",
      provider: { "@id": organizationId },
    },
  };
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
      "@id": `${origin}${seoPagePath(SEO_DEFAULT_LOCALE, "/")}#website`,
      name: SITE.brand,
      url: `${origin}${seoPagePath(SEO_DEFAULT_LOCALE, "/")}`,
    },
  };
}

/**
 * FAQPage JSON-LD (samo stranice s realnim Q&A sadržajem).
 * @param {{ locale: string, path: string, items: Array<{ question: string, answer: string }> }} opts
 */
export function buildFaqPageJsonLd(opts) {
  const origin = SITE.url.replace(/\/$/, "");
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${origin}${path}`;
  const items = Array.isArray(opts.items) ? opts.items : [];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    inLanguage: opts.locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
