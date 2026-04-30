/** Ukupno mjesta na parkingu (5 bez ključa + 13 sa ključem). */
export const PARKING_TOTAL_SPOTS = 18;
/** Mjesta gdje korisnik NE ostavlja ključ. */
export const PARKING_SPOTS_NO_KEY = 5;
/** Mjesta gdje korisnik ostavlja ključ. */
export const PARKING_SPOTS_WITH_KEY = 13;

/** Stari zapisi bez polja tretiraju se kao „sa ključem”. */
export function reservationUsesKeySlot(row) {
  return row.leaveKey !== false;
}

export function reservationUsesNoKeySlot(row) {
  return row.leaveKey === false;
}

/**
 * Lista kalendarskih dana (YYYY-MM-DD) na koje rezervacija pada
 * (presjek intervala [dolazak, odlazak) sa svakim kalendarskim danom).
 */
export function listOccupiedCalendarDays(
  arrivalDate,
  arrivalTime,
  departureDate,
  departureTime
) {
  const start = new Date(`${arrivalDate}T${arrivalTime}`);
  const end = new Date(`${departureDate}T${departureTime}`);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return [];
  }

  const out = [];
  let ymd = arrivalDate.slice(0, 10);
  const endYmd = departureDate.slice(0, 10);

  while (true) {
    const dayStart = new Date(`${ymd}T00:00:00`);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    if (start < dayEnd && end > dayStart) {
      out.push(ymd);
    }
    if (ymd >= endYmd) break;
    ymd = addOneCalendarDayIso(ymd);
  }
  return out;
}

function addOneCalendarDayIso(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d + 1);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function reservationOverlapsCalendarDay(row, dayYmd) {
  const start = new Date(`${row.arrivalDate}T${row.arrivalTime}`);
  const end = new Date(`${row.departureDate}T${row.departureTime}`);
  if (Number.isNaN(+start) || Number.isNaN(+end) || end <= start) return false;
  const dayStart = new Date(`${dayYmd}T00:00:00`);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);
  return start < dayEnd && end > dayStart;
}

export function countReservationsOnDay(rows, dayYmd, { excludeId } = {}) {
  let noKey = 0;
  let withKey = 0;
  for (const r of rows) {
    if (excludeId && r.id === excludeId) continue;
    if (!reservationOverlapsCalendarDay(r, dayYmd)) continue;
    if (reservationUsesNoKeySlot(r)) noKey++;
    else withKey++;
  }
  return {
    noKey,
    withKey,
    total: noKey + withKey,
  };
}

/**
 * @returns {{ ok: true } | { ok: false, code: "CAPACITY_NO_KEY" | "CAPACITY_WITH_KEY" }}
 */
export function checkReservationCapacity(allRows, reservation, { excludeId } = {}) {
  const leaveKey = reservation.leaveKey !== false;
  const days = listOccupiedCalendarDays(
    reservation.arrivalDate,
    reservation.arrivalTime,
    reservation.departureDate,
    reservation.departureTime
  );
  if (days.length === 0) {
    return { ok: false, code: "CAPACITY_WITH_KEY" };
  }

  for (const day of days) {
    const c = countReservationsOnDay(allRows, day, { excludeId });
    if (!leaveKey) {
      if (c.noKey >= PARKING_SPOTS_NO_KEY) {
        return { ok: false, code: "CAPACITY_NO_KEY" };
      }
    } else {
      if (c.total >= PARKING_TOTAL_SPOTS || c.withKey >= PARKING_SPOTS_WITH_KEY) {
        return { ok: false, code: "CAPACITY_WITH_KEY" };
      }
    }
  }

  return { ok: true };
}
