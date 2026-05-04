"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SEO_SLUGS } from "@/lib/seo-routes";

function matchesPath(pathname, href) {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SeoTopicNav() {
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");
  const tSeoNav = useTranslations("seoTopicNav");

  const items = [
    {
      href: "/",
      label: tCommon("breadcrumbHome"),
      match: matchesPath(pathname, "/"),
    },
    {
      href: `/${SEO_SLUGS.parkingPrices}`,
      label: tFooter("guides.prices"),
      match: matchesPath(pathname, `/${SEO_SLUGS.parkingPrices}`),
    },
    {
      href: `/${SEO_SLUGS.transfer}`,
      label: tFooter("guides.transfer"),
      match: matchesPath(pathname, `/${SEO_SLUGS.transfer}`),
    },
    {
      href: `/${SEO_SLUGS.vsPublic}`,
      label: tFooter("guides.vsPublic"),
      match: matchesPath(pathname, `/${SEO_SLUGS.vsPublic}`),
    },
    {
      href: `/${SEO_SLUGS.reservation}`,
      label: tFooter("guides.reservation"),
      match: matchesPath(pathname, `/${SEO_SLUGS.reservation}`),
    },
  ];

  return (
    <nav
      aria-label={tSeoNav("ariaLabel")}
      className="border-b border-zinc-200/90 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/85"
    >
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
        <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {items.map(({ href, label, match }) => (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                className={`inline-flex min-h-[40px] items-center rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wide ring-1 transition sm:text-[13px] ${
                  match
                    ? "bg-brand-navy text-brand-lime ring-brand-navy"
                    : "bg-zinc-50 text-zinc-700 ring-zinc-200 hover:bg-brand-lime/15 hover:ring-brand-lime/50"
                }`}
                aria-current={match ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
