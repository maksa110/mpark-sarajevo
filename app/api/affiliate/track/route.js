import { NextResponse } from "next/server";
import {
  AFFILIATE_COOKIE_MAX_AGE_SECONDS,
  AFFILIATE_REF_COOKIE,
  getAffiliateClickSessionCookieName,
  getAffiliatePartnerByRef,
  normalizeAffiliateRef,
} from "@/lib/affiliate";
import { incrementAffiliateClick } from "@/lib/affiliate-clicks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const partner = getAffiliatePartnerByRef(body?.ref);
  if (!partner) {
    return NextResponse.json({ error: "Unknown affiliate ref." }, { status: 400 });
  }

  function buildResponse(trackedValue) {
    const response = NextResponse.json({
      ok: true,
      ref: normalizeAffiliateRef(partner.id),
      tracked: trackedValue,
    });
    response.cookies.set(AFFILIATE_REF_COOKIE, partner.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AFFILIATE_COOKIE_MAX_AGE_SECONDS,
    });
    return response;
  }

  const sessionCookie = getAffiliateClickSessionCookieName(partner.id);
  let tracked = false;
  if (request.cookies.get(sessionCookie)?.value === "1") {
    return buildResponse(tracked);
  }

  try {
    await incrementAffiliateClick(partner.id);
    tracked = true;
  } catch (error) {
    if (
      error?.code === "VERCEL_BLOB_REQUIRED" ||
      error?.message === "VERCEL_BLOB_REQUIRED"
    ) {
      return buildResponse(false);
    }
    throw error;
  }

  const response = buildResponse(tracked);
  response.cookies.set(sessionCookie, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
