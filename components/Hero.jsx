import Image from "next/image";
import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HERO_IMAGE, SITE } from "@/lib/site";

function WhatsAppIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ViberIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M18.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Server Component: manje JS za above-the-fold, brže slaganje kritičnog LCP kadra.
 */
export default async function Hero() {
  const t = await getTranslations("hero");
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    t("whatsappPrefill")
  )}`;

  return (
    <section
      id="home"
      className="relative flex min-h-[88svh] flex-col justify-center px-4 pt-20 pb-16 text-center sm:min-h-[100svh] sm:px-6 sm:pt-24 sm:pb-20"
      aria-labelledby="hero-heading"
    >
      <Image
        src={HERO_IMAGE}
        alt={t("imageAlt")}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-brand-navy/60" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/25 to-brand-navy/50"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl">
        <p
          className="text-2xl font-bold tracking-[0.2em] text-white motion-safe:animate-fade-up sm:text-3xl md:text-4xl"
          style={{ animationDelay: "60ms" }}
        >
          {t("kicker")}
        </p>
        <h1
          id="hero-heading"
          className="mt-8 text-3xl font-semibold leading-tight tracking-tight text-white motion-safe:animate-fade-up sm:text-4xl sm:leading-[1.15] md:text-5xl"
          style={{ animationDelay: "160ms" }}
        >
          {t("h1")}
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 motion-safe:animate-fade-up sm:text-lg"
          style={{ animationDelay: "260ms" }}
        >
          {t("lead")}
        </p>
        <p
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 motion-safe:animate-fade-up sm:text-base"
          style={{ animationDelay: "340ms" }}
        >
          {t("sub")}
        </p>

        <div
          className="mx-auto mt-7 flex max-w-2xl flex-col items-center justify-center gap-4 motion-safe:animate-fade-up sm:flex-row sm:gap-6"
          style={{ animationDelay: "440ms" }}
        >
          <div className="inline-flex items-baseline gap-2 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 motion-reduce:transition-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/75">
              {t("priceLabel")}
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              {t("priceValue")}
            </span>
            <span className="text-sm font-semibold text-white/80">
              {t("priceUnit")}
            </span>
          </div>
          <ul className="w-full max-w-xl space-y-2 rounded-2xl bg-black/20 px-5 py-4 text-left text-sm text-white/90 ring-1 ring-white/10 backdrop-blur sm:flex-1">
            {["security", "near", "online"].map((k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-0.5 text-brand-lime" aria-hidden>
                  ✓
                </span>
                <span>{t(`bullets.${k}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-10 flex flex-col items-center gap-4 motion-safe:animate-fade-up motion-reduce:transition-none"
          style={{ animationDelay: "560ms" }}
        >
          <a
            href="#book"
            className="cta-pulse inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-brand-lime px-8 text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-xl shadow-brand-lime/30 transition duration-200 ease-out hover:scale-[1.03] hover:bg-brand-lime-300 hover:shadow-2xl hover:shadow-brand-lime/40 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            {t("cta")}
          </a>
          <a
            href={`tel:${SITE.phoneTel}`}
            aria-label={t("phoneAria")}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-white/10 px-5 text-base font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15 hover:ring-white/30 motion-reduce:transition-none"
          >
            <Phone className="h-5 w-5 shrink-0 text-brand-lime" aria-hidden />
            {SITE.phoneDisplay}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("whatsappAria")}
            title={t("whatsappLabel")}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-white/10 px-5 text-base font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15 hover:ring-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/70 motion-reduce:transition-none"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#86efac]" />
            {t("whatsappLabel")}
          </a>
          <a
            href={SITE.viberUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("viberAria")}
            title={t("viberLabel")}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-white/10 px-5 text-base font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15 hover:ring-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/70 motion-reduce:transition-none"
          >
            <ViberIcon className="h-5 w-5 shrink-0 text-[#c4b5fd]" />
            {t("viberLabel")}
          </a>
        </div>
      </div>
    </section>
  );
}
