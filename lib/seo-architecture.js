/**
 * SEO architecture — 1 URL = 1 intent.
 * Pillar pages = authority; blog = long-tail support only.
 */

import { BLOG_ARTICLE_LIST } from "@/lib/blog-routes";
import {
  listCannibalizationRedirects,
  listLegacySlugRedirects,
  PILLAR_ORDER,
  SEO_PILLARS,
  SEO_SLUGS,
  seoLocalizedSegment,
} from "@/lib/seo-routes";

const ALL_LOCALES = ["bs", "en", "de"];

/** Primary keyword intent per pillar (documentation + audits). */
export const PILLAR_INTENTS = {
  [SEO_PILLARS.parkingPrices]: "pricing / tariffs only",
  [SEO_PILLARS.secureParking]: "trust / safety only",
  [SEO_PILLARS.howParkingWorks]: "booking process only",
  [SEO_PILLARS.parkingNear]: "location / directions only",
};

/** Blog article → single supporting pillar (must match blog-routes pillarKey). */
export const BLOG_PILLAR_SUPPORT = Object.fromEntries(
  BLOG_ARTICLE_LIST.map((a) => [a.id, a.pillarKey])
);

const PILLAR_NAV_KEYS = {
  [SEO_PILLARS.parkingPrices]: "prices",
  [SEO_PILLARS.secureParking]: "safety",
  [SEO_PILLARS.howParkingWorks]: "howItWorks",
  [SEO_PILLARS.parkingNear]: "location",
};

/**
 * Strict pillar internal links: homepage + other pillars only (no blog, no reservation).
 * @param {string} currentPathnameKey
 */
export function getPillarRelatedLinks(currentPathnameKey) {
  const pillarLinks = PILLAR_ORDER.filter((key) => key !== currentPathnameKey).map(
    (key) => ({
      href: key,
      navKey: PILLAR_NAV_KEYS[key],
    })
  );

  return [{ href: "/", navKey: "home" }, ...pillarLinks];
}

/** All valid redirect destination segments per locale. */
export function validRedirectTargetsByLocale(locale) {
  const targets = new Set();

  for (const key of PILLAR_ORDER) {
    targets.add(seoLocalizedSegment(key, locale));
  }

  for (const article of BLOG_ARTICLE_LIST) {
    const slug = article.slugs[locale] ?? article.slugs.bs;
    targets.add(`blog/${slug}`);
  }

  return targets;
}

/**
 * Audit redirects: broken targets, chains, loops, duplicate sources.
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function auditSeoRedirects() {
  const errors = [];
  const warnings = [];
  const legacy = listLegacySlugRedirects();
  const cannibal = listCannibalizationRedirects();
  const all = [...legacy, ...cannibal];

  for (const locale of ALL_LOCALES) {
    const valid = validRedirectTargetsByLocale(locale);
    const fromSet = new Set();
    const toSet = new Set();

    for (const { fromSeg, toSeg } of all.filter((r) => r.locale === locale)) {
      if (fromSeg === toSeg) {
        errors.push(`[${locale}] redirect loop: ${fromSeg} → ${toSeg}`);
      }
      if (fromSet.has(fromSeg)) {
        warnings.push(`[${locale}] duplicate redirect source: ${fromSeg}`);
      }
      fromSet.add(fromSeg);
      toSet.add(toSeg);

      if (!valid.has(toSeg)) {
        errors.push(
          `[${locale}] broken redirect target: ${fromSeg} → ${toSeg} (no matching page)`
        );
      }
    }

    for (const { fromSeg, toSeg } of all.filter((r) => r.locale === locale)) {
      if (fromSet.has(toSeg) && toSeg !== fromSeg) {
        warnings.push(
          `[${locale}] redirect chain: ${fromSeg} → ${toSeg} → … (${toSeg} is also a redirect source)`
        );
      }
    }
  }

  return { errors, warnings };
}

/**
 * Audit blog → pillar mapping and uniqueness of article intents.
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function auditBlogArchitecture() {
  const errors = [];
  const warnings = [];

  for (const article of BLOG_ARTICLE_LIST) {
    if (!article.pillarKey || !PILLAR_INTENTS[article.pillarKey]) {
      errors.push(`Blog "${article.id}" missing or invalid pillarKey`);
    }
    if (BLOG_PILLAR_SUPPORT[article.id] !== article.pillarKey) {
      errors.push(`Blog "${article.id}" BLOG_PILLAR_SUPPORT mismatch`);
    }
  }

  const byPillar = {};
  for (const article of BLOG_ARTICLE_LIST) {
    byPillar[article.pillarKey] = (byPillar[article.pillarKey] ?? 0) + 1;
  }
  for (const [pillar, count] of Object.entries(byPillar)) {
    if (count > 2) {
      warnings.push(
        `${count} blog articles support pillar ${pillar} — ensure long-tail only, no pillar keyword overlap`
      );
    }
  }

  return { errors, warnings };
}

/** @returns {{ errors: string[], warnings: string[], cannibalizationRisks: string[] }} */
export function auditSeoArchitecture() {
  const redirect = auditSeoRedirects();
  const blog = auditBlogArchitecture();

  const cannibalizationRisks = [];

  cannibalizationRisks.push(
    "Homepage + /cijene-pillar both mention pricing — acceptable if homepage stays broad; prices pillar owns tariff tables/FAQ."
  );
  cannibalizationRisks.push(
    "Two pricing blog posts (vs taxi, long-term) support prices pillar — OK as long-tail; must not replace pillar in nav."
  );
  cannibalizationRisks.push(
    "Blog safety article vs sigurnost pillar — OK if blog links only to safety pillar and uses question-style H1."
  );

  return {
    errors: [...redirect.errors, ...blog.errors],
    warnings: [...redirect.warnings, ...blog.warnings],
    cannibalizationRisks,
  };
}
