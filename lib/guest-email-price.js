const PRICE_COPY = {
  bs: {
    total: "Iznos",
    original: "Redovna cijena",
    promoCode: "Promo kod",
    discount: "Popust",
    savings: "Ušteda",
    final: "Konačna cijena za plaćanje",
  },
  en: {
    total: "Total",
    original: "Original price",
    promoCode: "Promo code",
    discount: "Discount",
    savings: "You save",
    final: "Final price to pay",
  },
  de: {
    total: "Gesamtpreis",
    original: "Ursprünglicher Preis",
    promoCode: "Aktionscode",
    discount: "Rabatt",
    savings: "Ersparnis",
    final: "Endpreis",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatStoredAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";
  return Number.isInteger(amount)
    ? String(amount)
    : amount.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function normalizeGuestEmailLocale(locale) {
  return Object.hasOwn(PRICE_COPY, locale) ? locale : "bs";
}

export function renderGuestEmailPriceRows(reservation, locale = "bs", currency = "KM") {
  const copy = PRICE_COPY[normalizeGuestEmailLocale(locale)];
  const promoCode = String(reservation?.promoCode || "").trim();
  const discountPercent = Number(reservation?.discountPercent);
  const discountAmount = Number(reservation?.discountAmount);
  const hasDiscount =
    Boolean(promoCode) &&
    Number.isFinite(discountPercent) &&
    discountPercent > 0 &&
    Number.isFinite(discountAmount) &&
    discountAmount > 0;

  const originalAmount = formatStoredAmount(reservation?.originalAmount);
  const finalAmount = formatStoredAmount(reservation?.finalAmount);
  const safeCurrency = escapeHtml(currency);

  if (!hasDiscount) {
    return `<li><b>${escapeHtml(copy.total)}:</b> ${escapeHtml(
      finalAmount
    )} ${safeCurrency}</li>`;
  }

  return `
  <li><b>${escapeHtml(copy.original)}:</b> ${escapeHtml(originalAmount)} ${safeCurrency}</li>
  <li><b>${escapeHtml(copy.promoCode)}:</b> ${escapeHtml(promoCode)}</li>
  <li><b>${escapeHtml(copy.discount)}:</b> ${escapeHtml(discountPercent)}%</li>
  <li><b>${escapeHtml(copy.savings)}:</b> ${escapeHtml(
    formatStoredAmount(discountAmount)
  )} ${safeCurrency}</li>
  <li style="font-size:18px"><strong>${escapeHtml(copy.final)}: ${escapeHtml(
    finalAmount
  )} ${safeCurrency}</strong></li>`.trim();
}
