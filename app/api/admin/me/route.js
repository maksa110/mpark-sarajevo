import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE, getSessionSecret, parseSessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!parseSessionToken(token, getSessionSecret())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
