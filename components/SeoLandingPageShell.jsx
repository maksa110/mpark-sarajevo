import JsonLdScripts from "@/components/JsonLdScripts";
import MarketingChrome from "@/components/MarketingChrome";
import SeoGuideArticle from "@/components/SeoGuideArticle";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildParkingLocalBusinessJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonld-business";
import { getGoogleReviews } from "@/lib/google-reviews";
import { SEO_SLUGS, seoPagePath } from "@/lib/seo-routes";
import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Zajednički layout za SEO landing stranice (JSON-LD, FAQ schema, članak).
 */
export default async function SeoLandingPageShell({
  locale,
  namespace,
  pathnameKey,
  showFaqBlock = true,
}) {
  setRequestLocale(locale);
  const path = seoPagePath(locale, pathnameKey);
  const t = await getTranslations({ locale, namespace });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const googleData = await getGoogleReviews();
  const aggNum = Number(googleData?.aggregateRating);
  const aggTotal =
    typeof googleData?.userRatingsTotal === "number"
      ? googleData.userRatingsTotal
      : Number(googleData?.userRatingsTotal);
  const aggregateRating =
    googleData != null && Number.isFinite(aggNum) && Number.isFinite(aggTotal)
      ? { ratingValue: aggNum.toFixed(1), reviewCount: Math.trunc(aggTotal) }
      : null;

  const description = t("metaDescription");
  const faqStructured =
    showFaqBlock && Array.isArray(t.raw("faqStructured"))
      ? t.raw("faqStructured")
      : [];

  const business = buildParkingLocalBusinessJsonLd({
    locale,
    path,
    description,
    aggregateRating,
  });
  const webpage = buildWebPageJsonLd({
    locale,
    path,
    title: t("metaTitle"),
    description,
  });
  const crumbs = buildBreadcrumbJsonLd({
    locale,
    items: [
      {
        name: "M Park Sarajevo",
        path: seoPagePath(locale, "/"),
      },
      { name: t("metaTitle"), path },
    ],
  });

  const schemas = [business, webpage, crumbs];
  if (faqStructured.length > 0) {
    schemas.push(
      buildFaqPageJsonLd({ locale, path, items: faqStructured })
    );
  }

  return (
    <MarketingChrome
      skipBookingHref={`${seoPagePath(locale, SEO_SLUGS.reservation)}#book`}
      skipLabel={tCommon("skipToBooking")}
      currentPathnameKey={pathnameKey}
      locale={locale}
    >
      <JsonLdScripts schemas={schemas} />
      <SeoGuideArticle
        locale={locale}
        namespace={namespace}
        pathnameKey={pathnameKey}
        bookHashHref={{
          pathname: SEO_SLUGS.reservation,
          hash: "book",
        }}
        showFaqBlock={showFaqBlock}
      />
    </MarketingChrome>
  );
}
