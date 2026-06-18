import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function FaqSection() {
  const t = await getTranslations("faq");
  const raw = t.raw("items");
  const items = Array.isArray(raw) ? raw : [];

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-b border-zinc-200/80 py-16 sm:py-20"
      aria-labelledby="faq-h2"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal
          as="h2"
          id="faq-h2"
          className="text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          {t("h2")}
        </Reveal>
        <Reveal
          as="p"
          delay={100}
          className="mx-auto mt-3 max-w-xl text-center text-zinc-600"
        >
          {t("lead")}
        </Reveal>

        <div className="mt-10 space-y-3">
          {items.map((item, i) => (
            <Reveal
              key={item.q}
              delay={120 + i * 70}
              className="rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:shadow-md"
            >
              <details className="group rounded-2xl">
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-4 text-left transition-colors duration-200 hover:bg-zinc-50/60 sm:px-5">
                  <span className="pr-2 text-base font-medium text-zinc-900">
                    {item.q}
                  </span>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-all duration-300 group-open:rotate-180 group-open:bg-lime-100 group-open:text-lime-800"
                    aria-hidden
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-zinc-100 px-4 pb-4 pt-3 sm:px-5">
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {item.a}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
