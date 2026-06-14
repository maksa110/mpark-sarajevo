import { notFound } from "next/navigation";
import JsonLdScripts from "@/components/JsonLdScripts";
import MarketingChrome from "@/components/MarketingChrome";
import SeoBlogArticle from "@/components/SeoBlogArticle";
import {
  blogArticleBySlug,
  BLOG_ARTICLE_LIST,
} from "@/lib/blog-routes";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonld-business";
import { SEO_SLUGS, seoPagePath } from "@/lib/seo-routes";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 86400;

export function generateStaticParams() {
  const locales = ["bs", "en", "de"];
  return locales.flatMap((locale) =>
    BLOG_ARTICLE_LIST.map((article) => ({
      locale,
      slug: article.slugs[locale] ?? article.slugs.bs,
    }))
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const article = blogArticleBySlug(slug, locale);
  if (!article) return {};
  const t = await getTranslations({ locale, namespace: article.namespace });
  const path = `${seoPagePath(locale, SEO_SLUGS.blog)}/${slug}`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: path },
    robots: { index: true, follow: true },
  };
}

export default async function BlogArticlePage({ params }) {
  const { locale, slug } = await params;
  const article = blogArticleBySlug(slug, locale);
  if (!article) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: article.namespace });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const path = `${seoPagePath(locale, SEO_SLUGS.blog)}/${slug}`;
  const faqStructured = Array.isArray(t.raw("faqStructured"))
    ? t.raw("faqStructured")
    : [];

  const webpage = buildWebPageJsonLd({
    locale,
    path,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
  const crumbs = buildBreadcrumbJsonLd({
    locale,
    items: [
      { name: "M Park Sarajevo", path: seoPagePath(locale, "/") },
      { name: "Blog", path: seoPagePath(locale, SEO_SLUGS.blog) },
      { name: t("h1"), path },
    ],
  });

  const schemas = [webpage, crumbs];
  if (faqStructured.length > 0) {
    schemas.push(
      buildFaqPageJsonLd({ locale, path, items: faqStructured })
    );
  }

  return (
    <MarketingChrome
      skipBookingHref={`${seoPagePath(locale, SEO_SLUGS.reservation)}#book`}
      skipLabel={tCommon("skipToBooking")}
    >
      <JsonLdScripts schemas={schemas} />
      <SeoBlogArticle
        locale={locale}
        namespace={article.namespace}
        pillarHref={article.pillarKey}
        bookHashHref={{
          pathname: SEO_SLUGS.reservation,
          hash: "book",
        }}
      />
    </MarketingChrome>
  );
}
