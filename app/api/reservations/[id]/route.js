import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE,
  getAuthConfigError,
  getSessionSecret,
  parseSessionToken,
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
  const mis = getAuthConfigError();
  if (mis) {
    return NextResponse.json(
      { error: "Server nije spreman: provjerite environment varijable (ADMIN_)." },
      { status: 503 }
    );
  }
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let reservation;
  try {
    reservation = await getReservation(id);
  } catch (e) {
    if (e?.code === "VERCEL_BLOB_REQUIRED" || e?.message === "VERCEL_BLOB_REQUIRED") {
      return NextResponse.json(
        { error: "Pohrana nije postavljena (Vercel Blob)." },
        { status: 503 }
      );
    }
    throw e;
  }
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

  let ok;
  try {
    ok = await deleteReservation(id);
  } catch (e) {
    if (e?.code === "VERCEL_BLOB_REQUIRED" || e?.message === "VERCEL_BLOB_REQUIRED") {
      return NextResponse.json(
        { error: "Pohrana nije postavljena (Vercel Blob)." },
        { status: 503 }
      );
    }
    throw e;
  }
  if (!ok) {
    return NextResponse.json(
      { error: "Brisanje nije uspjelo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id });
}
