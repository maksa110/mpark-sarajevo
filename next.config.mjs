import createNextIntlPlugin from "next-intl/plugin";
import {
  listCannibalizationRedirects,
  listLegacySlugRedirects,
  NEXT_INTL_PATHNAMES,
  seoLocalizedSegment,
} from "./lib/seo-routes.js";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");
const isDevelopment = process.env.NODE_ENV === "development";

const publicScriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(isDevelopment ? ["'unsafe-eval'"] : []),
  "https://www.googletagmanager.com",
  "https://googleads.g.doubleclick.net",
  "https://www.googleadservices.com",
  "https://vercel.live",
].join(" ");

const publicContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `script-src ${publicScriptSources}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com https://*.google.com https://*.google.ba https://*.doubleclick.net https://*.googleadservices.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://*.google.com https://*.google.ba https://*.doubleclick.net https://*.googleadservices.com https://vercel.live",
  "frame-src https://www.google.com https://maps.google.com https://vercel.live",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [68, 70, 75],
    minimumCacheTTL: 86400,
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
      // Public marketing HTML only; protected dashboards, API routes, and static files are excluded.
      {
        source:
          "/((?!_next|_vercel|api|admin|partner|favicon|robots|sitemap|.*\\..*).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, max-age=0, must-revalidate",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value: publicContentSecurityPolicy,
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
