"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SEO_SLUGS } from "@/lib/seo-routes";

const NAV_ITEMS = [
  { id: "home", key: "home" },
  { id: "services", key: "services" },
  { id: "how-it-works", key: "howItWorks" },
  { id: "prices", key: "prices" },
  { id: "location", key: "location" },
  { id: "gallery", key: "gallery" },
  { id: "contact", key: "contact" },
];

export default function HeaderMobileClient({
  isHome = false,
  localeLinks = [],
}) {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

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

  function close() {
    setOpen(false);
  }

  function NavTarget({ id, navKey }) {
    const label = t(`nav.${navKey}`);

    if (id === "home") {
      if (isHome) {
        return (
          <a
            href="#home"
            className="block rounded-xl px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
            onClick={close}
          >
            {label}
          </a>
        );
      }
      return (
        <Link
          href="/"
          className="block rounded-xl px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
          onClick={close}
        >
          {label}
        </Link>
      );
    }

    if (isHome) {
      return (
        <a
          href={`#${id}`}
          className="block rounded-xl px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
          onClick={close}
        >
          {label}
        </a>
      );
    }

    return (
      <Link
        href={{ pathname: "/", hash: id }}
        className="block rounded-xl px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
        onClick={close}
      >
        {label}
      </Link>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/90 ring-1 ring-white/20 transition hover:bg-white/10"
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
          {NAV_ITEMS.map(({ id, key }) => (
            <li key={id}>
              <NavTarget id={id} navKey={key} />
            </li>
          ))}
          {localeLinks.length > 0 ? (
            <li className="mt-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-1">
                {localeLinks.map((item) => (
                  <a
                    key={item.locale}
                    href={item.href}
                    onClick={close}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      item.selected
                        ? "bg-white/10 text-white"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span aria-hidden className="text-base leading-none">
                      {item.flag}
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    <span className="text-xs uppercase tracking-wide text-white/50">
                      {item.locale}
                    </span>
                  </a>
                ))}
              </div>
            </li>
          ) : null}
          <li className="mt-2">
            {isHome ? (
              <a
                href="#book"
                onClick={close}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-lime text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/25 transition hover:bg-brand-lime-300 active:scale-[0.99]"
              >
                {t("cta")}
              </a>
            ) : (
              <Link
                href={{ pathname: SEO_SLUGS.reservation, hash: "book" }}
                onClick={close}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-lime text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/25 transition hover:bg-brand-lime-300 active:scale-[0.99]"
              >
                {t("cta")}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
