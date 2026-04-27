import Image from "next/image";
import { Star, ExternalLink, ShieldCheck, MessageSquareDashed } from "lucide-react";
import { getLocale, getTranslations, getFormatter } from "next-intl/server";
import { getGoogleReviews } from "@/lib/google-reviews";
import { SITE } from "@/lib/site";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Reveal from "@/components/Reveal";

const LOCALE_TO_INTL = { bs: "bs-BA", en: "en-GB", de: "de-DE" };

function StarRow({ value, label }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div
      className="inline-flex items-center gap-0.5 text-amber-500"
      role="img"
      aria-label={label}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-4 w-4 ${
            i < v ? "fill-amber-500" : "fill-transparent"
          } stroke-amber-500`}
          strokeWidth={1.75}
        />
      ))}
    </div>
  );
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .replace(/[^A-Za-zĆČĐŠŽćčđšžÄÖÜäöüß]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

export default async function Reviews() {
  const locale = await getLocale();
  const t = await getTranslations("reviews");
  const data = await getGoogleReviews();
  const profileUrl = data?.profileUrl || SITE.googleProfileUrl;
  const intlTag = LOCALE_TO_INTL[locale] || "bs-BA";

  return (
    <section
      id="reviews"
      className="scroll-mt-20 border-b border-zinc-200/80 py-16 sm:py-20"
      aria-labelledby="rev-h2"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              <ShieldCheck
                className="h-3.5 w-3.5 text-lime-600"
                aria-hidden
              />
              {t("badge")}
            </p>
            <h2
              id="rev-h2"
              className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
            >
              {t("h2")}
            </h2>
            <p className="mt-3 text-zinc-600">
              {t.rich("leadRich", {
                em: (chunks) => (
                  <span className="font-medium text-zinc-800">{chunks}</span>
                ),
              })}
            </p>
          </Reveal>

          {data?.aggregateRating != null && (
            <Reveal delay={150}>
              <RatingSummary
                rating={data.aggregateRating}
                total={data.userRatingsTotal}
                profileUrl={profileUrl}
                intlTag={intlTag}
              />
            </Reveal>
          )}
        </div>

        {data && Array.isArray(data.reviews) && data.reviews.length > 0 ? (
          <ReviewsGrid reviews={data.reviews} intlTag={intlTag} />
        ) : (
          <EmptyState profileUrl={profileUrl} />
        )}

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">{t("googleProfileFooter")}</p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:shadow"
          >
            {t("googleProfileLink")}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

async function RatingSummary({ rating, total, profileUrl, intlTag }) {
  const t = await getTranslations("reviews");
  const formatter = await getFormatter();
  const formatted = Number(rating).toFixed(1);
  const totalFormatted = total != null ? formatter.number(total) : null;
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group inline-flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-3 shadow-sm transition hover:border-zinc-300 hover:shadow"
      aria-label={t("ratingAria", {
        rating: formatted,
        total: total != null ? totalFormatted : "none",
      })}
    >
      <span className="text-3xl font-semibold tracking-tight text-zinc-900">
        {formatted}
        <span className="text-base font-normal text-zinc-400">/5</span>
      </span>
      <span className="flex flex-col">
        <StarRow
          value={Math.round(rating)}
          label={t("starsAria", { rating: formatted })}
        />
        {total != null && (
          <span className="mt-1 text-xs text-zinc-500">
            {t("ratingTotal", { count: total })}
          </span>
        )}
      </span>
    </a>
  );
}

async function ReviewsGrid({ reviews, intlTag }) {
  const t = await getTranslations("reviews");
  const items = reviews.map((r) => ({
    review: r,
    dateLabel: formatReviewDate(r, intlTag),
    labels: {
      avatarAlt: t("avatarAlt", { name: r.authorName }),
      authorAria: t("authorAria", { name: r.authorName }),
      starsAria: t("starsAria", { rating: r.rating }),
      verifiedTag: t("verifiedTag"),
      verifiedTitle: t("verifiedTitle"),
      noText: t("noTextPlaceholder"),
    },
  }));

  return (
    <ReviewsCarousel
      prevLabel={t("scrollPrev")}
      nextLabel={t("scrollNext")}
    >
      {items.map(({ review, dateLabel, labels }, i) => (
        <li
          key={`${review.authorName}-${review.time || i}`}
          className="snap-start shrink-0 basis-[85%] sm:basis-[48%] lg:basis-[32%]"
        >
          <ReviewCard review={review} dateLabel={dateLabel} labels={labels} />
        </li>
      ))}
    </ReviewsCarousel>
  );
}

function ReviewCard({ review, dateLabel, labels }) {
  const hasText = Boolean(review.text);
  return (
    <article
      className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      lang={review.language || undefined}
    >
      <header className="flex items-center gap-3">
        <Avatar
          name={review.authorName}
          src={review.profilePhotoUrl}
          href={review.authorUrl}
          ariaAlt={labels.avatarAlt}
          authorAria={labels.authorAria}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {review.authorName}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
            <StarRow value={review.rating} label={labels.starsAria} />
            {dateLabel && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={review.isoDate || undefined}>{dateLabel}</time>
              </>
            )}
          </div>
        </div>
        <span
          className="ml-auto inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-lime-50 px-2 text-[11px] font-medium text-lime-700 ring-1 ring-lime-200"
          title={labels.verifiedTitle}
        >
          <ShieldCheck className="h-3 w-3" aria-hidden />
          {labels.verifiedTag}
        </span>
      </header>

      {hasText ? (
        <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-zinc-700">
          <p>&ldquo;{review.text}&rdquo;</p>
        </blockquote>
      ) : (
        <div className="mt-4 flex flex-1 items-start gap-2 rounded-xl bg-zinc-50 px-4 py-3 text-[13px] italic leading-relaxed text-zinc-500">
          <MessageSquareDashed
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
            aria-hidden
          />
          <p>{labels.noText}</p>
        </div>
      )}
    </article>
  );
}

function formatReviewDate(review, intlTag) {
  if (review.relativeTime) return review.relativeTime;
  if (review.time) {
    try {
      return new Intl.DateTimeFormat(intlTag, {
        year: "numeric",
        month: "long",
      }).format(new Date(review.time * 1000));
    } catch {
      return null;
    }
  }
  return null;
}

function Avatar({ name, src, href, ariaAlt, authorAria }) {
  const initials = getInitials(name);
  const inner = src ? (
    <Image
      src={src}
      alt={ariaAlt}
      width={40}
      height={40}
      loading="lazy"
      sizes="40px"
      className="h-10 w-10 rounded-full object-cover"
      unoptimized
    />
  ) : (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-sm font-bold text-lime-700"
    >
      {initials}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label={authorAria}
        className="shrink-0"
      >
        {inner}
      </a>
    );
  }
  return <span className="shrink-0">{inner}</span>;
}

async function EmptyState({ profileUrl }) {
  const t = await getTranslations("reviews");
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
      <p className="mx-auto max-w-md text-sm text-zinc-600">{t("emptyText")}</p>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
      >
        {t("emptyCta")}
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}
