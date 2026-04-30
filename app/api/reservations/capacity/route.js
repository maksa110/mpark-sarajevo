import { NextResponse } from "next/server";
import { listReservations } from "@/lib/db";
import { checkReservationCapacity } from "@/lib/parking-capacity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateDates(arrivalDate, arrivalTime, departureDate, departureTime) {
  if (!arrivalDate || !departureDate) return "Datumi su obavezni.";
  if (!arrivalTime || !departureTime)
    return "Vrijeme dolaska i odlaska su obavezni.";
  const a = new Date(`${arrivalDate}T${arrivalTime}`);
  const d = new Date(`${departureDate}T${departureTime}`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(d.getTime()))
    return "Neispravni datumi ili vremena.";
  if (d <= a) return "Datum i vrijeme odlaska mora biti nakon dolaska.";
  return null;
}

/**
 * Javna provjera kapaciteta prije slanja rezervacije (isti uvjeti kao POST).
 * GET ?arrivalDate=&arrivalTime=&departureDate=&departureTime=&leaveKey=true|false
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const arrivalDate = url.searchParams.get("arrivalDate") || "";
    const arrivalTime = url.searchParams.get("arrivalTime") || "";
    const departureDate = url.searchParams.get("departureDate") || "";
    const departureTime = url.searchParams.get("departureTime") || "";
    const lk = url.searchParams.get("leaveKey");

    if (lk !== "true" && lk !== "false") {
      return NextResponse.json(
        { ok: false, code: "BAD_REQUEST", error: "leaveKey mora biti true ili false." },
        { status: 400 }
      );
    }
    const leaveKey = lk === "true";

    const dateErr = validateDates(
      arrivalDate,
      arrivalTime,
      departureDate,
      departureTime
    );
    if (dateErr) {
      return NextResponse.json({ ok: false, code: "BAD_REQUEST", error: dateErr }, { status: 400 });
    }

    let rows;
    try {
      rows = await listReservations({ search: "" });
    } catch (e) {
      if (e?.code === "VERCEL_BLOB_REQUIRED" || e?.message === "VERCEL_BLOB_REQUIRED") {
        return NextResponse.json(
          { ok: false, code: "STORAGE", error: "Pohrana nije dostupna." },
          { status: 503 }
        );
      }
      throw e;
    }

    const draft = {
      arrivalDate: String(arrivalDate).slice(0, 10),
      arrivalTime: String(arrivalTime).slice(0, 5),
      departureDate: String(departureDate).slice(0, 10),
      departureTime: String(departureTime).slice(0, 5),
      leaveKey,
    };

    const cap = checkReservationCapacity(rows, draft);
    if (!cap.ok) {
      return NextResponse.json({ ok: false, code: cap.code }, { status: 200 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("GET /api/reservations/capacity:", e);
    return NextResponse.json({ ok: false, code: "SERVER" }, { status: 500 });
  }
}
