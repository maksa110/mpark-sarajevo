// Pure helper to derive an informational reservation status purely from dates.
// No DB writes, no manual transitions — admin panel only renders this.
//
// upcoming  → arrival is in the future
// active    → now is between arrival and departure (currently parking)
// completed → departure already passed

export const STATUS = Object.freeze({
  UPCOMING: "upcoming",
  ACTIVE: "active",
  COMPLETED: "completed",
});

export const STATUS_LABEL = Object.freeze({
  [STATUS.UPCOMING]: "Nadolazi",
  [STATUS.ACTIVE]: "Aktivna",
  [STATUS.COMPLETED]: "Završena",
});

export const STATUS_BADGE = Object.freeze({
  [STATUS.UPCOMING]: "bg-sky-100 text-sky-900 ring-sky-200",
  [STATUS.ACTIVE]: "bg-lime-100 text-lime-900 ring-lime-200",
  [STATUS.COMPLETED]: "bg-zinc-100 text-zinc-700 ring-zinc-200",
});

function toDate(date, time) {
  if (!date) return null;
  const t = time && /^\d{2}:\d{2}/.test(time) ? time.slice(0, 5) : "00:00";
  const d = new Date(`${date}T${t}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function deriveStatus(reservation, now = new Date()) {
  if (!reservation) return STATUS.UPCOMING;
  const arrival = toDate(reservation.arrivalDate, reservation.arrivalTime);
  const departure = toDate(
    reservation.departureDate,
    reservation.departureTime
  );

  if (arrival && now < arrival) return STATUS.UPCOMING;
  if (departure && now >= departure) return STATUS.COMPLETED;
  return STATUS.ACTIVE;
}
