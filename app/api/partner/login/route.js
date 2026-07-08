import { NextResponse } from "next/server";
import { timingSafePasswordEqual } from "@/lib/auth";
import { getClientKey, getLoginRateLimitState, recordLoginFailure, clearLoginFailures } from "@/lib/admin-rate-limit";
import { getAffiliatePartnerById } from "@/lib/affiliate";
import {
  PARTNER_COOKIE,
  createPartnerSessionToken,
  getPartnerAuthConfigError,
  getPartnerCookieOptions,
  getPartnerPassword,
} from "@/lib/partner-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan JSON." }, { status: 400 });
  }

  const partner = getAffiliatePartnerById(body?.partnerId);
  if (!partner) {
    return NextResponse.json({ error: "Partner nije pronađen." }, { status: 404 });
  }

  const configError = getPartnerAuthConfigError(partner.id);
  if (configError) {
    return NextResponse.json(
      { error: "Partner prijava nije spremna: provjerite environment varijable." },
      { status: 503 }
    );
  }

  const clientKey = `partner:${partner.id}:${getClientKey(request)}`;
  const rateLimit = getLoginRateLimitState(clientKey);
  if (rateLimit.blocked) {
    return NextResponse.json(
      {
        error: "Previše neuspješnih pokušaja. Pokušajte ponovo za nekoliko minuta.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      }
    );
  }

  const password = body?.password;
  if (typeof password !== "string" || password.length < 1) {
    return NextResponse.json({ error: "Lozinka je obavezna." }, { status: 400 });
  }

  if (!timingSafePasswordEqual(password, getPartnerPassword(partner.id))) {
    recordLoginFailure(clientKey);
    return NextResponse.json({ error: "Pogrešna lozinka." }, { status: 401 });
  }

  clearLoginFailures(clientKey);

  const response = NextResponse.json({ ok: true, partnerId: partner.id });
  response.cookies.set(PARTNER_COOKIE, createPartnerSessionToken(partner.id), {
    ...getPartnerCookieOptions(),
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
