import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SEO_PILLARS, SEO_SLUGS } from "@/lib/seo-routes";
import {
  getBlogArticleContent,
} from "@/lib/blog-content";
import { PUBLISHED_BLOG_ARTICLE_LIST } from "@/lib/blog-routes";

const linkClass =
  "font-medium text-brand-navy underline decoration-brand-navy/35 underline-offset-4 transition hover:text-brand-lime hover:decoration-brand-lime/50";

const HUB_LINKS = [
  { href: SEO_PILLARS.parkingPrices, msgKey: "linkPrices" },
  { href: SEO_PILLARS.secureParking, msgKey: "linkSafety" },
  { href: SEO_PILLARS.howParkingWorks, msgKey: "linkHow" },
  { href: SEO_PILLARS.parkingNear, msgKey: "linkLocation" },
  { href: SEO_SLUGS.blog, msgKey: "linkBlog" },
  { href: SEO_SLUGS.reservation, msgKey: "linkBook" },
];

export default async function HomepageLocalSeoLinks() {
  const locale = await getLocale();
  const t = await getTranslations("homeHub");
  const tBlog = await getTranslations({ locale, namespace: "blogIndex" });
  const guideLinks = await Promise.all(
    PUBLISHED_BLOG_ARTICLE_LIST.map(async (article) => {
      const content = getBlogArticleContent(article, locale);
      const at = content
        ? null
        : await getTranslations({
            locale,
            namespace: article.namespace,
          });
      const slug = article.slugs[locale] ?? article.slugs.bs;

      return {
        href: `/blog/${slug}`,
        label: content?.h1 || at("h1"),
      };
    })
  );

  return (
    <section
      className="border-b border-zinc-200/80 bg-zinc-50/50 py-7 sm:py-8"
      aria-labelledby="home-hub-h2"
    >
      <h2 id="home-hub-h2" className="sr-only">
        {t("heading")}
      </h2>
      <div className="mx-auto max-w-3xl px-4 text-center text-sm leading-relaxed text-zinc-600 sm:px-6">
        <p className="mb-2">{t("intro")}</p>
        <p>
          <span className="font-semibold text-zinc-900">{t("brand")}</span>
          {" - "}
          {HUB_LINKS.map(({ href, msgKey }, index) => (
            <span key={href}>
              {index > 0 ? " · " : null}
              <Link href={href} className={linkClass}>
                {t(msgKey)}
              </Link>
            </span>
          ))}
        </p>
        <div className="mt-5 border-t border-zinc-200/80 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {tBlog("breadcrumb")}
          </p>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {guideLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
