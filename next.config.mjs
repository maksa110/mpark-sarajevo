import createNextIntlPlugin from "next-intl/plugin";
import {
  listCannibalizationRedirects,
  listLegacySlugRedirects,
  NEXT_INTL_PATHNAMES,
  seoLocalizedSegment,
} from "./lib/seo-routes.js";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [68, 70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    const leg = listLegacySlugRedirects();
    const slugRedirects = leg.map(({ locale, fromSeg, toSeg }) => ({
      source: `/${locale}/${fromSeg}`,
      destination: `/${locale}/${toSeg}`,
      permanent: true,
    }));
    const cannibal = listCannibalizationRedirects().map(
      ({ locale, fromSeg, toSeg }) => ({
        source: `/${locale}/${fromSeg}`,
        destination: `/${locale}/${toSeg}`,
        permanent: true,
      })
    );
    return [...slugRedirects, ...cannibal];
  },
  async rewrites() {
    const localizedSlugs = [];

    for (const [pathnameKey, map] of Object.entries(NEXT_INTL_PATHNAMES)) {
      if (typeof map === "string") continue;

      for (const [locale, localizedPath] of Object.entries(map)) {
        const translatedSegment = String(localizedPath).replace(/^\//, "");
        const canonicalBsSegment = seoLocalizedSegment(pathnameKey, "bs");

        if (translatedSegment === canonicalBsSegment) continue;

        localizedSlugs.push({
          source: `/${locale}/${translatedSegment}`,
          destination: `/${locale}/${canonicalBsSegment}`,
        });
      }
    }

    return [
      { source: "/favicon.ico", destination: "/logo.png" },
      ...localizedSlugs,
    ];
  },
  async headers() {
    return [
      // Do not add security headers to Next internals, API, and files with an extension
      {
        source: "/((?!_next|_vercel|api|favicon|robots|sitemap|.*\\..*).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, max-age=0, must-revalidate",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
