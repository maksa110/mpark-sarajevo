import { NextResponse } from "next/server";
import { PARTNER_COOKIE, getPartnerCookieOptions } from "@/lib/partner-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PARTNER_COOKIE, "", {
    ...getPartnerCookieOptions(),
    maxAge: 0,
  });
  return response;
}
