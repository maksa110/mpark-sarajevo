import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  findDueReviewEmailReservationIds,
  sendReviewEmailForReservation,
} from "@/lib/review-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function secretsMatch(received, expected) {
  if (!received || !expected) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function isAuthorized(request) {
  const authorization = request.headers.get("authorization") || "";
  const received = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  return secretsMatch(received, process.env.CRON_SECRET);
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date();
  const dueIds = await findDueReviewEmailReservationIds(startedAt);
  const results = [];

  for (const reservationId of dueIds) {
    try {
      const sent = await sendReviewEmailForReservation(reservationId, {
        source: "cron",
        require24Hours: true,
        now: new Date(),
      });
      results.push({
        reservationId,
        status: "sent",
        sentAt: sent.log.sentAt,
      });
    } catch (error) {
      console.error("[review-email] cron send failed", {
        reservationId,
        code: error?.code,
        error,
      });
      results.push({
        reservationId,
        status: "failed",
        errorCode: error?.code || "SEND_FAILED",
      });
    }
  }

  const sent = results.filter((result) => result.status === "sent").length;
  const failed = results.length - sent;
  console.info("[review-email] cron complete", {
    startedAt: startedAt.toISOString(),
    due: dueIds.length,
    sent,
    failed,
  });

  return NextResponse.json({
    ok: failed === 0,
    startedAt: startedAt.toISOString(),
    due: dueIds.length,
    sent,
    failed,
    results,
  });
}
