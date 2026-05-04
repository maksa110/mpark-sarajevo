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
import { SEO_SLUGS } from "@/lib/seo-routes";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildSeoArticleMetadata({
    locale,
    namespace: "seoReservation",
    slug: SEO_SLUGS.reservation,
  });
}

export default async function ReservationPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const slug = SEO_SLUGS.reservation;
  const path = `/${locale}/${slug}`;
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
      { name: "M Park Sarajevo", path: `/${locale}` },
      { name: t("metaTitle"), path },
    ],
  });

  return (
    <MarketingChrome
      skipBookingHref="#book"
      skipLabel={tCommon("skipToBooking")}
    >
      <JsonLdScripts schemas={[business, webpage, crumbs]} />
      <SeoGuideArticle
        locale={locale}
        namespace="seoReservation"
        bookHashHref="#book"
      />
      <Booking />
    </MarketingChrome>
  );
}
