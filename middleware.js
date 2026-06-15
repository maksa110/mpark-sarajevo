import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  LOCALE_HINT_COOKIE,
  LOCALE_HINT_DISMISSED_COOKIE,
  LOCALE_PREFERRED_COOKIE,
  localeCookieOptions,
  LOCALE_HINT_MAX_AGE,
} from "./lib/i18n-cookies";
import {
  getCountryFromRequest,
  isDefaultLocaleEntryPath,
  localeFromCountry,
} from "./lib/i18n-geo";

const intlMiddleware = createMiddleware(routing);

/** Production deployment URL → www (isti kanon kao vercel.json — nikad www→apex dok je www Primary na Vercelu). */
const PRIMARY_HOST = "www.mpark-sarajevo.com";

function attachLocaleHint(request, response) {
  if (request.method !== "GET") return response;

  const { pathname } = request.nextUrl;
  if (!isDefaultLocaleEntryPath(pathname)) return response;

  if (
    request.cookies.get(LOCALE_PREFERRED_COOKIE)?.value ||
    request.cookies.get(LOCALE_HINT_DISMISSED_COOKIE)?.value
  ) {
    return response;
  }

  const country = getCountryFromRequest(request);
  const suggested = localeFromCountry(country);

  if (suggested === routing.defaultLocale) return response;

  response.cookies.set(
    LOCALE_HINT_COOKIE,
    suggested,
    localeCookieOptions(LOCALE_HINT_MAX_AGE)
  );

  return response;
}

export default function middleware(request) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (
    host.endsWith(".vercel.app") &&
    process.env.VERCEL_ENV === "production"
  ) {
    const url = request.nextUrl.clone();
    url.hostname = PRIMARY_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}`;
    return NextResponse.redirect(url, 301);
  }

  const response = intlMiddleware(request);
  return attachLocaleHint(request, response);
}

export const config = {
  // Match all paths except /api, /admin (legacy), Next internals,
  // static files and special SEO/PWA assets that must stay at root.
  matcher: [
    "/((?!api|_next|_vercel|admin|sitemap.xml|robots.txt|site.webmanifest|favicon.svg|favicon.ico|.*\\..*).*)",
  ],
};
