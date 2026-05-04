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
    namespace: "seoVsPublic",
    slug: SEO_SLUGS.vsPublic,
  });
}

export default async function VsPublicParkingPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const slug = SEO_SLUGS.vsPublic;
  const path = `/${locale}/${slug}`;
  const t = await getTranslations({ locale, namespace: "seoVsPublic" });
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

  const skipHref = "/rezervacija#book";
  const bookHref = "/rezervacija#book";

  return (
    <MarketingChrome
      skipBookingHref={skipHref}
      skipLabel={tCommon("skipToBooking")}
    >
      <JsonLdScripts schemas={[business, webpage, crumbs]} />
      <SeoGuideArticle
        locale={locale}
        namespace="seoVsPublic"
        bookHashHref={bookHref}
      />
    </MarketingChrome>
  );
}
