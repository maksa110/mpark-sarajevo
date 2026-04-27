import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/site";
import Reveal from "@/components/Reveal";

const NAV = [
  { href: "#home", key: "home" },
  { href: "#services", key: "services" },
  { href: "#prices", key: "prices" },
  { href: "#how-it-works", key: "howItWorks" },
  { href: "#location", key: "location" },
  { href: "#gallery", key: "gallery" },
  { href: "#contact", key: "contact" },
  { href: "#book", key: "book" },
];

export default function SiteFooter() {
  const t = useTranslations("footer");
  const tSite = useTranslations("site");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-brand-navy-950 text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <Reveal className="lg:col-span-2">
            <a
              href="#home"
              className="group inline-flex items-center gap-3"
              aria-label={`${SITE.brand} – ${tSite("tagline")}`}
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10 transition group-hover:ring-brand-lime/50">
                <Image
                  src="/logo.png"
                  alt="M Park Sarajevo logo"
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight text-white">
                  {SITE.brand}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-lime/85">
                  Parking Aerodrom Sarajevo
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              {tSite("tagline")}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t("navHeading")}
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block text-sm text-zinc-300 transition duration-200 hover:translate-x-0.5 hover:text-brand-lime motion-reduce:transition-none motion-reduce:hover:translate-x-0"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={220}>
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
                  <div className="text-xs text-zinc-400">
                    {tSite("addressNote")}
                  </div>
                </address>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.brand}. {t("rights")}
          </p>
          <a
            href="#book"
            className="text-left text-sm font-semibold text-brand-lime transition hover:text-brand-lime-300 sm:text-right"
          >
            {t("ctaShort")}
          </a>
        </div>
      </div>
    </footer>
  );
}
