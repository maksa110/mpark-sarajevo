import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SEO_SLUGS } from "@/lib/seo-routes";

const linkClass =
  "font-medium text-brand-navy underline-offset-4 transition hover:text-brand-lime hover:underline";

const HUB_LINKS = [
  { href: SEO_SLUGS.parkingPrices, msgKey: "linkPrices" },
  { href: SEO_SLUGS.transfer, msgKey: "linkTransfer" },
  { href: SEO_SLUGS.vsPublic, msgKey: "linkCompare" },
  { href: SEO_SLUGS.faqAirport, msgKey: "linkFaq" },
  { href: SEO_SLUGS.directionsAirport, msgKey: "linkDirections" },
  { href: SEO_SLUGS.longTermParking, msgKey: "linkLongTerm" },
  { href: SEO_SLUGS.reservation, msgKey: "linkBook" },
];

/**
 * Jedan prirodni blok internih linkova (homepage hub → sve SEO guide stranice).
 */
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
