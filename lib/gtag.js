/**
 * GA4 conversion helpers (gtag loaded in components/GoogleAnalytics.jsx).
 */

/**
 * @param {{ days?: number; total?: number; tier?: string }} [quote]
 */
export function trackBookingConversion(quote) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const params = {
    event_category: "booking",
    event_label: "reservation_form",
    currency: "BAM",
  };

  if (quote?.days != null && Number.isFinite(quote.days)) {
    params.days = quote.days;
  }
  if (quote?.total != null && Number.isFinite(quote.total)) {
    params.value = quote.total;
  }
  if (quote?.tier) {
    params.tier = quote.tier;
  }

  window.gtag("event", "generate_lead", params);
}
