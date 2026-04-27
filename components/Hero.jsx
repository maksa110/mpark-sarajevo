import Image from "next/image";
import { useTranslations } from "next-intl";
import { HERO_IMAGE } from "@/lib/site";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-24 sm:pb-20"
      aria-labelledby="hero-heading"
    >
      <Image
        src={HERO_IMAGE}
        alt={t("imageAlt")}
        fill
        priority
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

        <a
          href="#book"
          className="cta-pulse mt-10 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-brand-lime px-8 text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-xl shadow-brand-lime/30 transition duration-200 ease-out hover:scale-[1.03] hover:bg-brand-lime-300 hover:shadow-2xl hover:shadow-brand-lime/40 active:scale-[0.97] motion-safe:animate-fade-up motion-reduce:transition-none motion-reduce:hover:scale-100"
          style={{ animationDelay: "560ms" }}
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
