import { BLOG_ARTICLE_LIST } from "@/lib/blog-routes";
import {
  listCannibalizationRedirects,
  listLegacySlugRedirects,
  NEXT_INTL_PATHNAMES,
  seoPagePath,
} from "@/lib/seo-routes";

const LOCALES = ["bs", "en", "de"];
const REDIRECTS = [
  ...listLegacySlugRedirects(),
  ...listCannibalizationRedirects(),
];

function normalizeHref(rawHref) {
  if (!rawHref) return { path: "", hash: "" };

  let value = String(rawHref).trim();

  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      value = `${url.pathname}${url.hash}`;
    }
  } catch {
    // Ignore parse failures and continue with the raw string.
  }

  const [pathPart, hashPart = ""] = value.split("#", 2);
  const path = pathPart.replace(/\/+$/, "") || "/";
  const hash = hashPart ? `#${hashPart}` : "";
  return { path, hash };
}

function stripLocalePrefix(pathname) {
  const clean = pathname.replace(/^\/+/, "");
  const parts = clean.split("/");
  if (LOCALES.includes(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

function findPathnameKey(pathname) {
  if (pathname === "/") return "/";

  for (const pathnameKey of Object.keys(NEXT_INTL_PATHNAMES)) {
    if (pathnameKey === "/") continue;
    const localized = NEXT_INTL_PATHNAMES[pathnameKey];

    if (pathname === pathnameKey) return pathnameKey;
    if (typeof localized === "string" && pathname === localized) return pathnameKey;

    if (localized && typeof localized === "object") {
      for (const locale of LOCALES) {
        if (pathname === localized[locale]) {
          return pathnameKey;
        }
      }
    }
  }

  return null;
}

function findBlogPath(locale, pathname) {
  const clean = pathname.replace(/^\/+/, "");
  const [prefix, slug] = clean.split("/", 2);
  if (prefix !== "blog" || !slug) return null;

  const article = BLOG_ARTICLE_LIST.find((item) =>
    LOCALES.some((lang) => item.slugs[lang] === slug)
  );
  if (!article) return null;

  return `/blog/${article.slugs[locale] ?? article.slugs.bs}`;
}

function resolveCanonicalPath(locale, pathname, seen = new Set()) {
  const withoutLocale = stripLocalePrefix(pathname);
  const pathnameKey = findPathnameKey(withoutLocale);
  if (pathnameKey) {
    return seoPagePath(locale, pathnameKey);
  }

  const blogPath = findBlogPath(locale, withoutLocale);
  if (blogPath) {
    return `/${locale}${blogPath}`;
  }

  const cleanSegment = withoutLocale.replace(/^\/+/, "");
  if (!cleanSegment) return `/${locale}`;

  const redirect = REDIRECTS.find(({ fromSeg }) => fromSeg === cleanSegment);
  if (!redirect || seen.has(cleanSegment)) return null;

  seen.add(cleanSegment);
  return resolveCanonicalPath(locale, `/${redirect.toSeg}`, seen);
}

export function resolveInternalSeoHref(locale, rawHref) {
  const { path, hash } = normalizeHref(rawHref);
  const resolved = resolveCanonicalPath(locale, path);
  if (!resolved) return null;
  return `${resolved}${hash}`;
}
