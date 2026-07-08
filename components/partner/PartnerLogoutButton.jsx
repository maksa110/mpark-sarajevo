"use client";

import { useRouter } from "next/navigation";

export default function PartnerLogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/partner/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
    >
      Odjava
    </button>
  );
}
