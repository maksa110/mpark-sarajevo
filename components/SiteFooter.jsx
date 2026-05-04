"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SITE, calendarYearSarajevo } from "@/lib/site";
import Reveal from "@/components/Reveal";

const NAV = [
  { hash: "home", key: "home", isRoot: true },
  { hash: "services", key: "services", isRoot: false },
  { hash: "prices", key: "prices", isRoot: false },
  { hash: "how-it-works", key: "howItWorks", isRoot: false },
  { hash: "location", key: "location", isRoot: false },
  { hash: "gallery", key: "gallery", isRoot: false },
  { hash: "contact", key: "contact", isRoot: false },
  { hash: "book", key: "book", isRoot: false },
];

const GUIDES = [
  { href: "/parking-aerodrom-sarajevo-cijene", msgKey: "prices" },
  { href: "/transfer-aerodrom-sarajevo", msgKey: "transfer" },
  { href: "/privatni-vs-javni-parking-sarajevo", msgKey: "vsPublic" },
  { href: "/rezervacija", msgKey: "reservation" },
];

export default function SiteFooter() {
  const t = useTranslations("footer");
  const tSite = useTranslations("site");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const year = calendarYearSarajevo();

  const linkClass =
    "inline-block text-sm text-zinc-300 transition duration-200 hover:translate-x-0.5 hover:text-brand-lime motion-reduce:transition-none motion-reduce:hover:translate-x-0";

  function NavLink({ item }) {
    if (item.hash === "book") {
      if (isHome) {
        return (
          <a href="#book" className={linkClass}>
            {t(`nav.${item.key}`)}
          </a>
        );
      }
      return (
        <Link
          href={{ pathname: "/rezervacija", hash: "book" }}
          className={linkClass}
        >
          {t(`nav.${item.key}`)}
        </Link>
      );
    }

    if (item.isRoot) {
      if (isHome) {
        return (
          <a href="#home" className={linkClass}>
            {t(`nav.${item.key}`)}
          </a>
        );
      }
      return (
        <Link href="/" className={linkClass}>
          {t(`nav.${item.key}`)}
        </Link>
      );
    }

    if (isHome) {
      return (
        <a href={`#${item.hash}`} className={linkClass}>
          {t(`nav.${item.key}`)}
        </a>
      );
    }

    return (
      <Link href={{ pathname: "/", hash: item.hash }} className={linkClass}>
        {t(`nav.${item.key}`)}
      </Link>
    );
  }

  return (
    <footer className="border-t border-white/5 bg-brand-navy-950 text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label={`${SITE.brand} – ${tSite("tagline")}`}
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10 transition group-hover:ring-brand-lime/50">
                <Image
                  src="/logo.png"
                  alt=""
                  width={120}
                  height={120}
                  sizes="48px"
                  loading="lazy"
                  className="h-12 w-12 object-cover"
                />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight text-white">
                  {SITE.brand}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-lime/85">
                  {t("brandSubtitle")}
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              {tSite("tagline")}
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t("navHeading")}
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV.map((item) => (
                <li key={item.hash}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160} className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t("guidesHeading")}
            </h3>
            <ul className="mt-4 space-y-3">
              {GUIDES.map((g) => (
                <li key={g.href}>
                  <Link href={g.href} className={linkClass}>
                    {t(`guides.${g.msgKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={220} className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t("contactHeading")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                  aria-hidden
                />
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="text-zinc-300 transition hover:text-white"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                  aria-hidden
                />
                <a
                  href={`mailto:${SITE.email}`}
                  className="break-all text-zinc-300 transition hover:text-white"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime"
                  aria-hidden
                />
                <address className="not-italic leading-snug text-zinc-300">
                  {SITE.addressShort}
                  <span className="mt-1 block text-xs text-zinc-400">
                    {tSite("addressNote")}
                  </span>
                </address>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.brand}. {t("rights")}
          </p>
          {isHome ? (
            <a
              href="#book"
              className="text-left text-sm font-semibold text-brand-lime transition hover:text-brand-lime-300 sm:text-right"
            >
              {t("ctaShort")}
            </a>
          ) : (
            <Link
              href={{ pathname: "/rezervacija", hash: "book" }}
              className="text-left text-sm font-semibold text-brand-lime transition hover:text-brand-lime-300 sm:text-right"
            >
              {t("ctaShort")}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
