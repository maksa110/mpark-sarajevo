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
  next.reviewEmailSent = next.reviewEmailSent === true;
  next.reviewEmailSentAt =
    typeof next.reviewEmailSentAt === "string" ? next.reviewEmailSentAt : null;
  next.reviewEmailSendingAt =
    typeof next.reviewEmailSendingAt === "string"
      ? next.reviewEmailSendingAt
      : null;
  next.reviewEmailLog = Array.isArray(next.reviewEmailLog)
    ? next.reviewEmailLog.filter((entry) => entry && typeof entry === "object")
    : [];
  return normalizeAffiliateFields(next);
}
