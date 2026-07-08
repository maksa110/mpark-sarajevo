"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerLoginForm({ partnerId, partnerName }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/partner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "Prijava nije uspjela.");
        return;
      }
      router.refresh();
    } catch {
      setError("Mrežna greška. Pokušajte ponovo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Partner dashboard
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{partnerName}</p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="partner-password"
            className="text-sm font-medium text-zinc-800"
          >
            Lozinka
          </label>
          <input
            id="partner-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/30"
            required
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-brand-navy text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy-950 disabled:opacity-50"
        >
          {busy ? "Prijava..." : "Prijavi se"}
        </button>
      </form>
    </div>
  );
}
