import { getRequestSiteOrigin } from "@/lib/request-site-origin";

export const dynamic = "force-dynamic";

export default async function robots() {
  const base = await getRequestSiteOrigin();
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
