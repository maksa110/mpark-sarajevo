import { SITE } from "@/lib/site";

const base = SITE.url.replace(/\/$/, "");
const sharedDisallow = ["/admin", "/admin/", "/api/"];
const explicitlyAllowedAgents = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "Googlebot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-User",
  "Claude-SearchBot",
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: sharedDisallow,
      },
      ...explicitlyAllowedAgents.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: sharedDisallow,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
