import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";

export default async function SeoBlogArticle({
  locale,
  namespace,
  pillarHref,
  bookHashHref,
}) {
  const t = await getTranslations({ locale, namespace });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tBlog = await getTranslations({ locale, namespace: "blogIndex" });
  const intro = t.raw("intro");
  const sections = t.raw("sections");
  const introParas = Array.isArray(intro) ? intro : [];
  const sectionBlocks = Array.isArray(sections) ? sections : [];
  const faqRaw = t.raw("faqStructured");
  const faqPairs = Array.isArray(faqRaw) ? faqRaw : [];

  return (
    <>
      <SeoBreadcrumbs
        homeLabel={tCommon("breadcrumbHome")}
        currentLabel={t("h1")}
      />
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <Link
            href="/blog"
            className="text-brand-navy underline decoration-brand-navy/35 underline-offset-4 hover:text-brand-lime"
          >
            {tBlog("breadcrumb")}
          </Link>
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {t("h1")}
        </h1>
        <p className="mt-3 text-sm font-medium text-zinc-500">{t("kicker")}</p>

        <div className="prose prose-zinc prose-lg mt-10 max-w-none prose-headings:scroll-mt-24 prose-a:text-brand-navy prose-a:underline prose-a:decoration-brand-navy/35 prose-a:underline-offset-4 hover:prose-a:text-brand-lime hover:prose-a:decoration-brand-lime/50">
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

        {faqPairs.length > 0 && (
          <section
            className="mt-12 border-t border-zinc-200 pt-10"
            aria-labelledby="blog-faq-title"
          >
            <h2
              id="blog-faq-title"
              className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl"
            >
              {t("faqSectionTitle")}
            </h2>
            <div className="mt-8 space-y-9">
              {faqPairs.map((item, idx) => (
                <div key={`faq-${idx}`}>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-700">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {pillarHref ? (
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-zinc-700">
              {t("pillarTeaser")}{" "}
              <Link
                href={pillarHref}
                className="font-semibold text-brand-navy underline decoration-brand-navy/35 underline-offset-4 hover:text-brand-lime"
              >
                {t("pillarLinkLabel")}
              </Link>
            </p>
          </div>
        ) : null}

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
      </article>
    </>
  );
}
