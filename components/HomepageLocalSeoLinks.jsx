import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SEO_PILLARS, SEO_SLUGS } from "@/lib/seo-routes";

const linkClass =
  "font-medium text-brand-navy underline decoration-brand-navy/35 underline-offset-4 transition hover:text-brand-lime hover:decoration-brand-lime/50";

const HUB_LINKS = [
  { href: SEO_PILLARS.parkingPrices, msgKey: "linkPrices" },
  { href: SEO_PILLARS.secureParking, msgKey: "linkSafety" },
  { href: SEO_PILLARS.howParkingWorks, msgKey: "linkHow" },
  { href: SEO_PILLARS.parkingNear, msgKey: "linkLocation" },
  { href: SEO_SLUGS.blog, msgKey: "linkBlog" },
  { href: SEO_SLUGS.reservation, msgKey: "linkBook" },
];

export default async function HomepageLocalSeoLinks() {
  const t = await getTranslations("homeHub");

  return (
    <section
      className="border-b border-zinc-200/80 bg-zinc-50/50 py-7 sm:py-8"
      aria-labelledby="home-hub-h2"
    >
      <h2 id="home-hub-h2" className="sr-only">
        {t("heading")}
      </h2>
      <div className="mx-auto max-w-3xl px-4 text-center text-sm leading-relaxed text-zinc-600 sm:px-6">
        <p>
          <span className="font-semibold text-zinc-900">{t("brand")}</span>
          {" — "}
          {HUB_LINKS.map(({ href, msgKey }, index) => (
            <span key={href}>
              {index > 0 ? " · " : null}
              <Link href={href} className={linkClass}>
                {t(msgKey)}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
