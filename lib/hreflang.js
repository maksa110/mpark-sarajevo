import { routing, localeMeta } from "@/i18n/routing";
import { SITE } from "@/lib/site";

/**
 * hreflang mapa: bs-BA, en-GB, de-DE + x-default → defaultLocale (/bs).
 * @param {(locale: string) => string} pathForLocale Vraća putanju s vodećom kosom crtom, npr. `/bs/blog/...`
 */
export function buildHreflangAlternates(pathForLocale) {
  const origin = SITE.url.replace(/\/$/, "");
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      localeMeta[locale]?.htmlLang || locale,
      `${origin}${pathForLocale(locale)}`,
    ])
  );
  const defaultHreflang =
    localeMeta[routing.defaultLocale]?.htmlLang || routing.defaultLocale;
  languages["x-default"] = languages[defaultHreflang]
    ? languages[defaultHreflang]
    : Object.values(languages)[0];
  return languages;
}
