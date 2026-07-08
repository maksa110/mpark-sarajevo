"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { BOOKING_STATUS } from "@/lib/reservation-record";
import {
  STATUS,
  STATUS_BADGE,
  STATUS_LABEL,
  deriveStatus,
} from "@/lib/reservation-status";
import { COMMISSION_STATUS } from "@/lib/affiliate";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast from "@/components/admin/Toast";

const COMPLETED_TOOLTIP = "Završene rezervacije se ne mogu brisati.";

function bookingLabel(status) {
  return status === BOOKING_STATUS.CANCELLED ? "Cancelled" : "Confirmed";
}

function bookingBadge(status) {
  return status === BOOKING_STATUS.CANCELLED
    ? "bg-red-50 text-red-700 ring-red-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function commissionStatusLabel(status) {
  if (status === COMMISSION_STATUS.PAID) return "Paid";
  if (status === COMMISSION_STATUS.UNPAID) return "Unpaid";
  if (status === COMMISSION_STATUS.CANCELLED) return "Cancelled";
  return "-";
}

function commissionStatusBadge(status) {
  if (status === COMMISSION_STATUS.PAID) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (status === COMMISSION_STATUS.UNPAID) {
    return "bg-amber-50 text-amber-800 ring-amber-200";
  }
  if (status === COMMISSION_STATUS.CANCELLED) {
    return "bg-red-50 text-red-700 ring-red-200";
  }
  return "bg-zinc-100 text-zinc-500 ring-zinc-200";
}

function formatMoney(amount) {
  return `${Number(amount || 0).toFixed(2)} KM`;
}

