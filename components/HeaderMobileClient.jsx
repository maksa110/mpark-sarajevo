"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SEO_SLUGS } from "@/lib/seo-routes";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HeaderMobileClient({
  isHome = false,
  navItems = [],
}) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
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

  function NavTarget({ id, navKey, className }) {
    const label = t(`nav.${navKey}`);

    if (id === "home") {
      if (isHome) {
        return (
          <a href="#home" className={className} onClick={close}>
            {label}
          </a>
        );
      }

      return (
        <Link href="/" className={className} onClick={close}>
          {label}
        </Link>
      );
    }

    if (isHome) {
      return (
        <a href={`#${id}`} className={className} onClick={close}>
          {label}
        </a>
      );
    }

    return (
      <Link
        href={{ pathname: "/", hash: id }}
        className={className}
        onClick={close}
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/90 ring-1 ring-white/20 transition hover:bg-white/10"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <Menu className="h-5 w-5" aria-hidden />
        )}
      </button>

      <div
        className={`fixed inset-0 top-[57px] z-40 bg-zinc-950/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
        onClick={close}
      />

      <nav
        id="mobile-nav"
        aria-label={t("mobileNavAria")}
        className={`absolute inset-x-0 top-full z-50 origin-top border-b border-white/10 bg-brand-navy/95 backdrop-blur-md transition ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {navItems.map(({ id, key }) => (
            <li key={id}>
              <NavTarget
                id={id}
                navKey={key}
                className="block rounded-xl px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
              />
            </li>
          ))}
          <li className="mt-2">
            <LanguageSwitcher variant="mobile" />
          </li>
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
    </div>
  );
}
