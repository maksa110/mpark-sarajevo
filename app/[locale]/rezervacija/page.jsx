import Booking from "@/components/Booking";
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
    namespace: "seoReservation",
    pathnameKey: SEO_SLUGS.reservation,
  });
}

export default async function ReservationPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const path = seoPagePath(locale, SEO_SLUGS.reservation);
  const t = await getTranslations({ locale, namespace: "seoReservation" });
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
      skipBookingHref={`${path}#book`}
      skipLabel={tCommon("skipToBooking")}
      currentPathnameKey={SEO_SLUGS.reservation}
      locale={locale}
    >
      <JsonLdScripts schemas={[business, webpage, crumbs]} />
      <SeoGuideArticle
        locale={locale}
        namespace="seoReservation"
        bookHashHref={{
          pathname: SEO_SLUGS.reservation,
          hash: "book",
        }}
      />
      <Booking />
    </MarketingChrome>
  );
}
