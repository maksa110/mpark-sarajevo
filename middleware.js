import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Kanonski host (apex); deployment i www ne smiju biti paralelna „kopija“ sajta. */
const PRIMARY_HOST = "mpark-sarajevo.com";

export default function middleware(request) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (host && host !== PRIMARY_HOST) {
    if (host === "www.mpark-sarajevo.com") {
      const url = request.nextUrl.clone();
      url.hostname = PRIMARY_HOST;
      url.protocol = "https:";
      return NextResponse.redirect(url, 301);
    }
    if (
      host.endsWith(".vercel.app") &&
      process.env.VERCEL_ENV === "production"
    ) {
      const url = request.nextUrl.clone();
      url.hostname = PRIMARY_HOST;
      url.protocol = "https:";
      return NextResponse.redirect(url, 301);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all paths except /api, /admin (legacy), Next internals,
  // static files and special SEO/PWA assets that must stay at root.
  matcher: [
    "/((?!api|_next|_vercel|admin|sitemap.xml|robots.txt|site.webmanifest|favicon.svg|favicon.ico|.*\\..*).*)",
  ],
};
