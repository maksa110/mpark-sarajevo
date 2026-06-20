import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SEO_SLUGS } from "@/lib/seo-routes";
import HeaderMobileClient from "@/components/HeaderMobileClient";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NAV_ITEMS = [
  { id: "home", key: "home" },
  { id: "services", key: "services" },
  { id: "how-it-works", key: "howItWorks" },
  { id: "prices", key: "prices" },
  { id: "location", key: "location" },
  { id: "gallery", key: "gallery" },
  { id: "contact", key: "contact" },
];

const bookLinkCommon =
  "min-h-[44px] items-center rounded-2xl bg-brand-lime px-5 text-sm font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/30 ring-1 ring-brand-lime/60 transition duration-200 ease-out hover:scale-[1.04] hover:bg-brand-lime-300 hover:shadow-brand-lime/45 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100";

export default async function Header({
  isHome = false,
  currentPathnameKey = "/",
  locale = "bs",
}) {
  const t = await getTranslations("header");
  function NavTarget({ id, navKey, className }) {
    const label = t(`nav.${navKey}`);

    if (id === "home") {
      if (isHome) {
        return (
          <a href="#home" className={className}>
            {label}
          </a>
        );
      }

      return (
        <Link href="/" className={className}>
          {label}
        </Link>
      );
    }

    if (isHome) {
      return (
        <a href={`#${id}`} className={className}>
          {label}
        </a>
      );
    }

    return (
      <Link href={{ pathname: "/", hash: id }} className={className}>
        {label}
      </Link>
    );
  }

  const logoClass =
    "group flex items-center gap-2.5 transition-opacity hover:opacity-95";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-brand-navy/85 backdrop-blur-md supports-[backdrop-filter]:bg-brand-navy/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {isHome ? (
          <a href="#home" className={logoClass} aria-label={t("logoAria")}>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/15 transition duration-300 group-hover:ring-brand-lime/50 motion-reduce:transition-none">
              <Image
                src="/logo.png"
                alt=""
                width={120}
                height={120}
                sizes="40px"
                className="h-10 w-10 object-cover"
              />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-base font-bold tracking-wide text-white">
                M Park
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-lime/90">
                Sarajevo
              </span>
            </span>
          </a>
        ) : (
          <Link href="/" className={logoClass} aria-label={t("logoAria")}>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/15 transition duration-300 group-hover:ring-brand-lime/50 motion-reduce:transition-none">
              <Image
                src="/logo.png"
                alt=""
                width={120}
                height={120}
                sizes="40px"
                className="h-10 w-10 object-cover"
              />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-base font-bold tracking-wide text-white">
                M Park
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-lime/90">
                Sarajevo
              </span>
            </span>
          </Link>
        )}

        <nav aria-label={t("navAria")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({ id, key }) => (
              <li key={id}>
                <NavTarget
                  id={id}
                  navKey={key}
                  className="nav-underline relative rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/70"
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher variant="desktop" />
          {isHome ? (
            <a href="#book" className={`inline-flex ${bookLinkCommon}`}>
              {t("cta")}
            </a>
          ) : (
            <Link
              href={{ pathname: SEO_SLUGS.reservation, hash: "book" }}
              className={`inline-flex ${bookLinkCommon}`}
            >
              {t("cta")}
            </Link>
          )}
        </div>

        <HeaderMobileClient
          isHome={isHome}
          navItems={NAV_ITEMS}
        />
      </div>
    </header>
  );
}
