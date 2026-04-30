import { headers } from "next/headers";
import { SITE } from "@/lib/site";

/** Origin bez trailing slash: isti host kao u adresnoj traci (za sitemap/robots u GSC). */
export async function getRequestSiteOrigin() {
  const h = await headers();
  const hostHeader = h.get("x-forwarded-host") || h.get("host");
  const host = hostHeader?.split(",")[0]?.trim();
  const proto =
    h.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  if (!host) {
    return SITE.url.replace(/\/$/, "");
  }
  try {
    return new URL(`${proto}://${host}`).origin;
  } catch {
    return SITE.url.replace(/\/$/, "");
  }
}