function canMarkCommissionPaid(row) {
  return (
    Boolean(row?.affiliatePartnerId) &&
    row?.commissionStatus === COMMISSION_STATUS.UNPAID &&
    row?.bookingStatus === BOOKING_STATUS.CONFIRMED
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/me");
        if (cancelled) return;
        if (!r.ok) {
          router.replace("/admin/login");
          return;
        }
        setAuthed(true);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim()) p.set("search", search.trim());
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [search]);

  const load = useCallback(async () => {
    setErr("");
    setLoading(true);
    try {
      const r = await fetch(`/api/reservations${qs}`);
      if (!r.ok) {
        setErr(r.status === 401 ? "Sesija je istekla. Prijavite se ponovo." : "Učitavanje nije uspjelo.");
        return;
      }
      const data = await r.json();
      const nextRows = Array.isArray(data) ? data : [];
      nextRows.sort((a, b) => {
        const adt = new Date(`${a.arrivalDate}T${a.arrivalTime || "00:00"}`);
        const bdt = new Date(`${b.arrivalDate}T${b.arrivalTime || "00:00"}`);
        return adt - bdt;
      });
      setRows(nextRows);
    } catch {
      setErr("Mrežna greška.");
    } finally {
      setLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [authed, load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  function requestDelete(row) {
    if (deriveStatus(row, now) === STATUS.COMPLETED) return;
    setConfirmTarget(row);
  }

  const performDelete = useCallback(async () => {
    if (!confirmTarget || deleting) return;
    const target = confirmTarget;
    setDeleting(true);
    const snapshot = rows;
    setRows((curr) => curr.filter((x) => x.id !== target.id));

    try {
      const r = await fetch(`/api/reservations/${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      });
      if (!r.ok) {
        setRows(snapshot);
        const data = await r.json().catch(() => ({}));
        setToast({
          kind: "error",
          message: data?.error || "Brisanje nije uspjelo.",
        });
        return;
      }
      setToast({
        kind: "success",
        message: `Rezervacija „${target.name}” je obrisana.`,
      });
    } catch {
      setRows(snapshot);
      setToast({ kind: "error", message: "Mrežna greška pri brisanju." });
    } finally {
      setDeleting(false);
      setConfirmTarget(null);
    }
  }, [confirmTarget, deleting, rows]);

  const patchReservation = useCallback(async (id, payload, successMessage) => {
    setUpdatingId(id);
    try {
      const r = await fetch(`/api/reservations/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data?.error || "Ažuriranje nije uspjelo.");
      }
      const updated = await r.json();
      setRows((curr) => curr.map((row) => (row.id === id ? updated : row)));
      setToast({ kind: "success", message: successMessage });
    } catch (error) {
      setToast({ kind: "error", message: error?.message || "Ažuriranje nije uspjelo." });
    } finally {
      setUpdatingId(null);
    }
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm text-zinc-600">
        Učitavanje…
      </div>
    );
  }
  if (!authed) return null;

  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Sarajevo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const todaysArrivals = rows.filter((r) => r.arrivalDate === todayStr);
  const upcomingArrivals = rows.filter((r) => r.arrivalDate > todayStr);
  const counts = rows.reduce(
    (acc, r) => {
      const s = deriveStatus(r, now);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    { [STATUS.UPCOMING]: 0, [STATUS.ACTIVE]: 0, [STATUS.COMPLETED]: 0 }
  );

  return (
    <div className="min-h-screen bg-zinc-100">
      <div
        className={`fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm transition lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
        onClick={() => setMenuOpen(false)}
      />
      <div className="flex min-h-screen">
        <aside
          className={`fixed left-0 top-0 z-50 flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white shadow-sm transition-transform duration-200 lg:static lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-4 py-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl text-zinc-900"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-zinc-200">
                <Image
                  src="/logo.png"
                  alt=""
                  width={72}
                  height={72}
                  priority
                  sizes="36px"
                  className="h-9 w-9 object-cover"
                />
              </span>
              <span className="text-sm font-semibold">M PARK Admin</span>
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-label="Zatvori meni"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-900"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutGrid className="h-4 w-4 text-zinc-500" aria-hidden />
              Rezervacije
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
              onClick={() => setMenuOpen(false)}
            >
              Javni sajt
            </Link>
          </nav>
          <div className="border-t border-zinc-100 p-3">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Odjava
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
            <button
              type="button"
              className="rounded-xl p-2 text-zinc-700 hover:bg-zinc-100"
              onClick={() => setMenuOpen(true)}
              aria-label="Otvori meni"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <span className="text-sm font-semibold text-zinc-900">M PARK</span>
            <span className="w-9" />
          </header>

          <main className="flex-1 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    Rezervacije
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    Pregled i upravljanje aktivnim rezervacijama.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={load}
                  className="inline-flex items-center gap-2 self-start rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    aria-hidden
                  />
                  Osvježi
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StatCard label="Nadolaze" value={counts[STATUS.UPCOMING]} tone="sky" />
                <StatCard label="Aktivne" value={counts[STATUS.ACTIVE]} tone="lime" />
                <StatCard label="Završene" value={counts[STATUS.COMPLETED]} tone="zinc" />
              </div>

              <div className="mt-8">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden
                  />
                  <input
                    type="search"
                    placeholder="Pretraga: ime, telefon, email, ID…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/30"
                  />
                </div>
              </div>

              {err && (
                <p
                  className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                >
                  {err}
                </p>
              )}

              <div className="mt-8">
                <h2 className="mb-2 text-lg font-semibold text-lime-700">
                  Današnji dolasci
                </h2>
                {todaysArrivals.length === 0 ? (
                  <div className="rounded-xl bg-lime-50 px-4 py-3 text-sm text-lime-800">
                    Nema dolazaka za danas.
                  </div>
                ) : (
                  <SimpleTable rows={todaysArrivals} accent="lime" now={now} />
                )}
              </div>

              <div className="mt-8">
                <h2 className="mb-2 text-lg font-semibold text-sky-700">
                  Nadolazeće rezervacije
                </h2>
                {upcomingArrivals.length === 0 ? (
                  <div className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-800">
                    Nema nadolazećih rezervacija.
                  </div>
                ) : (
                  <SimpleTable rows={upcomingArrivals} accent="sky" now={now} />
                )}
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1560px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50/80 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        <th className="px-4 py-3">Gost</th>
                        <th className="px-4 py-3">Affiliate Partner</th>
                        <th className="px-4 py-3">Promo Code</th>
                        <th className="px-4 py-3">Dolazak</th>
                        <th className="px-4 py-3">Odlazak</th>
                        <th className="px-4 py-3">Ključ</th>
                        <th className="px-4 py-3">Trip status</th>
                        <th className="px-4 py-3">Booking status</th>
                        <th className="px-4 py-3">Original Amount</th>
                        <th className="px-4 py-3">Discount</th>
                        <th className="px-4 py-3">Final Amount</th>
                        <th className="px-4 py-3">Commission</th>
                        <th className="px-4 py-3">Commission Status</th>
                        <th className="px-4 py-3 text-right">Akcije</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {loading && (
                        <tr>
                          <td colSpan={14} className="px-4 py-12 text-center text-zinc-500">
                            Učitavanje…
                          </td>
                        </tr>
                      )}
                      {!loading && rows.length === 0 && (
                        <tr>
                          <td colSpan={14} className="px-4 py-12 text-center text-zinc-500">
                            Nema rezervacija za prikaz.
                          </td>
                        </tr>
                      )}
                      {!loading &&
                        rows.map((row) => {
                          const status = deriveStatus(row, now);
                          const isCompleted = status === STATUS.COMPLETED;
                          const isUpdating = updatingId === row.id;
                          const isExpanded = expandedId === row.id;
                          const isPayableCommission = canMarkCommissionPaid(row);
                          return (
                            <Fragment key={row.id}>
                              <tr className="align-top transition hover:bg-zinc-50 even:bg-zinc-50/50">
                                <td className="px-4 py-3">
                                  <div className="font-medium text-zinc-900">{row.name}</div>
                                  <div className="mt-1 text-xs text-zinc-500">{row.phone}</div>
                                  <div className="mt-1 text-xs text-zinc-500">
                                    {row.email || "-"}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {row.affiliatePartnerName || "-"}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {row.promoCode || "-"}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {row.arrivalDate} {row.arrivalTime?.slice(0, 5)}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {row.departureDate} {row.departureTime?.slice(0, 5)}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {row.leaveKey === false ? "Bez ključa" : "Sa ključem"}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE[status]}`}
                                  >
                                    {STATUS_LABEL[status]}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${bookingBadge(row.bookingStatus)}`}
                                  >
                                    {bookingLabel(row.bookingStatus)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {formatMoney(row.originalAmount)}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {row.discountPercent > 0
                                    ? `${row.discountPercent}% / ${formatMoney(row.discountAmount)}`
                                    : formatMoney(row.discountAmount)}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {formatMoney(row.finalAmount)}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                  {row.affiliatePartnerId
                                    ? `${row.commissionPercent}% / ${formatMoney(row.commissionAmount)}`
                                    : "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${commissionStatusBadge(row.commissionStatus)}`}
                                  >
                                    {commissionStatusLabel(row.commissionStatus)}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedId((curr) => (curr === row.id ? null : row.id))
                                      }
                                      className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                                      ) : (
                                        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                                      )}
                                      Detalji
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={() =>
                                        patchReservation(
                                          row.id,
                                          {
                                            bookingStatus:
                                              row.bookingStatus === BOOKING_STATUS.CANCELLED
                                                ? BOOKING_STATUS.CONFIRMED
                                                : BOOKING_STATUS.CANCELLED,
                                          },
                                          row.bookingStatus === BOOKING_STATUS.CANCELLED
                                            ? "Rezervacija je vraćena na confirmed."
                                            : "Rezervacija je oznacena kao cancelled."
                                        )
                                      }
                                      className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60"
                                    >
                                      {row.bookingStatus === BOOKING_STATUS.CANCELLED
                                        ? "Vrati"
                                        : "Cancel"}
                                    </button>
                                    {isPayableCommission ? (
                                      <button
                                        type="button"
                                        disabled={isUpdating}
                                        onClick={() =>
                                          patchReservation(
                                            row.id,
                                            { commissionStatus: COMMISSION_STATUS.PAID },
                                            "Commission je oznacen kao paid."
                                          )
                                        }
                                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
                                      >
                                        Mark Commission Paid
                                      </button>
                                    ) : null}
                                    <DeleteButton
                                      disabled={isCompleted}
                                      loading={deleting && confirmTarget?.id === row.id}
                                      onClick={() => requestDelete(row)}
                                    />
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-zinc-50/80">
                                  <td colSpan={14} className="px-4 py-4">
                                    <DetailCard
                                      title="Booking details"
                                      lines={[
                                        `Reservation ID: ${row.id}`,
                                        `Customer: ${row.name}`,
                                        `Phone: ${row.phone}`,
                                        `Email: ${row.email || "-"}`,
                                        `Arrival: ${row.arrivalDate} ${row.arrivalTime}`,
                                        `Departure: ${row.departureDate} ${row.departureTime}`,
                                        `Key handling: ${
                                          row.leaveKey === false ? "Bez ključa" : "Sa ključem"
                                        }`,
                                        `Booking status: ${bookingLabel(row.bookingStatus)}`,
                                        `Affiliate partner: ${row.affiliatePartnerName || "-"}`,
                                        `Promo code: ${row.promoCode || "-"}`,
                                        `Original amount: ${formatMoney(row.originalAmount)}`,
                                        `Discount: ${formatMoney(row.discountAmount)}`,
                                        `Final amount: ${formatMoney(row.finalAmount)}`,
                                        `Commission: ${
                                          row.affiliatePartnerId
                                            ? `${row.commissionPercent}% / ${formatMoney(row.commissionAmount)}`
                                            : "-"
                                        }`,
                                        `Commission status: ${commissionStatusLabel(row.commissionStatus)}`,
                                      ]}
                                      actions={
                                        isPayableCommission ? (
                                          <button
                                            type="button"
                                            disabled={isUpdating}
                                            onClick={() =>
                                              patchReservation(
                                                row.id,
                                                { commissionStatus: COMMISSION_STATUS.PAID },
                                                "Commission je oznacen kao paid."
                                              )
                                            }
                                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
                                          >
                                            Mark Commission Paid
                                          </button>
                                        ) : null
                                      }
                                    />
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        destructive
        loading={deleting}
        title="Obriši rezervaciju?"
        description={
          confirmTarget
            ? `Da li ste sigurni da želite obrisati rezervaciju za „${confirmTarget.name}”? Ova akcija je trajna.`
            : ""
        }
        confirmLabel={deleting ? "Brisanje…" : "Potvrdi"}
        cancelLabel="Otkaži"
        onConfirm={performDelete}
        onCancel={() => {
          if (deleting) return;
          setConfirmTarget(null);
        }}
      />

      <Toast
        open={!!toast}
        kind={toast?.kind}
        message={toast?.message || ""}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

function DeleteButton({ disabled, loading, onClick }) {
  const base =
    "inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition";
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title={COMPLETED_TOOLTIP}
        aria-label={COMPLETED_TOOLTIP}
        className={`${base} cursor-not-allowed border border-zinc-200 bg-zinc-50 text-zinc-400`}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        Obriši
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label="Obriši rezervaciju"
      className={`${base} border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {loading ? (
        <span
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-700"
          aria-hidden
        />
      ) : (
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
      )}
      {loading ? "Brisanje…" : "Obriši"}
    </button>
  );
}

function StatCard({ label, value, tone }) {
  const toneCls =
    tone === "lime"
      ? "border-lime-200 bg-lime-50 text-lime-900"
      : tone === "sky"
        ? "border-sky-200 bg-sky-50 text-sky-900"
        : "border-zinc-200 bg-white text-zinc-800";
  return (
    <div className={`rounded-2xl border ${toneCls} px-4 py-3 shadow-sm`}>
      <div className="text-xs font-medium uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function SimpleTable({ rows, accent, now }) {
  const hover =
    accent === "lime"
      ? "hover:bg-lime-100/60 even:bg-lime-50/40"
      : "hover:bg-sky-100/60 even:bg-sky-50/40";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/80 text-xs font-medium uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3">Ime</th>
            <th className="px-4 py-3">Telefon</th>
            <th className="px-4 py-3">Ključ</th>
            <th className="px-4 py-3">Dolazak</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row) => {
            const status = deriveStatus(row, now);
            return (
              <tr key={row.id} className={`transition ${hover}`}>
                <td className="px-4 py-3 font-medium text-zinc-900">{row.name}</td>
                <td className="px-4 py-3 text-zinc-700">{row.phone}</td>
                <td className="px-4 py-3 text-zinc-700">
                  {row.leaveKey === false ? "Bez ključa" : "Sa ključem"}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {row.arrivalDate} {row.arrivalTime?.slice(0, 5)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE[status]}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DetailCard({ title, lines, actions = null }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <div className="mt-3 space-y-2 text-sm text-zinc-700">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {actions ? <div className="mt-4">{actions}</div> : null}
    </div>
  );
}
