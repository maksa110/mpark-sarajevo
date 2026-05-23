import JsonLdScripts from "@/components/JsonLdScripts";
import MarketingChrome from "@/components/MarketingChrome";
import SeoGuideArticle from "@/components/SeoGuideArticle";
import {
  buildBreadcrumbJsonLd,
  buildParkingLocalBusinessJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonld-business";
import { getGoogleReviews } from "@/lib/google-reviews";
import { buildSeoArticleMetadata } from "@/lib/seo-metadata";
import { SEO_SLUGS, seoPagePath } from "@/lib/seo-routes";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildSeoArticleMetadata({
    locale,
    namespace: "seoDirectionsAirport",
    pathnameKey: SEO_SLUGS.directionsAirport,
  });
}

export default async function SeoDirectionsAirportPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const path = seoPagePath(locale, SEO_SLUGS.directionsAirport);
  const t = await getTranslations({ locale, namespace: "seoDirectionsAirport" });
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

  return (
    <MarketingChrome
      skipBookingHref={`${seoPagePath(locale, SEO_SLUGS.reservation)}#book`}
      skipLabel={tCommon("skipToBooking")}
    >
      <JsonLdScripts schemas={[business, webpage, crumbs]} />
      <SeoGuideArticle
        locale={locale}
        namespace="seoDirectionsAirport"
        bookHashHref={{
          pathname: SEO_SLUGS.reservation,
          hash: "book",
        }}
      />
    </MarketingChrome>
  );
}
