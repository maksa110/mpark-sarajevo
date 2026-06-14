import { SITE } from "@/lib/site";
import { routing } from "@/i18n/routing";
import {
  blogAllPathsForSitemap,
  BLOG_ARTICLE_LIST,
} from "@/lib/blog-routes";
import {
  PRIVACY_PATH,
  SEO_SLUGS,
  seoAbsoluteUrl,
} from "@/lib/seo-routes";

const base = SITE.url.replace(/\/$/, "");

function buildSitemapSafe() {
  const lastModified = new Date();

  const homeLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, seoAbsoluteUrl(base, l, "/")])
  );
  homeLanguages["x-default"] = seoAbsoluteUrl(
    base,
    routing.defaultLocale,
    "/"
  );

  const homeEntries = [
    {
      url: seoAbsoluteUrl(base, routing.defaultLocale, "/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    ...routing.locales
      .filter((l) => l !== routing.defaultLocale)
      .map((locale) => ({
        url: seoAbsoluteUrl(base, locale, "/"),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.95,
        alternates: { languages: homeLanguages },
      })),
  ];

  const seoKeys = Object.values(SEO_SLUGS);
  const pillarPriority = new Set([
    SEO_SLUGS.parkingPrices,
    SEO_SLUGS.secureParking,
    SEO_SLUGS.howParkingWorks,
    SEO_SLUGS.parkingNear,
  ]);

  const guideEntries = seoKeys.flatMap((pathnameKey) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, seoAbsoluteUrl(base, l, pathnameKey)])
    );
    languages["x-default"] = seoAbsoluteUrl(
      base,
      routing.defaultLocale,
      pathnameKey
    );

    return routing.locales.map((locale) => ({
      url: seoAbsoluteUrl(base, locale, pathnameKey),
      lastModified,
      changeFrequency: pathnameKey === SEO_SLUGS.blog ? "weekly" : "monthly",
      priority:
        pathnameKey === SEO_SLUGS.reservation
          ? 0.9
          : pathnameKey === SEO_SLUGS.blog
            ? 0.75
            : pillarPriority.has(pathnameKey)
              ? 0.85
              : 0.82,
      alternates: { languages },
    }));
  });

  const blogArticleEntries = blogAllPathsForSitemap(
    base,
    routing.locales
  ).map(({ url, articleId, locale }) => {
    const article = BLOG_ARTICLE_LIST.find((a) => a.id === articleId);
    const languages = article
      ? Object.fromEntries(
          routing.locales.map((l) => [
            l,
            `${base}/${l}/blog/${article.slugs[l] ?? article.slugs.bs}`,
          ])
        )
      : {};
    if (article) {
      languages["x-default"] = `${base}/${routing.defaultLocale}/blog/${article.slugs[routing.defaultLocale] ?? article.slugs.bs}`;
    }
    return {
      url,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
    };
  });

  const privacyLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, seoAbsoluteUrl(base, l, PRIVACY_PATH)])
  );
  privacyLanguages["x-default"] = seoAbsoluteUrl(
    base,
    routing.defaultLocale,
    PRIVACY_PATH
  );
  const privacyEntries = routing.locales.map((locale) => ({
    url: seoAbsoluteUrl(base, locale, PRIVACY_PATH),
    lastModified,
    changeFrequency: "yearly",
    priority: 0.4,
    alternates: { languages: privacyLanguages },
  }));

  return [
    ...homeEntries,
    ...guideEntries,
    ...blogArticleEntries,
    ...privacyEntries,
  ];
}

export default function sitemap() {
  try {
    return buildSitemapSafe();
  } catch (err) {
    console.error("[sitemap] generation failed:", err);
    const lastModified = new Date();
    return [
      {
        url: seoAbsoluteUrl(base, routing.defaultLocale, "/"),
        lastModified,
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }
}
