/**
 * GA4 conversion helpers (gtag loaded in components/GoogleAnalytics.jsx).
 */

function getGtag() {
  if (typeof window === "undefined") {
    return null;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  return window.gtag;
}

/**
 * @param {{ days?: number; total?: number; tier?: string }} [quote]
 */
export function trackBookingConversion(quote) {
  const gtag = getGtag();
  if (!gtag) {
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

  gtag("event", "generate_lead", params);
}
