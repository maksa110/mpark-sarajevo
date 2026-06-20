import { defineRouting } from "next-intl/routing";
import { NEXT_INTL_PATHNAMES } from "@/lib/seo-routes";

export const routing = defineRouting({
  locales: ["bs", "en", "de"],
  defaultLocale: "bs",
  // Without Accept-Language or cookie redirects: `/` resolves to `/bs`.
  localeDetection: false,
  // All localized routes keep an explicit prefix: /bs, /en, /de.
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
  pathnames: NEXT_INTL_PATHNAMES,
  // Keep hreflang in one place via Next metadata + sitemap, without HTTP Link duplicates.
  alternateLinks: false,
});

export const localeMeta = {
  bs: {
    label: "Bosanski",
    flag: "\uD83C\uDDE7\uD83C\uDDE6",
    htmlLang: "bs-BA",
    ogLocale: "bs_BA",
  },
  en: {
    label: "English",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
    htmlLang: "en-GB",
    ogLocale: "en_GB",
  },
  de: {
    label: "Deutsch",
    flag: "\uD83C\uDDE9\uD83C\uDDEA",
    htmlLang: "de-DE",
    ogLocale: "de_DE",
  },
};
