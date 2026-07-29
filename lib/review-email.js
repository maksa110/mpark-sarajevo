import "server-only";
import nodemailer from "nodemailer";
import { listReservations, updateReservation } from "@/lib/db";
import { BOOKING_STATUS } from "@/lib/reservation-record";
import { getGoogleReviewUrl, SITE } from "@/lib/site";

export const REVIEW_EMAIL_SUBJECT =
  "⭐ Thank you for choosing mPark Sarajevo";

const HOUR_MS = 60 * 60 * 1000;
const SEND_CLAIM_TTL_MS = 30 * 60 * 1000;
const SARAJEVO_TIME_ZONE = "Europe/Sarajevo";

export class ReviewEmailError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ReviewEmailError";
    this.code = code;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getZonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );
}

/** Converts the reservation's Sarajevo wall-clock departure into a UTC instant. */
export function getReservationDepartureInstant(reservation) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    reservation?.departureDate || ""
  );
  const timeMatch = /^(\d{2}):(\d{2})/.exec(
    reservation?.departureTime || ""
  );
  if (!dateMatch || !timeMatch) return null;

  const wallClockUtc = Date.UTC(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2])
  );
  let guess = wallClockUtc;

  for (let pass = 0; pass < 2; pass += 1) {
    const parts = getZonedParts(new Date(guess), SARAJEVO_TIME_ZONE);
    const renderedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );
    guess = wallClockUtc - (renderedAsUtc - guess);
  }

  const result = new Date(guess);
  return Number.isNaN(result.getTime()) ? null : result;
}

export function getReviewEmailEligibility(
  reservation,
  { now = new Date(), require24Hours = true } = {}
) {
  if (!reservation) return { eligible: false, code: "NOT_FOUND" };
  if (reservation.reviewEmailSent) {
    return { eligible: false, code: "ALREADY_SENT" };
  }
  if (reservation.bookingStatus !== BOOKING_STATUS.CONFIRMED) {
    return { eligible: false, code: "NOT_COMPLETED" };
  }
  if (!reservation.email?.trim()) {
    return { eligible: false, code: "EMAIL_MISSING" };
  }

  const departure = getReservationDepartureInstant(reservation);
  if (!departure || now.getTime() < departure.getTime()) {
    return { eligible: false, code: "NOT_COMPLETED" };
  }
  if (
    require24Hours &&
    now.getTime() < departure.getTime() + 24 * HOUR_MS
  ) {
    return { eligible: false, code: "WAITING_24_HOURS" };
  }

  return { eligible: true, departure };
}

function createTransport() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) {
    throw new ReviewEmailError(
      "EMAIL_NOT_CONFIGURED",
      "GMAIL_USER and GMAIL_PASS must be configured."
    );
  }
  return {
    user,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    }),
  };
}

function buildReviewEmail(reservation, reviewUrl) {
  const customerName = escapeHtml(reservation.name);
  const safeReviewUrl = escapeHtml(reviewUrl);
  const siteUrl = escapeHtml(SITE.url);
  const text = `Hello ${reservation.name},

Thank you for using mPark Sarajevo.

We hope you were satisfied with our parking service.

Your opinion means a lot to us and helps other travelers choose a safe parking service.

Please leave us a Google Review by clicking the link below.

Leave a Google Review
${reviewUrl}

Thank you for your trust.

Best regards,

mPark Sarajevo
www.mpark-sarajevo.com`;

  const html = `
<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b">
    <div style="max-width:600px;margin:0 auto;padding:32px 16px">
      <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e4e7">
        <p>Hello ${customerName},</p>
        <p>Thank you for using mPark Sarajevo.</p>
        <p>We hope you were satisfied with our parking service.</p>
        <p>Your opinion means a lot to us and helps other travelers choose a safe parking service.</p>
        <p>Please leave us a Google Review by clicking the button below.</p>
        <p style="margin:28px 0">
          <a href="${safeReviewUrl}" style="display:inline-block;background:#65a30d;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px">
            Leave a Google Review
          </a>
        </p>
        <p>Thank you for your trust.</p>
        <p>Best regards,</p>
        <p><strong>mPark Sarajevo</strong><br>
          <a href="${siteUrl}" style="color:#3f6212">www.mpark-sarajevo.com</a>
        </p>
      </div>
    </div>
  </body>
</html>`.trim();

  return { text, html };
}

