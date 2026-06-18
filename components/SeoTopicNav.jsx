import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SEO_PILLARS, SEO_SLUGS } from "@/lib/seo-routes";

export default function SeoTopicNav({ currentPathnameKey }) {
  const t = useTranslations("seoPillarNav");
  const tFooter = useTranslations("footer");
  const tSeoNav = useTranslations("seoTopicNav");

  const items = [
    { pathname: "/", label: t("home"), match: currentPathnameKey === "/" },
    {
      pathname: SEO_PILLARS.parkingPrices,
      label: t("prices"),
      match: currentPathnameKey === SEO_PILLARS.parkingPrices,
    },
    {
      pathname: SEO_PILLARS.secureParking,
      label: t("safety"),
      match: currentPathnameKey === SEO_PILLARS.secureParking,
    },
    {
      pathname: SEO_PILLARS.howParkingWorks,
      label: t("howItWorks"),
      match: currentPathnameKey === SEO_PILLARS.howParkingWorks,
    },
    {
      pathname: SEO_PILLARS.parkingNear,
      label: t("location"),
      match: currentPathnameKey === SEO_PILLARS.parkingNear,
    },
    {
      pathname: SEO_SLUGS.blog,
      label: tFooter("guides.blog"),
      match: currentPathnameKey === SEO_SLUGS.blog,
    },
    {
      pathname: SEO_SLUGS.reservation,
      label: tFooter("guides.reservation"),
      match: currentPathnameKey === SEO_SLUGS.reservation,
    },
  ];

  return (
    <nav
      aria-label={tSeoNav("ariaLabel")}
      className="border-b border-zinc-200/90 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/85"
    >
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
        <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {items.map(({ pathname: ph, label, match }) => (
            <li key={ph} className="shrink-0">
              <Link
                href={ph}
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
