import { Car, MousePointerClick, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

const ICONS = { book: MousePointerClick, drop: Car, fly: Plane };
const KEYS = ["book", "drop", "fly"];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-zinc-200/80 py-16 sm:py-20"
      aria-labelledby="how-h2"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal
          as="h2"
          id="how-h2"
          className="text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          {t("h2")}
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          className="mx-auto mt-3 max-w-2xl text-center text-zinc-600"
        >
          {t("lead")}
        </Reveal>
        <Reveal
          as="p"
          delay={200}
          className="mx-auto mt-2 max-w-2xl text-center text-sm text-zinc-500"
        >
          {t.rich("subRich", {
            em: (chunks) => (
              <span className="font-medium text-zinc-700">{chunks}</span>
            ),
          })}
        </Reveal>
        <ol className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {KEYS.map((k, i) => {
            const Icon = ICONS[k];
            return (
              <Reveal
                as="li"
                key={k}
                delay={200 + i * 130}
                className="group relative rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-lime-300 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-brand-lime shadow-md ring-1 ring-brand-lime/30 transition duration-300 group-hover:bg-brand-lime group-hover:text-brand-navy group-hover:shadow-brand-lime/40 motion-reduce:transition-none">
                  {i + 1}
                </span>
                <span className="mx-auto mt-4 inline-flex rounded-2xl bg-zinc-100 p-3 text-lime-700 transition duration-300 group-hover:scale-110 group-hover:bg-lime-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-900">
                  {t(`steps.${k}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {t(`steps.${k}.desc`)}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
