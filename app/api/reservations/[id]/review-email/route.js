import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE,
  getAuthConfigError,
  getSessionSecret,
  parseSessionToken,
} from "@/lib/auth";
import {
  ReviewEmailError,
  sendReviewEmailForReservation,
} from "@/lib/review-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  return parseSessionToken(token, getSessionSecret());
}

function errorStatus(error) {
  if (error?.code === "NOT_FOUND") return 404;
  if (
    ["ALREADY_SENT", "NOT_COMPLETED", "SEND_IN_PROGRESS"].includes(error?.code)
  ) {
    return 409;
  }
  if (error?.code === "EMAIL_MISSING") return 422;
  if (
    ["EMAIL_NOT_CONFIGURED", "REVIEW_URL_MISSING"].includes(error?.code)
  ) {
    return 503;
  }
  return 500;
}

export async function POST(_request, { params }) {
  if (getAuthConfigError()) {
    return NextResponse.json(
      { error: "Server is not ready: check ADMIN_ environment variables." },
      { status: 503 }
    );
  }
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const result = await sendReviewEmailForReservation(id, {
      source: "manual",
      require24Hours: false,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[review-email] manual send failed", {
      reservationId: id,
      code: error?.code,
      error,
    });
    return NextResponse.json(
      {
        error:
          error instanceof ReviewEmailError
            ? error.message
            : "Review email could not be sent.",
        errorCode: error?.code || "SEND_FAILED",
      },
      { status: errorStatus(error) }
    );
  }
}
