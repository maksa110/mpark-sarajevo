import { useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";

const TIERS = [
  { key: "t1", features: ["cctv", "transferAirport", "online"] },
  { key: "t2", features: ["cctv", "transferAirport", "online"] },
  {
    key: "t3",
    features: ["cctv", "transferAirport", "online"],
    highlight: true,
  },
];

export default function PricingSection() {
  const t = useTranslations("pricing");
  const tCommon = useTranslations("common");
  const currency = tCommon("currency");

  return (
    <section
      id="prices"
      className="scroll-mt-20 border-b border-zinc-200/80 bg-white py-16 sm:py-20"
      aria-labelledby="pricing-h2"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal
          as="h2"
          id="pricing-h2"
          className="mb-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          {t("h2")}
        </Reveal>
        <Reveal as="p" delay={100} className="mb-10 max-w-2xl text-zinc-600">
          {t("lead")}
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((card, i) => {
            const title = t(`tiers.${card.key}.title`);
            const price = t(`tiers.${card.key}.price`);
            const tagline = t(`tiers.${card.key}.tagline`);

            return (
              <Reveal
                as="article"
                key={card.key}
                delay={120 + i * 90}
                className={`group relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  card.highlight
                    ? "z-10 border-brand-lime ring-2 ring-brand-lime/30 hover:ring-brand-lime/60 lg:-mt-2 lg:mb-2"
                    : "border-zinc-200 hover:border-lime-200"
                }`}
                aria-label={`${title} – ${price} ${t("perDay")}`}
              >
                {card.highlight && (
                  <span className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-navy px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-lime ring-1 ring-brand-lime/40 shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    {t("badgeBest")}
                  </span>
                )}

                <header className="text-center">
                  <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                  <p
                    className={`mt-1 text-xs font-medium uppercase tracking-wide ${
                      card.highlight ? "text-lime-700" : "text-zinc-500"
                    }`}
                  >
                    {tagline}
                  </p>
                </header>

                <div className="my-6 flex items-baseline justify-center gap-1.5">
                  <span
                    className={`text-5xl font-extrabold leading-none tracking-tight ${
                      card.highlight ? "text-lime-700" : "text-zinc-900"
                    }`}
                  >
                    {price}
                  </span>
                  <span className="text-base font-semibold text-zinc-500">
                    {t("perDay")}
                  </span>
                </div>

                <ul className="mb-7 flex flex-col gap-2.5 text-sm text-zinc-700">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          card.highlight
                            ? "bg-brand-lime text-brand-navy"
                            : "bg-lime-100 text-lime-700"
                        }`}
                        aria-hidden
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {t(`features.${f}`)}
                    </li>
                  ))}
                </ul>

                <a
                  href="#book"
                  className={`mt-auto inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
                    card.highlight
                      ? "bg-brand-lime text-brand-navy font-extrabold shadow-lg hover:bg-brand-lime-300 hover:shadow-brand-lime/40 focus-visible:ring-brand-lime/70"
                      : "bg-brand-navy text-white shadow hover:bg-brand-navy-950 focus-visible:ring-brand-navy/40"
                  }`}
                >
                  {t("ctaReserve")}
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal
          as="p"
          delay={420}
          className="mx-auto mt-8 max-w-3xl text-center text-sm text-zinc-500"
        >
          {t("noteHidden")}
        </Reveal>
      </div>
    </section>
  );
}
