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

/** @returns {import("nodemailer").Transporter | null} */
function createGmailTransport() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

const SUBJECT_ADMIN = "Nova rezervacija – M Park Sarajevo";
const SUBJECT_GUEST = "Potvrda rezervacije – M Park Sarajevo";
const FROM_NAME = "M Park Sarajevo";

/**
 * Šalje admin obavijest o novoj rezervaciji (Gmail SMTP).
 * Greške se loguju; rezervacija ne ovisi o uspjehu emaila.
 * @param {{ id: string, name: string, phone: string, email: string | null, arrivalDate: string, arrivalTime: string, departureDate: string, departureTime: string, leaveKey?: boolean }} reservation
 */
export async function sendReservationEmailNotification(reservation) {
  const user = process.env.GMAIL_USER?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || user;

  const transporter = createGmailTransport();
  if (!transporter || !user || !adminEmail) {
    return;
  }

  try {
    const quote = computePriceQuote(
      reservation.arrivalDate,
      reservation.arrivalTime,
      reservation.departureDate,
      reservation.departureTime
    );

    const ime = escapeHtml(reservation.name);
    const telefon = escapeHtml(reservation.phone);
    const datum = escapeHtml(
      `${reservation.arrivalDate} ${reservation.arrivalTime}`
    );
    const dani =
      quote?.days != null ? escapeHtml(String(quote.days)) : "—";

    let priceLine = "";
    if (quote != null) {
      priceLine = `<p><b>Ukupna cijena:</b> ${escapeHtml(
        String(quote.total)
      )} ${escapeHtml(CURRENCY)}</p>`;
    }

    const guestEmail =
      reservation.email?.trim() &&
      `<p><b>Email korisnika:</b> ${escapeHtml(reservation.email.trim())}</p>`;

    const departureLine = `<p><b>Odlazak:</b> ${escapeHtml(
      `${reservation.departureDate} ${reservation.departureTime}`
    )}</p>`;

    const idLine = reservation.id
      ? `<p><b>ID rezervacije:</b> ${escapeHtml(reservation.id)}</p>`
      : "";

    const kljuc =
      reservation.leaveKey === false
        ? "Ne ostavljam ključ"
        : "Ostavljam ključ";

    const kljucLine = `<p><b>Ostavljanje ključa:</b> ${escapeHtml(kljuc)}</p>`;

    const html = `
<h2>Nova rezervacija</h2>
<p><b>Ime:</b> ${ime}</p>
<p><b>Telefon:</b> ${telefon}</p>
${guestEmail || ""}
${kljucLine}
<p><b>Datum:</b> ${datum}</p>
${departureLine}
<p><b>Dani:</b> ${dani}</p>
${priceLine}
${idLine}
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

/**
 * Šalje potvrdu korisniku na uneseni email.
 * Greške se loguju; rezervacija ne ovisi o uspjehu.
 */
export async function sendGuestReservationConfirmation(reservation) {
  const user = process.env.GMAIL_USER?.trim();
  const to = reservation.email?.trim();

  const transporter = createGmailTransport();
  if (!transporter || !user || !to) {
    return;
  }

  try {
    const quote = computePriceQuote(
      reservation.arrivalDate,
      reservation.arrivalTime,
      reservation.departureDate,
      reservation.departureTime
    );

    const ime = escapeHtml(reservation.name);
    const datumDolaska = escapeHtml(
      `${reservation.arrivalDate} ${reservation.arrivalTime}`
    );
    const datumOdlaska = escapeHtml(
      `${reservation.departureDate} ${reservation.departureTime}`
    );
    const dani =
      quote?.days != null ? escapeHtml(String(quote.days)) : "—";

    const kljucDaNe =
      reservation.leaveKey === false ? "Ne" : "Da";

    let priceLi = "";
    if (quote != null) {
      priceLi = `<li><b>Ukupna cijena:</b> ${escapeHtml(
        String(quote.total)
      )} ${escapeHtml(CURRENCY)}</li>`;
    } else {
      priceLi = `<li><b>Ukupna cijena:</b> —</li>`;
    }

    const reviewUrl = getGoogleReviewUrl();
    const reviewBlock =
      reviewUrl ?
        `<p>Ako budete zadovoljni uslugom, kratka Google recenzija nam jako pomaže da još više putnika pronađe <b>M Park Sarajevo</b> i siguran parking kod Aerodroma Sarajevo.</p>
<p><a href="${escapeHtml(reviewUrl)}">Ostavite recenziju na Google-u</a></p>`
      : `<p>Kada završite putovanje, možete ostaviti povratnu informaciju na našem Google profilu za <b>M Park Sarajevo</b>.</p>`;

    const html = `
<h2>Potvrda rezervacije</h2>
<p>Poštovani ${ime},</p>
<p>Vaša rezervacija parkinga kod Aerodroma Sarajevo je uspješno zaprimljena.</p>
<ul>
  <li><b>Datum dolaska:</b> ${datumDolaska}</li>
  <li><b>Datum odlaska:</b> ${datumOdlaska}</li>
  <li><b>Broj dana:</b> ${dani}</li>
  ${priceLi}
  <li><b>Ostavljanje ključa:</b> ${escapeHtml(kljucDaNe)}</li>
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
