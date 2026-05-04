import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";

/**
 * Dugi SEO članak iz next-intl namespace-a (intro: string[], sections: {h2, paragraphs[]}).
 * @param {{ locale: string, namespace: string, bookHashHref: string }} props
 */
export default async function SeoGuideArticle({
  locale,
  namespace,
  bookHashHref,
}) {
  const t = await getTranslations({ locale, namespace });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const intro = t.raw("intro");
  const sections = t.raw("sections");
  const related = t.raw("relatedLinks");

  const introParas = Array.isArray(intro) ? intro : [];
  const sectionBlocks = Array.isArray(sections) ? sections : [];
  const relatedItems = Array.isArray(related) ? related : [];

  return (
    <>
      <SeoBreadcrumbs
        homeLabel={tCommon("breadcrumbHome")}
        currentLabel={t("metaTitle")}
      />
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        {t("h1")}
      </h1>
      <p className="mt-3 text-sm font-medium text-zinc-500">{t("kicker")}</p>

      <div className="prose prose-zinc prose-lg mt-10 max-w-none prose-headings:scroll-mt-24 prose-a:text-brand-navy prose-a:underline-offset-4 hover:prose-a:text-brand-lime">
        {introParas.map((p, i) => (
          <p key={`intro-${i}`}>{p}</p>
        ))}

        {sectionBlocks.map((block, i) => (
          <section key={`sec-${i}`} className="mt-10">
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              {block.h2}
            </h2>
            {(Array.isArray(block.paragraphs) ? block.paragraphs : []).map(
              (para, j) => (
                <p key={`p-${i}-${j}`}>{para}</p>
              )
            )}
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-brand-lime/40 bg-lime-50/80 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-brand-navy">{t("ctaTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{t("ctaLead")}</p>
        <Link
          href={bookHashHref}
          className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-brand-lime px-6 text-sm font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/25 ring-1 ring-brand-lime/40 transition hover:bg-brand-lime-300"
        >
          {t("ctaButton")}
        </Link>
      </div>

      {relatedItems.length > 0 && (
        <nav
          className="mt-14 border-t border-zinc-200 pt-10"
          aria-label={t("relatedNavLabel")}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            {t("relatedHeading")}
          </h2>
          <ul className="mt-4 space-y-2">
            {relatedItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-base font-medium text-brand-navy underline-offset-4 hover:text-brand-lime hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
    </>
  );
}