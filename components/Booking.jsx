"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, TrendingDown } from "lucide-react";
import { computePriceQuote } from "@/lib/pricing";

const inputClass =
  "mt-2 min-h-[48px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 shadow-sm outline-none transition focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/30 sm:text-sm";

const radioCard =
  "flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-brand-lime has-[:checked]:border-brand-lime has-[:checked]:ring-2 has-[:checked]:ring-brand-lime/25";

export default function Booking() {
  const t = useTranslations("booking");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [arrival, setArrival] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departure, setDeparture] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  /** null dok korisnik ne odabere */
  const [leaveKey, setLeaveKey] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [ok, setOk] = useState(false);
  /** idle | loading | ok | fail */
  const [capState, setCapState] = useState("idle");
  const [capFailCode, setCapFailCode] = useState(null);

  const quote = useMemo(
    () => computePriceQuote(arrival, arrivalTime, departure, departureTime),
    [arrival, arrivalTime, departure, departureTime]
  );

  const datesIntervalOk = useMemo(() => {
    if (!arrival || !arrivalTime || !departure || !departureTime) return false;
    const a = new Date(`${arrival}T${arrivalTime}`);
    const d = new Date(`${departure}T${departureTime}`);
    return !Number.isNaN(+a) && !Number.isNaN(+d) && d > a;
  }, [arrival, arrivalTime, departure, departureTime]);

  useEffect(() => {
    let cancelled = false;

    if (leaveKey === null || !datesIntervalOk) {
      setCapState("idle");
      setCapFailCode(null);
      return undefined;
    }

    setCapState("loading");
    setCapFailCode(null);

    const timer = setTimeout(async () => {
      try {
        const qs = new URLSearchParams({
          arrivalDate: arrival,
          arrivalTime,
          departureDate: departure,
          departureTime,
          leaveKey: leaveKey ? "true" : "false",
        });
        const res = await fetch(`/api/reservations/capacity?${qs}`);
        const data = res.ok ? await res.json() : {};
        if (cancelled) return;
        if (data.ok === true) {
          setCapState("ok");
          setCapFailCode(null);
        } else {
          setCapState("fail");
          setCapFailCode(
            ["CAPACITY_NO_KEY", "CAPACITY_WITH_KEY"].includes(data.code)
              ? data.code
              : "CAPACITY_WITH_KEY"
          );
        }
      } catch {
        if (!cancelled) {
          setCapState("fail");
          setCapFailCode("CAPACITY_WITH_KEY");
        }
      }
    }, 420);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    arrival,
    arrivalTime,
    departure,
    departureTime,
    leaveKey,
    datesIntervalOk,
  ]);

  const validate = useCallback(() => {
    const e = {};
    const required = t("errors.required");
    if (!fullName.trim()) e.fullName = required;
    if (!phone.trim()) e.phone = required;
    if (leaveKey === null) e.leaveKey = required;
    if (!email.trim()) e.email = required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = t("errors.email");
    }
    if (!arrival) e.arrival = required;
    if (!arrivalTime.trim()) e.arrivalTime = required;
    if (!departure) e.departure = required;
    if (!departureTime.trim()) e.departureTime = required;
    if (arrival && arrivalTime && departure && departureTime) {
      const a = new Date(`${arrival}T${arrivalTime}`);
      const d = new Date(`${departure}T${departureTime}`);
      if (d <= a) e.dates = t("errors.datesOrder");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [
    fullName,
    phone,
    email,
    arrival,
    arrivalTime,
    departure,
    departureTime,
    leaveKey,
    t,
  ]);

  async function onSubmit(ev) {
    ev.preventDefault();
    setErrMsg("");
    setOk(false);
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          arrivalDate: arrival,
          arrivalTime,
          departureDate: departure,
          departureTime,
          leaveKey,
        }),
      });
      if (!res.ok) {
        const raw = await res.text();
        let msg = `Greška ${res.status}`;
        try {
          const data = raw ? JSON.parse(raw) : {};
          if (data?.errorCode) {
            msg = t(`errors.${data.errorCode}`);
          } else if (data?.error) msg = data.error;
        } catch {
          if (raw?.trim().slice(0, 1) === "<")
            msg = "Server je vratio grešku. Provjeri Vercel deploy (Blob, env) i pokušaj opet.";
        }
        throw new Error(msg);
      }
      setOk(true);
      setFullName("");
      setPhone("");
      setEmail("");
      setArrival("");
      setArrivalTime("");
      setDeparture("");
      setDepartureTime("");
      setLeaveKey(null);
      setCapState("idle");
      setCapFailCode(null);
      setErrors({});
    } catch (err) {
      setErrMsg(err?.message || t("errors.submit"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="book"
      className="scroll-mt-20 border-b border-zinc-200/80 py-16 sm:py-20"
      aria-labelledby="book-h2"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-lg text-center sm:text-left">
          <h2
            id="book-h2"
            className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
          >
            {t("h2")}
          </h2>
          <p className="mt-3 text-zinc-600">{t("lead")}</p>
        </div>
        <div className="mx-auto mt-10 max-w-lg">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {ok && (
              <p
                className="mb-5 rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-medium text-lime-900"
                role="status"
              >
                {t("success")}
              </p>
            )}
            <form className="space-y-5" onSubmit={onSubmit} noValidate>
              <div>
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-zinc-800"
                >
                  {t("labels.fullName")}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-zinc-800"
                >
                  {t("labels.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  autoComplete="tel"
                  inputMode="tel"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-800"
                >
                  {t("labels.email")}
                  <span className="text-red-600" aria-hidden>
                    {" "}
                    *
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                  placeholder={t("placeholders.email")}
                  required
                  aria-required="true"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="arrival"
                    className="text-sm font-medium text-zinc-800"
                  >
                    {t("labels.arrivalDate")}
                  </label>
                  <input
                    id="arrival"
                    name="arrival"
                    type="date"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className={inputClass}
                  />
                  {errors.arrival && (
                    <p className="mt-1 text-sm text-red-600">{errors.arrival}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="arrivalTime"
                    className="text-sm font-medium text-zinc-800"
                  >
                    {t("labels.arrivalTime")}
                  </label>
                  <input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className={inputClass}
                  />
                  {errors.arrivalTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.arrivalTime}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="departure"
                    className="text-sm font-medium text-zinc-800"
                  >
                    {t("labels.departureDate")}
                  </label>
                  <input
                    id="departure"
                    name="departure"
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className={inputClass}
                  />
                  {errors.departure && (
                    <p className="mt-1 text-sm text-red-600">{errors.departure}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="departureTime"
                    className="text-sm font-medium text-zinc-800"
                  >
                    {t("labels.departureTime")}
                  </label>
                  <input
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className={inputClass}
                  />
                  {errors.departureTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.departureTime}
                    </p>
                  )}
                </div>
              </div>
              {errors.dates && (
                <p className="text-sm text-red-600">{errors.dates}</p>
              )}
              <fieldset className="space-y-3 border-0 p-0">
                <legend className="text-sm font-medium text-zinc-800">
                  {t("labels.leaveKeyGroup")}
                </legend>
                <div className="space-y-2">
                  <label className={radioCard}>
                    <input
                      type="radio"
                      name="leaveKeyOpt"
                      className="mt-1 h-4 w-4 shrink-0 accent-brand-navy"
                      checked={leaveKey === true}
                      onChange={() => setLeaveKey(true)}
                    />
                    <span>{t("labels.leaveKeyYes")}</span>
                  </label>
                  <label className={radioCard}>
                    <input
                      type="radio"
                      name="leaveKeyOpt"
                      className="mt-1 h-4 w-4 shrink-0 accent-brand-navy"
                      checked={leaveKey === false}
                      onChange={() => setLeaveKey(false)}
                    />
                    <span>{t("labels.leaveKeyNo")}</span>
                  </label>
                </div>
                {errors.leaveKey && (
                  <p className="text-sm text-red-600">{errors.leaveKey}</p>
                )}
                {datesIntervalOk && leaveKey !== null && capState === "loading" && (
                  <p
                    className="text-sm text-zinc-500"
                    role="status"
                    aria-live="polite"
                  >
                    {t("errors.capacityChecking")}
                  </p>
                )}
                {datesIntervalOk && leaveKey !== null && capState === "fail" && (
                  <p className="text-sm text-red-600" role="alert">
                    {capFailCode === "CAPACITY_NO_KEY" ||
                    capFailCode === "CAPACITY_WITH_KEY"
                      ? t(`errors.${capFailCode}`)
                      : t("errors.capacityBlocked")}
                  </p>
                )}
              </fieldset>
              {quote && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`overflow-hidden rounded-2xl border p-5 transition motion-safe:animate-fade-up ${
                    quote.tier === "t3"
                      ? "border-brand-lime/60 bg-gradient-to-br from-lime-50 to-lime-100/40 ring-1 ring-brand-lime/30"
                      : "border-lime-200 bg-lime-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime-700">
                        {t("summary.title")}
                      </p>
                      <p className="mt-1 text-sm font-medium text-zinc-700">
                        {t("summary.rate", {
                          rate: quote.ratePerDay,
                          count: quote.days,
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        quote.tier === "t3"
                          ? "bg-brand-navy text-brand-lime ring-1 ring-brand-lime/40"
                          : "bg-white text-zinc-700 ring-1 ring-zinc-200"
                      }`}
                    >
                      {quote.tier === "t3" && (
                        <Sparkles className="h-3 w-3" aria-hidden />
                      )}
                      {t(`summary.tierBadge.${quote.tier}`)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between border-t border-zinc-200/60 pt-4">
                    <span className="text-sm font-medium text-zinc-700">
                      {t("summary.total")}
                    </span>
                    <span className="text-3xl font-extrabold tracking-tight text-brand-navy">
                      {quote.total} <span className="text-base">{quote.currency}</span>
                    </span>
                  </div>

                  {quote.extraDaysToNextTier > 0 &&
                    quote.savingsPerDayAtNextTier > 0 && (
                      <p className="mt-3 flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs leading-relaxed text-lime-900 ring-1 ring-lime-200/80">
                        <TrendingDown
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-700"
                          aria-hidden
                        />
                        <span>
                          {t("summary.saveHint", {
                            extra: quote.extraDaysToNextTier,
                            rate:
                              quote.ratePerDay - quote.savingsPerDayAtNextTier,
                            save: quote.savingsPerDayAtNextTier,
                          })}
                        </span>
                      </p>
                    )}

                  <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                    {t("summary.note")}
                  </p>
                </div>
              )}
              {errMsg && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {errMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={
                  busy ||
                  (datesIntervalOk &&
                    leaveKey !== null &&
                    capState !== "ok")
                }
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-lime text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/25 ring-1 ring-brand-lime/40 transition duration-200 hover:scale-[1.01] hover:bg-brand-lime-300 hover:shadow-brand-lime/40 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                {busy ? t("submitting") : t("submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
