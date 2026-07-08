import { normalizeAffiliateFields } from "@/lib/affiliate";

export const BOOKING_STATUS = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

export function getBookingStatus(reservation) {
  return reservation?.bookingStatus === BOOKING_STATUS.CANCELLED
    ? BOOKING_STATUS.CANCELLED
    : BOOKING_STATUS.CONFIRMED;
}

export function sanitizeReservationRecord(reservation) {
  const next = { ...(reservation || {}) };

  next.bookingStatus = getBookingStatus(next);
  return normalizeAffiliateFields(next);
}
