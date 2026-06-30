import { NextResponse } from "next/server";
import {
  COOKIE,
  COOKIE_MAX_AGE_SECONDS,
  createSessionToken,
  getAdminPassword,
  getAuthConfigError,
  getSessionSecret,
  timingSafePasswordEqual,
} from "@/lib/auth";
import {
  clearAdminLoginFailures,
  getAdminLoginRateLimitState,
  getClientKey,
  recordAdminLoginFailure,
} from "@/lib/admin-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const mis = getAuthConfigError();
  if (mis) {
    return NextResponse.json(
      { error: "Server nije spreman: provjerite environment varijable (ADMIN)." },
      { status: 503 }
    );
  }

  const clientKey = getClientKey(request);
  const rateLimit = getAdminLoginRateLimitState(clientKey);
  if (rateLimit.blocked) {
    return NextResponse.json(
      {
        error: "Previse neuspjesnih pokusaja. Pokusajte ponovo za nekoliko minuta.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      }
    );
  }

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
    recordAdminLoginFailure(clientKey);
    return NextResponse.json({ error: "Pogresna lozinka." }, { status: 401 });
  }

  clearAdminLoginFailures(clientKey);

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
