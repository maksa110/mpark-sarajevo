import { COMMISSION_STATUS, formatMoney, getAffiliatePartnerById } from "@/lib/affiliate";
import { BOOKING_STATUS } from "@/lib/reservation-record";

function sumAmounts(rows, field) {
  return rows.reduce((total, row) => total + Number(row[field] || 0), 0);
}

export function buildPartnerDashboard(partnerId, reservations, clickCount) {
  const partner = getAffiliatePartnerById(partnerId);
  if (!partner) return null;

  const rows = reservations
    .filter((row) => row.affiliatePartnerId === partner.id)
    .sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

  const confirmedRows = rows.filter(
    (row) => row.bookingStatus !== BOOKING_STATUS.CANCELLED
  );
  const cancelledRows = rows.filter(
    (row) => row.bookingStatus === BOOKING_STATUS.CANCELLED
  );
  const paidRows = rows.filter(
    (row) => row.commissionStatus === COMMISSION_STATUS.PAID
  );
  const unpaidRows = rows.filter(
    (row) => row.commissionStatus === COMMISSION_STATUS.UNPAID
  );

  return {
    partner,
    totals: {
      clicks: Number(clickCount || 0),
      reservations: rows.length,
      confirmedReservations: confirmedRows.length,
      cancelledReservations: cancelledRows.length,
      originalBookingValue: sumAmounts(rows, "originalAmount"),
      discountsGiven: sumAmounts(rows, "discountAmount"),
      finalBookingValue: sumAmounts(rows, "finalAmount"),
      totalCommission: sumAmounts(rows, "commissionAmount"),
      paidCommission: sumAmounts(paidRows, "commissionAmount"),
      unpaidCommission: sumAmounts(unpaidRows, "commissionAmount"),
    },
    reservations: rows.map((row) => ({
      bookingDate: row.createdAt ? String(row.createdAt).slice(0, 10) : "",
      reservationId: row.id,
      originalAmount: Number(row.originalAmount || 0),
      discountAmount: Number(row.discountAmount || 0),
      finalAmount: Number(row.finalAmount || 0),
      commissionAmount: Number(row.commissionAmount || 0),
      bookingStatus: row.bookingStatus || BOOKING_STATUS.CONFIRMED,
      commissionStatus: row.commissionStatus || null,
    })),
  };
}

export function formatPartnerMoney(amount) {
  return `${formatMoney(amount)} KM`;
}
