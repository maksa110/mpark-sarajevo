import { NextResponse } from "next/server";
import {
  COOKIE,
  COOKIE_MAX_AGE_SECONDS,
  createSessionToken,
  getAdminPassword,
  getSessionSecret,
  timingSafePasswordEqual,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan JSON." }, { status: 400 });
  }

  const pwd = body?.password;
  if (typeof pwd !== "string" || pwd.length < 1) {
    return NextResponse.json(
      { error: "Lozinka je obavezna." },
      { status: 400 }
    );
  }

  if (!timingSafePasswordEqual(pwd, getAdminPassword())) {
    return NextResponse.json({ error: "Pogrešna lozinka." }, { status: 401 });
  }

  const token = createSessionToken(getSessionSecret());
  const isProd = process.env.NODE_ENV === "production";

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}
