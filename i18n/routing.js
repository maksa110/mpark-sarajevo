import { defineRouting } from "next-intl/routing";
import { NEXT_INTL_PATHNAMES } from "@/lib/seo-routes";

export const routing = defineRouting({
  locales: ["bs", "en", "de"],
  defaultLocale: "bs",
  /** Bez Accept-Language/cookie auto-redirecta: `/` -> `/bs` (SEO primary). */
  localeDetection: false,
  /** Svi URL-ovi imaju prefiks (/bs, /en, /de). */
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365, // 1 godina
  },
  pathnames: NEXT_INTL_PATHNAMES,
  /**
   * Iskljuceno: HTTP `Link:` hreflang middleware duplikat i konflikt s Next.js metadata
   * (`alternates.languages` + konzistentni `x-default` -> `/bs`). Ostaje jedan pouzdan izvor + sitemap.
   * @see https://next-intl.dev/docs/routing/middleware#alternate-links
   */
  alternateLinks: false,
});

export const localeMeta = {
  bs: { label: "Bosanski", flag: "🇧🇦", htmlLang: "bs", ogLocale: "bs_BA" },
  en: { label: "English", flag: "🇬🇧", htmlLang: "en", ogLocale: "en_GB" },
  de: { label: "Deutsch", flag: "🇩🇪", htmlLang: "de", ogLocale: "de_DE" },
};
