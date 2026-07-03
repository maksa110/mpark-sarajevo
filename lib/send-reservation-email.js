import "server-only";
import nodemailer from "nodemailer";
import { computePriceQuote, CURRENCY } from "@/lib/pricing";
import { getGoogleReviewUrl } from "@/lib/site";

function escapeHtml(v) {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createGmailTransport() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

const SUBJECT_ADMIN = "Nova rezervacija - M Park Sarajevo";
const SUBJECT_GUEST = "Potvrda rezervacije - M Park Sarajevo";
const FROM_NAME = "M Park Sarajevo";

export async function sendReservationEmailNotification(reservation) {
  const user = process.env.GMAIL_USER?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || user;

  const transporter = createGmailTransport();
  if (!transporter || !user || !adminEmail) return;

  try {
    const quote = computePriceQuote(
      reservation.arrivalDate,
      reservation.arrivalTime,
      reservation.departureDate,
      reservation.departureTime
    );

    const html = `
<h2>Nova rezervacija</h2>
<p><b>Ime:</b> ${escapeHtml(reservation.name)}</p>
<p><b>Telefon:</b> ${escapeHtml(reservation.phone)}</p>
${reservation.email?.trim() ? `<p><b>Email korisnika:</b> ${escapeHtml(reservation.email.trim())}</p>` : ""}
<p><b>Ostavljanje ključa:</b> ${escapeHtml(
      reservation.leaveKey === false ? "Ne ostavljam ključ" : "Ostavljam ključ"
    )}</p>
<p><b>Datum dolaska:</b> ${escapeHtml(
      `${reservation.arrivalDate} ${reservation.arrivalTime}`
    )}</p>
<p><b>Datum odlaska:</b> ${escapeHtml(
      `${reservation.departureDate} ${reservation.departureTime}`
    )}</p>
<p><b>Broj dana:</b> ${escapeHtml(String(quote?.days ?? "—"))}</p>
<p><b>Iznos:</b> ${escapeHtml(String(quote?.total ?? 0))} ${escapeHtml(
      CURRENCY
    )}</p>
${reservation.id ? `<p><b>ID rezervacije:</b> ${escapeHtml(reservation.id)}</p>` : ""}
`.trim();

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${user}>`,
      to: adminEmail,
      subject: SUBJECT_ADMIN,
      html,
    });
  } catch (err) {
    console.error("Reservation email notification failed:", err);
  }
}

export async function sendGuestReservationConfirmation(reservation) {
  const user = process.env.GMAIL_USER?.trim();
  const to = reservation.email?.trim();

  const transporter = createGmailTransport();
  if (!transporter || !user || !to) return;

  try {
    const quote = computePriceQuote(
      reservation.arrivalDate,
      reservation.arrivalTime,
      reservation.departureDate,
      reservation.departureTime
    );

    const reviewUrl = getGoogleReviewUrl();
    const reviewBlock = reviewUrl
      ? `<p>Ako budete zadovoljni uslugom, kratka Google recenzija nam jako pomaže.</p>
<p><a href="${escapeHtml(reviewUrl)}">Ostavite recenziju na Google-u</a></p>`
      : `<p>Kada završite putovanje, možete ostaviti povratnu informaciju na našem Google profilu.</p>`;

    const html = `
<h2>Potvrda rezervacije</h2>
<p>Poštovani ${escapeHtml(reservation.name)},</p>
<p>Vaša rezervacija parkinga kod Aerodroma Sarajevo je uspješno zaprimljena.</p>
<ul>
  <li><b>Datum dolaska:</b> ${escapeHtml(
    `${reservation.arrivalDate} ${reservation.arrivalTime}`
  )}</li>
  <li><b>Datum odlaska:</b> ${escapeHtml(
    `${reservation.departureDate} ${reservation.departureTime}`
  )}</li>
  <li><b>Broj dana:</b> ${escapeHtml(String(quote?.days ?? "—"))}</li>
  <li><b>Iznos:</b> ${escapeHtml(String(quote?.total ?? 0))} ${escapeHtml(
    CURRENCY
  )}</li>
  <li><b>Ostavljanje ključa:</b> ${escapeHtml(
    reservation.leaveKey === false ? "Ne" : "Da"
  )}</li>
</ul>
<p>Hvala Vam na povjerenju!</p>
${reviewBlock}
<p>Srdačan pozdrav,<br/>${escapeHtml(FROM_NAME)}</p>
`.trim();

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${user}>`,
      to,
      subject: SUBJECT_GUEST,
      html,
    });
  } catch (err) {
    console.error("Guest reservation confirmation email failed:", err);
  }
}
