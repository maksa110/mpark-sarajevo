import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import {
  COOKIE,
  getAuthConfigError,
  getSessionSecret,
  parseSessionToken,
} from "@/lib/auth";
import { insertReservation, listReservations } from "@/lib/db";
import { checkReservationCapacity } from "@/lib/parking-capacity";
import {
  sendGuestReservationConfirmation,
  sendReservationEmailNotification,
} from "@/lib/send-reservation-email";
import { waitUntil } from "@vercel/functions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Vercel Hobby default je 10s; povećaj u dashboardu ili ostavi default. */
export const maxDuration = 30;

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

function parseLeaveKey(raw) {
  if (raw === true || raw === false) return raw;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

export async function POST(request) {
  try {
    return await postReservation(request);
  } catch (e) {
    console.error("POST /api/reservations (uncaught):", e);
    return NextResponse.json(
      {
        error: "Greška servera. Ako traje, provjerite Vercel env (Blob) i function logove.",
      },
      { status: 500 }
    );
  }
}

async function postReservation(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan JSON." }, { status: 400 });
  }

  const {
    name,
    phone,
    email,
    arrivalDate,
    arrivalTime,
    departureDate,
    departureTime,
    leaveKey: leaveKeyRaw,
  } = body || {};

  const leaveKey = parseLeaveKey(leaveKeyRaw);
  if (leaveKey === undefined) {
    return NextResponse.json(
      { errorCode: "LEAVE_KEY_REQUIRED", error: "Odaberite opciju ostavljanja ključa." },
      { status: 400 }
    );
  }

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "Ime i telefon su obavezni." },
      { status: 400 }
    );
  }

  const emailTrimmed =
    email != null && String(email).trim() ? String(email).trim() : "";
  if (!emailTrimmed) {
    return NextResponse.json(
      {
        errorCode: "EMAIL_REQUIRED",
        error: "Email je obavezan.",
      },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    return NextResponse.json(
      {
        errorCode: "EMAIL_INVALID",
        error: "Neispravan email.",
      },
      { status: 400 }
    );
  }

  const dateErr = validateDates(
    arrivalDate,
    arrivalTime,
    departureDate,
    departureTime
  );
  if (dateErr) return NextResponse.json({ error: dateErr }, { status: 400 });

  const id = nanoid();
  const createdAt = new Date().toISOString();
  const reservation = {
    id,
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: emailTrimmed,
    arrivalDate: String(arrivalDate).slice(0, 10),
    arrivalTime: String(arrivalTime).slice(0, 5),
    departureDate: String(departureDate).slice(0, 10),
    departureTime: String(departureTime).slice(0, 5),
    leaveKey,
    createdAt,
  };

  let existingRows;
  try {
    existingRows = await listReservations({ search: "" });
  } catch (e) {
    console.error("listReservations (capacity check):", e);
    if (e?.code === "VERCEL_BLOB_REQUIRED" || e?.message === "VERCEL_BLOB_REQUIRED") {
      return NextResponse.json(
        {
          error:
            "Pohrana nije postavljena. U Vercel: Storage → kreiraj Blob za ovaj projekat, zatim Redeploy (env BLOB_READ_WRITE_TOKEN).",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Provjera kapaciteta nije uspjela." }, { status: 500 });
  }

  const cap = checkReservationCapacity(existingRows, reservation);
  if (!cap.ok) {
    return NextResponse.json({ errorCode: cap.code }, { status: 409 });
  }

  try {
    await insertReservation(reservation);
  } catch (e) {
    console.error("insertReservation failed:", e);
    if (e?.code === "VERCEL_BLOB_REQUIRED" || e?.message === "VERCEL_BLOB_REQUIRED") {
      return NextResponse.json(
        {
          error:
            "Pohrana nije postavljena. U Vercel: Storage → kreiraj Blob za ovaj projekat, zatim Redeploy (env BLOB_READ_WRITE_TOKEN).",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        error:
          "Nije moguće spremiti rezervaciju. Provjeri da je u Vercel projektu povezan Blob (Storage) i uradi Redeploy.",
      },
      { status: 500 }
    );
  }

  waitUntil(sendReservationEmailNotification(reservation));
  waitUntil(sendGuestReservationConfirmation(reservation));

  return NextResponse.json(reservation, { status: 201 });
}

export async function GET(request) {
  const mis = getAuthConfigError();
  if (mis) {
    return NextResponse.json(
      { error: "Server nije spreman: provjerite environment varijable (ADMIN_)." },
      { status: 503 }
    );
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!parseSessionToken(token, getSessionSecret())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  let rows;
  try {
    rows = await listReservations({ search });
  } catch (e) {
    if (e?.code === "VERCEL_BLOB_REQUIRED" || e?.message === "VERCEL_BLOB_REQUIRED") {
      return NextResponse.json(
        { error: "Pohrana nije postavljena (Vercel Blob)." },
        { status: 503 }
      );
    }
    throw e;
  }
  return NextResponse.json(rows);
}
