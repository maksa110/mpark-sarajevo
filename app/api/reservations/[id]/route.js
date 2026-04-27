import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE,
  parseSessionToken,
  getSessionSecret,
} from "@/lib/auth";
import { deleteReservation, getReservation } from "@/lib/db";
import { deriveStatus, STATUS } from "@/lib/reservation-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  return parseSessionToken(token, getSessionSecret());
}

export async function DELETE(_request, { params }) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reservation = getReservation(id);
  if (!reservation) {
    return NextResponse.json(
      { error: "Rezervacija nije pronađena." },
      { status: 404 }
    );
  }

  // Business rule: completed reservations (departure already passed)
  // are archived for accounting/legal traceability and cannot be deleted.
  if (deriveStatus(reservation) === STATUS.COMPLETED) {
    return NextResponse.json(
      { error: "Završene rezervacije se ne mogu brisati." },
      { status: 409 }
    );
  }

  const ok = deleteReservation(id);
  if (!ok) {
    return NextResponse.json(
      { error: "Brisanje nije uspjelo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id });
}
