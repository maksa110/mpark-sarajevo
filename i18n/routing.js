import { defineRouting } from "next-intl/routing";
import { NEXT_INTL_PATHNAMES } from "@/lib/seo-routes";

export const routing = defineRouting({
  locales: ["bs", "en", "de"],
  defaultLocale: "bs",
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365, // 1 godina
  },
  pathnames: NEXT_INTL_PATHNAMES,
  /**
   * Isključeno: HTTP `Link:` hreflang middleware duplikat i konflikt s Next.js metadata
   * (`alternates.languages` + konsistentni `x-default` → `/bs`). Preostaje jedan pouzdan izvor + sitemap.
   * @see https://next-intl.dev/docs/routing/middleware#alternate-links
   */
  alternateLinks: false,
});

export const localeMeta = {
  bs: { label: "Bosanski", flag: "🇧🇦", htmlLang: "bs", ogLocale: "bs_BA" },
  en: { label: "English", flag: "🇬🇧", htmlLang: "en", ogLocale: "en_GB" },
  de: { label: "Deutsch", flag: "🇩🇪", htmlLang: "de", ogLocale: "de_DE" },
};
