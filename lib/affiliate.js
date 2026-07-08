import { computePriceQuote } from "@/lib/pricing";

export const AFFILIATE_REF_COOKIE = "mpark_affiliate_ref";
export const AFFILIATE_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
export const CANCELLED_BOOKING_STATUS = "cancelled";

export const COMMISSION_STATUS = Object.freeze({
  UNPAID: "unpaid",
  PAID: "paid",
  CANCELLED: "cancelled",
});

export const AFFILIATE_FIELDS = Object.freeze([
  "affiliatePartnerId",
  "affiliatePartnerName",
  "affiliateRef",
  "promoCode",
  "originalAmount",
  "discountPercent",
  "discountAmount",
  "finalAmount",
  "commissionPercent",
  "commissionAmount",
  "commissionStatus",
]);

export const AFFILIATE_PARTNERS = Object.freeze({
  lovci: {
    id: "lovci",
    name: "Lovci na putovanja",
    commissionPercent: 15,
    promoCodes: {
      LOVCI10: 10,
    },
  },
});

function roundMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100) / 100;
}

function inferOriginalAmount(reservation) {
  const explicitAmount = reservation?.originalAmount ?? reservation?.finalAmount;
  if (Number.isFinite(Number(explicitAmount))) {
    return roundMoney(explicitAmount);
  }

  if (
    reservation?.arrivalDate &&
    reservation?.arrivalTime &&
    reservation?.departureDate &&
    reservation?.departureTime
  ) {
    const quote = computePriceQuote(
      reservation.arrivalDate,
      reservation.arrivalTime,
      reservation.departureDate,
      reservation.departureTime
    );
    if (quote?.total) {
      return roundMoney(quote.total);
    }
  }

  return 0;
}

export function normalizeAffiliateRef(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function normalizePromoCode(value) {
  if (typeof value !== "string") return "";
  return value.trim().toUpperCase();
}

export function getAffiliatePartnerById(partnerId) {
  const normalized = normalizeAffiliateRef(partnerId);
  return AFFILIATE_PARTNERS[normalized] || null;
}

export function getAffiliatePartnerByPromoCode(promoCode) {
  const normalizedCode = normalizePromoCode(promoCode);
  if (!normalizedCode) return null;

  for (const partner of Object.values(AFFILIATE_PARTNERS)) {
    const discountPercent = partner.promoCodes[normalizedCode];
    if (discountPercent) {
      return { partner, discountPercent, promoCode: normalizedCode };
    }
  }

  return null;
}

export function getAffiliatePartnerByRef(ref) {
  return getAffiliatePartnerById(ref);
}

export function formatMoney(amount) {
  return roundMoney(amount).toFixed(2);
}

export function buildAffiliateSnapshot({
  originalAmount,
  affiliateRef,
  promoCode,
  bookingStatus,
  currentCommissionStatus = null,
}) {
  const safeOriginalAmount = roundMoney(originalAmount);
  const promoMatch = getAffiliatePartnerByPromoCode(promoCode);
  const refPartner = getAffiliatePartnerByRef(affiliateRef);
  const attributedPartner = promoMatch?.partner || refPartner;
  const normalizedRef = normalizeAffiliateRef(affiliateRef);
  const normalizedPromoCode = promoMatch?.promoCode || normalizePromoCode(promoCode);
  const discountPercent = promoMatch?.discountPercent || 0;
  const discountAmount = roundMoney((safeOriginalAmount * discountPercent) / 100);
  const finalAmount = roundMoney(safeOriginalAmount - discountAmount);
  const commissionPercent = attributedPartner?.commissionPercent || 0;
  const shouldCancel = bookingStatus === CANCELLED_BOOKING_STATUS;
  const commissionAmount = shouldCancel
    ? 0
    : roundMoney((finalAmount * commissionPercent) / 100);

  let commissionStatus = null;
  if (attributedPartner) {
    if (shouldCancel) {
      commissionStatus = COMMISSION_STATUS.CANCELLED;
    } else if (currentCommissionStatus === COMMISSION_STATUS.PAID) {
      commissionStatus = COMMISSION_STATUS.PAID;
    } else {
      commissionStatus = COMMISSION_STATUS.UNPAID;
    }
  }

  return {
    affiliatePartnerId: attributedPartner?.id || null,
    affiliatePartnerName: attributedPartner?.name || null,
    affiliateRef: refPartner?.id || normalizedRef || null,
    promoCode: normalizedPromoCode || null,
    originalAmount: safeOriginalAmount,
    discountPercent,
    discountAmount,
    finalAmount,
    commissionPercent,
    commissionAmount,
    commissionStatus,
  };
}

export function normalizeAffiliateFields(reservation) {
  const next = { ...(reservation || {}) };
  const snapshot = buildAffiliateSnapshot({
    originalAmount: inferOriginalAmount(next),
    affiliateRef: next.affiliateRef,
    promoCode: next.promoCode,
    bookingStatus: next.bookingStatus,
    currentCommissionStatus: next.commissionStatus,
  });

  for (const field of AFFILIATE_FIELDS) {
    next[field] = snapshot[field];
  }

  return next;
}

export function getAffiliateClickSessionCookieName(partnerId) {
  return `mpark_affiliate_click_${normalizeAffiliateRef(partnerId)}`;
}

export function getPartnerPasswordEnvName(partnerId) {
  return `PARTNER_${normalizeAffiliateRef(partnerId).toUpperCase()}_PASSWORD`;
}
