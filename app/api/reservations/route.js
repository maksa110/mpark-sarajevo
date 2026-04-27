import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import {
  COOKIE,
  parseSessionToken,
  getSessionSecret,
} from "@/lib/auth";
import { insertReservation, listReservations } from "@/lib/db";

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

export async function POST(request) {
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
  } = body || {};

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "Ime i telefon su obavezni." },
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

  if (email != null && String(email).trim()) {
    const em = String(email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      return NextResponse.json({ error: "Neispravan email." }, { status: 400 });
    }
  }

  const id = nanoid();
  const createdAt = new Date().toISOString();
  const reservation = {
    id,
    name: String(name).trim(),
    phone: String(phone).trim(),
    email:
      email != null && String(email).trim() ? String(email).trim() : null,
    arrivalDate: String(arrivalDate).slice(0, 10),
    arrivalTime: String(arrivalTime).slice(0, 5),
    departureDate: String(departureDate).slice(0, 10),
    departureTime: String(departureTime).slice(0, 5),
    createdAt,
  };

  try {
    insertReservation(reservation);
  } catch (e) {
    console.error("insertReservation failed:", e);
    return NextResponse.json({ error: "Greška baze." }, { status: 500 });
  }

  return NextResponse.json(reservation, { status: 201 });
}

export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!parseSessionToken(token, getSessionSecret())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const rows = listReservations({ search });
  return NextResponse.json(rows);
}
