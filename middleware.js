import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except /api, /admin (legacy), Next internals,
  // static files and special SEO/PWA assets that must stay at root.
  matcher: [
    "/((?!api|_next|_vercel|admin|sitemap.xml|robots.txt|site.webmanifest|favicon.svg|favicon.ico|.*\\..*).*)",
  ],
};
