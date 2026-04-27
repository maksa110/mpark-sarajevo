import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bs", "en", "de"],
  defaultLocale: "bs",
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365, // 1 godina
  },
});

export const localeMeta = {
  bs: { label: "Bosanski", flag: "🇧🇦", htmlLang: "bs", ogLocale: "bs_BA" },
  en: { label: "English", flag: "🇬🇧", htmlLang: "en", ogLocale: "en_GB" },
  de: { label: "Deutsch", flag: "🇩🇪", htmlLang: "de", ogLocale: "de_DE" },
};
