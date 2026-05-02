import { SITE } from "@/lib/site";

/** Kanonski origin (NEXT_PUBLIC_SITE_URL) — bez oslanjanja na Host zahtjeva (SEO). */
const base = SITE.url.replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
