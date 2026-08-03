import { getTranslations, setRequestLocale } from "next-intl/server";
import Contact from "@/components/Contact";
import JsonLdScripts from "@/components/JsonLdScripts";
import Location from "@/components/Location";
import MarketingChrome from "@/components/MarketingChrome";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonld-business";
import { buildHreflangAlternates } from "@/lib/hreflang";
import { getPublicPageCopy, PUBLIC_PAGE_PATHS } from "@/lib/public-pages";
import { SEO_SLUGS, seoPagePath } from "@/lib/seo-routes";
import { SITE } from "@/lib/site";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const copy = getPublicPageCopy(locale, "contact");
  const canonical = `${SITE.url}/${locale}${PUBLIC_PAGE_PATHS.contact}`;
  const shareImage = `${SITE.url.replace(/\/$/, "")}/${locale}/opengraph-image`;
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(
        (language) => `/${language}${PUBLIC_PAGE_PATHS.contact}`
      ),
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: copy.title,
      description: copy.description,
      images: [{ url: shareImage, alt: copy.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [{ url: shareImage, alt: copy.title }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getPublicPageCopy(locale, "contact");
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const path = `/${locale}${PUBLIC_PAGE_PATHS.contact}`;
  const schemas = [
    buildWebPageJsonLd({ locale, path, title: copy.title, description: copy.description }),
    buildBreadcrumbJsonLd({
      locale,
      items: [
        { name: SITE.brand, path: seoPagePath(locale, "/") },
        { name: copy.h1, path },
      ],
    }),
    buildOrganizationJsonLd(),
  ];

  return (
    <MarketingChrome
      skipBookingHref={`${seoPagePath(locale, SEO_SLUGS.reservation)}#book`}
      skipLabel={tCommon("skipToBooking")}
      currentPathnameKey={PUBLIC_PAGE_PATHS.contact}
      locale={locale}
    >
      <JsonLdScripts schemas={schemas} />
      <SeoBreadcrumbs homeLabel={tCommon("breadcrumbHome")} currentLabel={copy.h1} />
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{copy.h1}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-700">{copy.intro}</p>
      </div>
      <Contact />
      <Location />
    </MarketingChrome>
  );
}
