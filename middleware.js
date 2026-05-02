import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Samo *.vercel.app (production): kanonski URL je apex u lib/site.js. */
const PRIMARY_HOST = "mpark-sarajevo.com";

export default function middleware(request) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  // www → apex radi Vercel `vercel.json` (edge) da ne dupliramo i da izbjegnemo sukobe s Domain podešavanjima.
  if (
    host.endsWith(".vercel.app") &&
    process.env.VERCEL_ENV === "production"
  ) {
    const url = request.nextUrl.clone();
    url.hostname = PRIMARY_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
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
