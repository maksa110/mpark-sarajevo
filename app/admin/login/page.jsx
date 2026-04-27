"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me").then((r) => {
      if (!cancelled && r.ok) router.replace("/admin");
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(data.error || "Prijava nije uspjela.");
        return;
      }
      router.replace("/admin");
    } catch {
      setErr("Mrežna greška. Pokušajte ponovo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-navy via-brand-navy-950 to-brand-navy px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-zinc-200">
          <Image
            src="/logo.png"
            alt="M Park Sarajevo"
            width={128}
            height={128}
            priority
            sizes="64px"
            className="h-16 w-16 object-cover"
          />
        </div>
        <h1 className="mt-6 text-center text-xl font-semibold tracking-tight text-zinc-900">
          Admin prijava
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">
          M Park Sarajevo — upravljanje rezervacijama
        </p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="admin-pw"
              className="text-sm font-medium text-zinc-800"
            >
              Lozinka
            </label>
            <input
              id="admin-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/30"
              required
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-brand-navy text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy-950 disabled:opacity-50"
          >
            {busy ? "Prijava…" : "Prijavi se"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="font-medium text-lime-700 hover:underline">
            ← Nazad na sajt
          </Link>
        </p>
      </div>
    </div>
  );
}
