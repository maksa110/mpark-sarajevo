import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE, getAuthConfigError, getSessionSecret, parseSessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const mis = getAuthConfigError();
    if (mis) {
      return NextResponse.json(
        { error: "Server nije spreman: provjerite environment varijable (ADMIN_)." },
        { status: 503 }
      );
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    const secret = getSessionSecret();
    if (!parseSessionToken(token, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("GET /api/admin/me:", e);
    return NextResponse.json(
      { error: "Greška provjere sesije. Provjeri ADMIN_SESSION_SECRET na Vercelu." },
      { status: 500 }
    );
  }
}