function eligibilityMessage(code) {
  const messages = {
    ALREADY_SENT: "Review email has already been sent.",
    NOT_COMPLETED: "Reservation must be completed before sending.",
    EMAIL_MISSING: "Reservation does not have a customer email.",
    WAITING_24_HOURS: "Reservation ended less than 24 hours ago.",
    SEND_IN_PROGRESS: "Review email sending is already in progress.",
  };
  return messages[code] || "Reservation is not eligible for a review email.";
}

export async function sendReviewEmailForReservation(
  reservationId,
  { source = "manual", require24Hours = false, now = new Date() } = {}
) {
  const reviewUrl = getGoogleReviewUrl();
  if (!reviewUrl) {
    throw new ReviewEmailError(
      "REVIEW_URL_MISSING",
      "Google Review URL is not configured."
    );
  }

  let claimStatus = "NOT_FOUND";
  const claimedAt = now.toISOString();
  const claimed = await updateReservation(reservationId, (reservation) => {
    const eligibility = getReviewEmailEligibility(reservation, {
      now,
      require24Hours,
    });
    if (!eligibility.eligible) {
      claimStatus = eligibility.code;
      return reservation;
    }

    const sendingAt = reservation.reviewEmailSendingAt
      ? new Date(reservation.reviewEmailSendingAt).getTime()
      : 0;
    if (
      Number.isFinite(sendingAt) &&
      sendingAt > now.getTime() - SEND_CLAIM_TTL_MS
    ) {
      claimStatus = "SEND_IN_PROGRESS";
      return reservation;
    }

    claimStatus = "CLAIMED";
    return { ...reservation, reviewEmailSendingAt: claimedAt };
  });

  if (!claimed) {
    throw new ReviewEmailError("NOT_FOUND", "Reservation was not found.");
  }
  if (claimStatus !== "CLAIMED") {
    throw new ReviewEmailError(claimStatus, eligibilityMessage(claimStatus));
  }

  try {
    const { user, transporter } = createTransport();
    const to = claimed.email.trim();
    const content = buildReviewEmail(claimed, reviewUrl);
    const info = await transporter.sendMail({
      from: `"mPark Sarajevo" <${user}>`,
      to,
      subject: REVIEW_EMAIL_SUBJECT,
      ...content,
    });
    const sentAt = new Date().toISOString();
    const logEntry = {
      sentAt,
      recipient: to,
      source,
      messageId: info.messageId || null,
    };

    const updated = await updateReservation(reservationId, (reservation) => ({
      ...reservation,
      reviewEmailSent: true,
      reviewEmailSentAt: sentAt,
      reviewEmailSendingAt: null,
      reviewEmailLog: [...reservation.reviewEmailLog, logEntry],
    }));

    console.info("[review-email] sent", {
      reservationId,
      ...logEntry,
    });
    return { reservation: updated, log: logEntry };
  } catch (error) {
    await updateReservation(reservationId, (reservation) => ({
      ...reservation,
      reviewEmailSendingAt: null,
    })).catch((releaseError) => {
      console.error("[review-email] failed to release send claim", {
        reservationId,
        error: releaseError,
      });
    });
    if (error instanceof ReviewEmailError) throw error;
    throw new ReviewEmailError(
      "SEND_FAILED",
      error?.message || "Review email could not be sent."
    );
  }
}

export async function findDueReviewEmailReservationIds(now = new Date()) {
  const reservations = await listReservations({ search: "" });
  return reservations
    .filter(
      (reservation) =>
        getReviewEmailEligibility(reservation, {
          now,
          require24Hours: true,
        }).eligible
    )
    .map((reservation) => reservation.id);
}
