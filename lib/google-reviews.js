import "server-only";
import { GOOGLE_REVIEWS_MANUAL } from "@/data/google-reviews";

/**
 * Vraća stvarne Google recenzije za biznis.
 *
 * Strategija:
 *   1. Ako su postavljene env varijable GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID,
 *      povlači žive podatke sa Google Places Details API-ja
 *      (ISR: revalidate svakih 6h da se zadrži svježina bez čestih troškova).
 *   2. U suprotnom, koristi manuelno unesene stvarne recenzije iz
 *      `data/google-reviews.js` (vlasnik ih kopira sa svog Google profila).
 *   3. Ako nema ničega — vraća null. NIKADA ne generiše lažne recenzije.
 *
 * Vraća: { reviews, aggregateRating, userRatingsTotal, profileUrl, source } | null
 */
export async function getGoogleReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    try {
      const data = await fetchFromPlacesApi(apiKey, placeId);
      if (data) return data;
    } catch (err) {
      console.error("[google-reviews] Places API fetch failed:", err);
    }
  }

  return readFromManualFallback();
}

async function fetchFromPlacesApi(apiKey, placeId) {
  const fields = ["name", "rating", "user_ratings_total", "reviews", "url"].join(",");
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", fields);
  url.searchParams.set("language", "bs");
  url.searchParams.set("reviews_no_translations", "true");
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), {
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    throw new Error(`Places API HTTP ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== "OK") {
    throw new Error(`Places API status ${json.status}: ${json.error_message || ""}`);
  }

  const result = json.result || {};
  const rawReviews = Array.isArray(result.reviews) ? result.reviews : [];
  const reviews = rawReviews
    .map((r) => normalizeReview(r))
    .filter((r) => r && r.rating);

  if (reviews.length === 0 && !result.rating) return null;

  return {
    reviews,
    aggregateRating: typeof result.rating === "number" ? result.rating : null,
    userRatingsTotal:
      typeof result.user_ratings_total === "number" ? result.user_ratings_total : null,
    profileUrl: result.url || null,
    source: "places-api",
  };
}

function readFromManualFallback() {
  const data = GOOGLE_REVIEWS_MANUAL || {};
  const reviews = (Array.isArray(data.reviews) ? data.reviews : [])
    .map((r) => normalizeReview(r))
    .filter((r) => r && r.rating);

  if (
    reviews.length === 0 &&
    data.aggregateRating == null &&
    data.userRatingsTotal == null
  ) {
    return null;
  }

  return {
    reviews,
    aggregateRating:
      typeof data.aggregateRating === "number" ? data.aggregateRating : null,
    userRatingsTotal:
      typeof data.userRatingsTotal === "number" ? data.userRatingsTotal : null,
    profileUrl: process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL || null,
    source: "manual",
  };
}

function normalizeReview(r) {
  if (!r) return null;
  // Podržava i Places API format (snake_case) i manualni format (camelCase).
  const authorName = r.author_name || r.authorName || "";
  const authorUrl = r.author_url || r.authorUrl || null;
  const profilePhotoUrl = r.profile_photo_url || r.profilePhotoUrl || null;
  const rating = Number(r.rating);
  const text = (r.text || "").trim();
  const relativeTime = r.relative_time_description || r.relativeTime || null;
  const time =
    typeof r.time === "number"
      ? r.time
      : typeof r.timestamp === "number"
        ? r.timestamp
        : null;
  const language = r.language || r.lang || null;

  if (!authorName || !Number.isFinite(rating)) return null;

  return {
    authorName,
    authorUrl,
    profilePhotoUrl,
    rating: Math.max(1, Math.min(5, Math.round(rating))),
    text,
    relativeTime,
    time,
    language,
    isoDate: time ? new Date(time * 1000).toISOString() : null,
  };
}
