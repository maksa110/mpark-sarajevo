import { Camera, MapPin, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

const ICONS = { security: Shield, near: MapPin, cctv: Camera };
const KEYS = ["security", "near", "cctv"];

export default function Trust() {
  const t = useTranslations("trust");

  return (
    <section
      id="services"
      className="scroll-mt-20 border-b border-zinc-200/80 bg-white py-16 sm:py-20"
      aria-labelledby="trust-h2"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal as="h2"
          id="trust-h2"
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
        <ul className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {KEYS.map((k, i) => {
            const Icon = ICONS[k];
            return (
              <Reveal
                as="li"
                key={k}
                delay={120 + i * 110}
                className="group rounded-2xl border border-zinc-100 bg-zinc-50/80 p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-lime-200 hover:bg-white hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="inline-flex rounded-2xl bg-lime-100 p-2.5 text-lime-700 transition duration-300 group-hover:scale-110 group-hover:bg-lime-200 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-900">
                  {t(`items.${k}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {t(`items.${k}.desc`)}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
