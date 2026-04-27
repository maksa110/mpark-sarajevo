"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function FaqSection() {
  const t = useTranslations("faq");
  const raw = t.raw("items");
  const items = Array.isArray(raw) ? raw : [];
  const [open, setOpen] = useState(null);

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
        <Reveal as="p" delay={100} className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          {t("lead")}
        </Reveal>

        <div className="mt-10 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal
                key={item.q}
                delay={120 + i * 70}
                className={`rounded-2xl border bg-white shadow-sm transition duration-300 hover:shadow-md ${
                  isOpen
                    ? "border-lime-200 ring-1 ring-brand-lime/20"
                    : "border-zinc-200"
                }`}
              >
                <h3 className="text-base font-semibold text-zinc-900">
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-4 text-left transition-colors duration-200 hover:bg-zinc-50/60 sm:px-5"
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="pr-2 font-medium">{item.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 motion-reduce:transition-none ${
                        isOpen
                          ? "rotate-180 bg-lime-100 text-lime-800"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
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
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`border-t border-zinc-100 px-4 pb-4 pt-3 sm:px-5 ${
                        isOpen ? "" : "pointer-events-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-zinc-600">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
