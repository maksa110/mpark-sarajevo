export const BOOKING_STATUS = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

const AFFILIATE_FIELDS = [
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
];

export function getBookingStatus(reservation) {
  return reservation?.bookingStatus === BOOKING_STATUS.CANCELLED
    ? BOOKING_STATUS.CANCELLED
    : BOOKING_STATUS.CONFIRMED;
}

export function sanitizeReservationRecord(reservation) {
  const next = { ...(reservation || {}) };

  for (const field of AFFILIATE_FIELDS) {
    delete next[field];
  }

  next.bookingStatus = getBookingStatus(next);
  return next;
}
