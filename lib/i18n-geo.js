import { routing } from "@/i18n/routing";

const COUNTRY_TO_LOCALE = {
  BA: "bs",
  US: "en",
  GB: "en",
  DE: "de",
  AT: "de",
  CH: "de",
};

/**
 * Soft geo → locale map. Fallback uvijek bosanski (SEO primary).
 * @param {string | null | undefined} country ISO 3166-1 alpha-2
 * @returns {"bs"|"en"|"de"}
 */
export function localeFromCountry(country) {
  if (!country || typeof country !== "string") return routing.defaultLocale;
  const code = country.trim().toUpperCase();
  const locale = COUNTRY_TO_LOCALE[code];
  return routing.locales.includes(locale) ? locale : routing.defaultLocale;
}

/**
 * @param {import("next/server").NextRequest} request
 * @returns {string | undefined}
 */
export function getCountryFromRequest(request) {
  const header = request.headers.get("x-vercel-ip-country");
  if (header) return header;
  if (request.geo?.country) return request.geo.country;
  return undefined;
}

/** Samo početna bez locale prefiksa u URL-u (nakon intl redirecta: /bs). */
export function isDefaultLocaleEntryPath(pathname) {
  return (
    pathname === "/" ||
    pathname === "/bs" ||
    pathname === "/bs/"
  );
}
