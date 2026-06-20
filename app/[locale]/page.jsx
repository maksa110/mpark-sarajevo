import { setRequestLocale, getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DeferredBooking from "@/components/DeferredBooking";
import Trust from "@/components/Trust";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import HomepageLocalSeoLinks from "@/components/HomepageLocalSeoLinks";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import FaqSection from "@/components/FaqSection";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import MobileStickyCta from "@/components/MobileStickyCta";
import { SITE, getSameAsForSchema, SCHEMA_OPENING_HOURS_SPEC } from "@/lib/site";
import { getGoogleReviews } from "@/lib/google-reviews";

/** ISR (~6h) uz sveže Places/podatke — bez force-dynamic radi boljeg edge cache-a HTML-a. */
export const revalidate = 21600;

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tMeta = await getTranslations("metadata");
  const tFaq = await getTranslations("faq");
  const tCommon = await getTranslations("common");
  const tPricing = await getTranslations("pricing");

  const googleData = await getGoogleReviews();
  const sameAs = getSameAsForSchema();
  const aggNum = Number(googleData?.aggregateRating);
  const aggTotal =
    typeof googleData?.userRatingsTotal === "number"
      ? googleData.userRatingsTotal
      : Number(googleData?.userRatingsTotal);
  const hasStructuredAggregateRating =
    googleData != null &&
    Number.isFinite(aggNum) &&
    Number.isFinite(aggTotal);

  const rawFaq = tFaq.raw("items");
  const faqItems = Array.isArray(rawFaq) ? rawFaq : [];
  const rawKeywords = tMeta.raw("keywords");
  const keywordLine = Array.isArray(rawKeywords) ? rawKeywords.join(", ") : "";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/${locale}#business`,
    name: SITE.brand,
    description: tMeta("description"),
    url: `${SITE.url}/${locale}`,
    telephone: SITE.phoneTel,
    email: SITE.email,
    image: `${SITE.url}/${locale}/opengraph-image`,
    logo: `${SITE.url}/logo.png`,
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
    openingHoursSpecification: SCHEMA_OPENING_HOURS_SPEC,
    ...(sameAs.length ? { sameAs } : {}),
    ...(hasStructuredAggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggNum.toFixed(1),
            reviewCount: Math.trunc(aggTotal),
            ratingCount: Math.trunc(aggTotal),
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(Array.isArray(googleData?.reviews) && googleData.reviews.some((r) => r.text)
      ? {
          review: googleData.reviews
            .filter((r) => r.text)
            .slice(0, 5)
            .map((r) => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.authorName },
              reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating,
                bestRating: 5,
                worstRating: 1,
              },
              reviewBody: r.text,
              ...(r.isoDate ? { datePublished: r.isoDate } : {}),
              publisher: { "@type": "Organization", name: "Google" },
            })),
        }
      : {}),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="pb-[calc(4.25rem+env(safe-area-inset-bottom))] sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <a
        href="#book"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-2xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        {tCommon("skipToBooking")}
      </a>

      <Header isHome currentPathnameKey="/" locale={locale} />
      <main>
        <Hero />
        <DeferredBooking />
        <Trust />
        <HowItWorks />
        <PricingSection />
        <HomepageLocalSeoLinks />
        <Location />
        <Gallery />
        <Reviews />
        <FaqSection />
        <Contact />
      </main>
      <SiteFooter isHome />
      <MobileStickyCta isHome />
    </div>
  );
}
