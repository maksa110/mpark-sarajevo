import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CopyAffiliateLinkButton from "@/components/partner/CopyAffiliateLinkButton";
import PartnerLoginForm from "@/components/partner/PartnerLoginForm";
import PartnerLogoutButton from "@/components/partner/PartnerLogoutButton";
import { getAffiliateClickCount } from "@/lib/affiliate-clicks";
import { getAffiliatePartnerById } from "@/lib/affiliate";
import { listReservations } from "@/lib/db";
import { buildPartnerDashboard, formatPartnerMoney } from "@/lib/partner-dashboard";
import {
  PARTNER_COOKIE,
  getPartnerAuthConfigError,
  parsePartnerSessionToken,
} from "@/lib/partner-auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { partnerId } = await params;
  const partner = getAffiliatePartnerById(partnerId);
  if (!partner) {
    return {};
  }

  return {
    title: `${partner.name} | Partner dashboard`,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

function bookingStatusLabel(status) {
  return status === "cancelled" ? "Cancelled" : "Confirmed";
}

function bookingStatusBadge(status) {
  return status === "cancelled"
    ? "bg-red-50 text-red-700 ring-red-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function commissionStatusLabel(status) {
  if (status === "paid") return "Paid";
  if (status === "cancelled") return "Cancelled";
  if (status === "unpaid") return "Unpaid";
  return "Pending";
}

function commissionStatusBadge(status) {
  if (status === "paid") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (status === "cancelled") {
    return "bg-red-50 text-red-700 ring-red-200";
  }
  if (status === "unpaid") {
    return "bg-amber-50 text-amber-800 ring-amber-200";
  }
  return "bg-sky-50 text-sky-700 ring-sky-200";
}

function getAffiliateLink(partnerId) {
  return `https://www.mpark-sarajevo.com/bs/rezervacija?ref=${partnerId}`;
}

export default async function PartnerPage({ params }) {
  const { partnerId } = await params;
  const partner = getAffiliatePartnerById(partnerId);
  if (!partner) {
    notFound();
  }

  const configError = getPartnerAuthConfigError(partner.id);
  if (configError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Partner dashboard
          </h1>
          <p className="mt-3 text-sm text-red-700">
            Partner prijava nije spremna. Postavite partner environment varijable.
          </p>
        </div>
      </main>
    );
  }

  const cookieStore = await cookies();
  const session = parsePartnerSessionToken(cookieStore.get(PARTNER_COOKIE)?.value);
  if (!session || session.partnerId !== partner.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
        <PartnerLoginForm partnerId={partner.id} partnerName={partner.name} />
      </main>
    );
  }

  const [reservations, clickCount] = await Promise.all([
    listReservations({ search: "" }),
    getAffiliateClickCount(partner.id),
  ]);
  const dashboard = buildPartnerDashboard(partner.id, reservations, clickCount);
  const affiliateLink = partner.referralUrl || getAffiliateLink(partner.id);
  const [promoCode, discountPercent] = Object.entries(partner.promoCodes)[0];
  const customerDiscount = `${discountPercent}%`;
  const commissionRate = `${partner.commissionPercent}%`;

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-brand-navy to-brand-navy-950 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-brand-lime">
                  Partner Dashboard
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {partner.name}
                </h1>
              </div>
              <PartnerLogoutButton />
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
            <div className="space-y-4">
              <InfoRow label="Affiliate Link" value={affiliateLink} mono />
              <div className="pt-1">
                <CopyAffiliateLinkButton link={affiliateLink} />
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
              <InfoRow label="Promo Code" value={promoCode} mono />
              <InfoRow label="Customer Discount" value={customerDiscount} />
              <InfoRow label="Commission" value={commissionRate} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Clicks" value={dashboard.totals.clicks} />
          <StatCard label="Total Reservations" value={dashboard.totals.reservations} />
          <StatCard
            label="Confirmed Reservations"
            value={dashboard.totals.confirmedReservations}
          />
          <StatCard
            label="Cancelled Reservations"
            value={dashboard.totals.cancelledReservations}
          />
          <StatCard
            label="Original Booking Value"
            value={formatPartnerMoney(dashboard.totals.originalBookingValue)}
          />
          <StatCard
            label="Discounts Given"
            value={formatPartnerMoney(dashboard.totals.discountsGiven)}
          />
          <StatCard
            label="Final Booking Value"
            value={formatPartnerMoney(dashboard.totals.finalBookingValue)}
          />
          <StatCard
            label="Total Commission"
            value={formatPartnerMoney(dashboard.totals.totalCommission)}
            tone="navy"
          />
          <StatCard
            label="Paid Commission"
            value={formatPartnerMoney(dashboard.totals.paidCommission)}
          />
          <StatCard
            label="Unpaid Commission"
            value={formatPartnerMoney(dashboard.totals.unpaidCommission)}
            tone="amber"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-600 shadow-sm">
              Only reservations generated through your affiliate link or promo code are shown.
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              How it works
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
              <p>• Customer books using your affiliate link or promo code.</p>
              <p>• Customer automatically receives a 10% discount.</p>
              <p>• You earn a 15% commission on the final booking value.</p>
              <p>• Commission becomes payable after the reservation is confirmed.</p>
              <p>• Paid commissions are marked automatically by the administrator.</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">Reservations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Booking Date</th>
                  <th className="px-4 py-3">Reservation ID</th>
                  <th className="px-4 py-3 text-right">Original Amount</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Final Amount</th>
                  <th className="px-4 py-3 text-right">Commission</th>
                  <th className="px-4 py-3">Booking Status</th>
                  <th className="px-4 py-3">Commission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {dashboard.reservations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-zinc-500">
                      No affiliate reservations yet.
                    </td>
                  </tr>
                ) : (
                  dashboard.reservations.map((row) => (
                    <tr key={row.reservationId} className="border-b border-zinc-100 even:bg-zinc-50/60">
                      <td className="px-4 py-3 text-zinc-700">{row.bookingDate}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">
                        {row.reservationId}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700">
                        {formatPartnerMoney(row.originalAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700">
                        {formatPartnerMoney(row.discountAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700">
                        {formatPartnerMoney(row.finalAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700">
                        {formatPartnerMoney(row.commissionAmount)}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${bookingStatusBadge(row.bookingStatus)}`}
                        >
                          {bookingStatusLabel(row.bookingStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${commissionStatusBadge(row.commissionStatus)}`}
                        >
                          {commissionStatusLabel(row.commissionStatus)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, tone = "default" }) {
  const toneClass =
    tone === "navy"
      ? "border-brand-navy bg-brand-navy text-white shadow-brand-navy/15"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-zinc-200 bg-white text-zinc-900";
  const labelClass =
    tone === "navy"
      ? "text-white/70"
      : tone === "amber"
        ? "text-amber-800/80"
        : "text-zinc-500";

  return (
    <div className={`rounded-2xl border px-5 py-5 shadow-sm ${toneClass}`}>
      <div className={`text-xs font-medium uppercase tracking-[0.16em] ${labelClass}`}>
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 break-all text-sm font-medium text-zinc-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

