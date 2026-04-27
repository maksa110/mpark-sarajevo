"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeMeta } from "@/i18n/routing";

export default function LanguageSwitcher({ variant = "desktop" }) {
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  function selectLocale(next) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const current = localeMeta[locale] || localeMeta[routing.defaultLocale];

  const isMobile = variant === "mobile";
  const buttonBase = isMobile
    ? "flex w-full items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-base font-medium text-white"
    : "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-white/85 ring-1 ring-white/15 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/70";

  return (
    <div ref={wrapRef} className={`relative ${isMobile ? "w-full" : ""}`}>
      <button
        type="button"
        className={buttonBase}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span aria-hidden className="text-base leading-none">
          {current.flag}
        </span>
        <span className="uppercase tracking-wide">{locale}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className={
            isMobile
              ? "mt-2 space-y-1 rounded-xl border border-white/10 bg-brand-navy-950/95 p-1 backdrop-blur"
              : "absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-brand-navy-950/95 p-1 shadow-xl backdrop-blur"
          }
        >
          {routing.locales.map((loc) => {
            const meta = localeMeta[loc];
            const selected = loc === locale;
            return (
              <li key={loc}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={t("switchTo", { language: meta.label })}
                  onClick={() => selectLocale(loc)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "bg-white/10 text-white"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">
                    {meta.flag}
                  </span>
                  <span className="flex-1 font-medium">{meta.label}</span>
                  <span className="text-xs uppercase tracking-wide text-white/50">
                    {loc}
                  </span>
                  {selected && (
                    <Check className="h-4 w-4 text-brand-lime" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
