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
  languages["x-default"] = languages[routing.defaultLocale]
    ? languages[routing.defaultLocale]
    : Object.values(languages)[0];
  return languages;
}
