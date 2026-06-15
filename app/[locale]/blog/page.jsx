import JsonLdScripts from "@/components/JsonLdScripts";
import MarketingChrome from "@/components/MarketingChrome";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import { BLOG_ARTICLE_LIST } from "@/lib/blog-routes";
import { SEO_SLUGS, seoAbsoluteUrl, seoPagePath } from "@/lib/seo-routes";
import { buildHreflangAlternates } from "@/lib/hreflang";
import { buildWebPageJsonLd } from "@/lib/jsonld-business";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogIndex" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: seoAbsoluteUrl(new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.mpark-sarajevo.com").origin, locale, SEO_SLUGS.blog),
      languages: buildHreflangAlternates((l) => seoPagePath(l, SEO_SLUGS.blog)),
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogIndexPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blogIndex" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const path = seoPagePath(locale, SEO_SLUGS.blog);

  const items = await Promise.all(
    BLOG_ARTICLE_LIST.map(async (article) => {
      const at = await getTranslations({
        locale,
        namespace: article.namespace,
      });
      const slug = article.slugs[locale] ?? article.slugs.bs;
      return {
        id: article.id,
        slug,
        title: at("h1"),
        description: at("metaDescription"),
        readMore: at("readMore"),
      };
    })
  );

  const webpage = buildWebPageJsonLd({
    locale,
    path,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });

  return (
    <MarketingChrome
      skipBookingHref={`${seoPagePath(locale, SEO_SLUGS.reservation)}#book`}
      skipLabel={tCommon("skipToBooking")}
    >
      <JsonLdScripts schemas={[webpage]} />
      <SeoBreadcrumbs
        homeLabel={tCommon("breadcrumbHome")}
        currentLabel={t("h1")}
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {t("h1")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{t("intro")}</p>
        {Array.isArray(t.raw("body")) ? (
          <div className="mt-5 space-y-4 text-base leading-relaxed text-zinc-600">
            {t.raw("body").map((paragraph, index) => (
              <p key={`blog-body-${index}`}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        <ul className="mt-10 space-y-6">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-brand-lime/40 hover:shadow-md"
            >
              <Link href={`/blog/${item.slug}`} className="group block">
                <h2 className="text-lg font-semibold text-brand-navy group-hover:text-brand-lime">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand-navy underline decoration-brand-navy/35 underline-offset-4 group-hover:text-brand-lime">
                  {item.readMore}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingChrome>
  );
}
