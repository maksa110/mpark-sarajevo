/** Primarni (kanonski) javni origin — www (usklađeno s Vercel Primary; izbjegava petlju s apex↔www). */
const CANONICAL_ORIGIN = "https://www.mpark-sarajevo.com";
const APEX_HOST = "mpark-sarajevo.com";
const WWW_HOST = `www.${APEX_HOST}`;

/** NEXT_PUBLIC_SITE_URL na Vercelu često bude bez https:// — new URL() bi inače pucao u generateMetadata. */
function normalizePublicSiteUrl(input) {
  const raw = (input && String(input).trim()) || CANONICAL_ORIGIN;
  try {
    const withProto =
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `https://${raw.replace(/^\/+/, "")}`;
    const parsed = new URL(withProto);
    // Kanonski URL nikad ne smije biti *.vercel.app (SEO duplicate / pogrešan env).
    if (parsed.hostname.endsWith(".vercel.app")) {
      return CANONICAL_ORIGIN;
    }
    // Apex i www → uvijek https://www... (jedan host u meta/sitemap)
    if (parsed.hostname === APEX_HOST || parsed.hostname === WWW_HOST) {
      return CANONICAL_ORIGIN;
    }
    return parsed.origin;
  } catch {
    return CANONICAL_ORIGIN;
  }
}

/**
 * Direktan link na ostavljanje Google recenzije (Place review URL iz Google Business Profile).
 * Postavite NEXT_PUBLIC_GOOGLE_REVIEW_URL u produkciji da bi email/WhatsApp CTA radili.
 */
export function getGoogleReviewUrl() {
  const pub = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim();
  if (pub) return pub;
  return process.env.GOOGLE_BUSINESS_REVIEW_URL?.trim() || "";
}

/**
 * URL biznisa za schema.org `sameAs` (preporučen javni Google Maps / Place link).
 * Ne koristi generičku maps pretragu (?query=…) — samo konkretna listings URL-a.
 */
export function getSameAsForSchema() {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL?.trim();
  if (!raw) return [];
  try {
    const u = new URL(raw);
    if (!u.hostname.includes("google.")) return [raw];
    const href = u.href;
    if (
      href.includes("/maps/place/") ||
      href.includes("cid=") ||
      href.includes("place_id=")
    ) {
      return [href];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Radno vrijeme za JSON-LD — mora odgovarati Google Business Profile (urediti ako se razlikuje).
 * Format schema.org OpeningHoursSpecification.
 */
export const SCHEMA_OPENING_HOURS_SPEC = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "06:00",
    closes: "22:00",
  },
];

export const SITE = {
  brand: "M Park Sarajevo",
  legalName: "M Park Sarajevo",
  url: normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  tagline:
    "Privatni parking na adresi Kasindolskih Žrtava 18, blizu Aerodroma Sarajevo za putnike.",
  phoneDisplay: "+387 61 512 152",
  phoneTel: "+38761512152",
  email: "mparksarajevo.info@gmail.com",
  whatsapp: "38761512152",
  address: "Kasindolskih Žrtava 18, Sarajevo, Bosna i Hercegovina",
  addressShort: "Kasindolskih Žrtava 18, Sarajevo",
  addressNote: "Blizu Aerodroma Sarajevo",
  locationLine: "Parking blizu Aerodroma Sarajevo – Kasindolskih Žrtava 18",
  seoLine:
    "Privatni parking na adresi Kasindolskih Žrtava 18, blizu Aerodroma Sarajevo.",
  geo: {
    latitude: 43.8246,
    longitude: 18.3314,
  },
  googleProfileUrl:
    process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL ||
    "https://www.google.com/maps/search/?api=1&query=M+Park+Sarajevo",
  seoKeywords: [
    "parking aerodrom sarajevo",
    "privatni parking sarajevo",
    "parking za putnike",
    "parking kasindolskih žrtava 18",
    "parking blizu aerodroma sarajevo",
    "9 km po danu parking",
  ],
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1920&q=82&auto=format&fit=crop";

/** Kalendarska godina u Europe/Sarajevo — konzistentno SSR/klijent za isti trenutak. */
export function calendarYearSarajevo(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Sarajevo",
    year: "numeric",
  }).format(date);
}

// OG/Twitter share image is generated dynamically per locale via
// app/[locale]/opengraph-image.jsx (branded with logo + tagline + price).
