"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_ITEMS = [
  { id: "home", key: "home" },
  { id: "services", key: "services" },
  { id: "how-it-works", key: "howItWorks" },
  { id: "prices", key: "prices" },
  { id: "location", key: "location" },
  { id: "gallery", key: "gallery" },
  { id: "contact", key: "contact" },
];

export default function Header() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) =>
      document.getElementById(id)
    ).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function close() {
    setOpen(false);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-brand-navy/85 backdrop-blur-md supports-[backdrop-filter]:bg-brand-navy/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <a
          href="#home"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-95"
          aria-label={t("logoAria")}
          onClick={close}
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/15 transition duration-300 group-hover:ring-brand-lime/50 motion-reduce:transition-none">
            <Image
              src="/logo.png"
              alt="M Park Sarajevo logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10 transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-wide text-white">
              M Park
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-lime/90">
              Sarajevo
            </span>
          </span>
        </a>

        <nav aria-label={t("navAria")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({ id, key }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`nav-underline relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/70 ${
                      isActive
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {t(`nav.${key}`)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher variant="desktop" />
          </div>
          <a
            href="#book"
            className="hidden min-h-[44px] items-center rounded-2xl bg-brand-lime px-5 text-sm font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/30 ring-1 ring-brand-lime/60 transition duration-200 ease-out hover:scale-[1.04] hover:bg-brand-lime-300 hover:shadow-brand-lime/45 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:inline-flex"
          >
            {t("cta")}
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/90 ring-1 ring-white/20 transition hover:bg-white/10 md:hidden"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 top-[57px] z-40 bg-zinc-950/40 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
        onClick={close}
      />

      <nav
        id="mobile-nav"
        aria-label={t("mobileNavAria")}
        className={`absolute inset-x-0 top-full z-50 origin-top border-b border-white/10 bg-brand-navy/95 backdrop-blur-md transition md:hidden ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_ITEMS.map(({ id, key }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={close}
                  aria-current={isActive ? "page" : undefined}
                  className={`block rounded-xl px-3 py-3 text-base font-medium transition ${
                    isActive
                      ? "bg-brand-lime/15 text-white ring-1 ring-brand-lime/30"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {t(`nav.${key}`)}
                </a>
              </li>
            );
          })}
          <li className="mt-2">
            <LanguageSwitcher variant="mobile" />
          </li>
          <li className="mt-2">
            <a
              href="#book"
              onClick={close}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-lime text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/25 transition hover:bg-brand-lime-300 active:scale-[0.99]"
            >
              {t("cta")}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
