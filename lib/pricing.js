// Single source of truth for parking pricing tiers.
// Mirrors UI in components/PricingSection.jsx and JSON-LD in app/[locale]/page.jsx.

export const PRICE_TIERS = [
  { tier: "t1", minDays: 1, maxDays: 3, rate: 9 },
  { tier: "t2", minDays: 4, maxDays: 6, rate: 8 },
  { tier: "t3", minDays: 7, maxDays: Infinity, rate: 7 },
];

export const CURRENCY = "KM";

/**
 * Determines the per-day rate for a given number of days.
 */
export function getTierForDays(days) {
  if (!Number.isFinite(days) || days < 1) return null;
  return PRICE_TIERS.find((t) => days >= t.minDays && days <= t.maxDays) || null;
}

/**
 * Number of billable days between two ISO date+time pairs.
 * Partial day counts as full (industry-standard parking billing).
 * Returns 0 if inputs are invalid or departure is not after arrival.
 */
export function computeBillableDays(
  arrivalDate,
  arrivalTime,
  departureDate,
  departureTime
) {
  if (!arrivalDate || !arrivalTime || !departureDate || !departureTime) {
    return 0;
  }
  const a = new Date(`${arrivalDate}T${arrivalTime}`);
  const d = new Date(`${departureDate}T${departureTime}`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(d.getTime())) return 0;
  if (d <= a) return 0;
  const ms = d.getTime() - a.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.ceil(ms / dayMs));
}

/**
 * Full price quote for a booking window.
 * Returns null when inputs are insufficient/invalid.
 */
export function computePriceQuote(
  arrivalDate,
  arrivalTime,
  departureDate,
  departureTime
) {
  const days = computeBillableDays(
    arrivalDate,
    arrivalTime,
    departureDate,
    departureTime
  );
  if (!days) return null;
  const tier = getTierForDays(days);
  if (!tier) return null;
  const total = days * tier.rate;

  // Compute potential saving if the user could move to the next (cheaper) tier.
  let nextTier = null;
  let extraDaysToNextTier = 0;
  let savingsPerDayAtNextTier = 0;
  const idx = PRICE_TIERS.indexOf(tier);
  if (idx >= 0 && idx < PRICE_TIERS.length - 1) {
    nextTier = PRICE_TIERS[idx + 1];
    extraDaysToNextTier = Math.max(0, nextTier.minDays - days);
    savingsPerDayAtNextTier = tier.rate - nextTier.rate;
  }

  return {
    days,
    tier: tier.tier,
    ratePerDay: tier.rate,
    total,
    currency: CURRENCY,
    nextTier: nextTier ? nextTier.tier : null,
    extraDaysToNextTier,
    savingsPerDayAtNextTier,
  };
}
