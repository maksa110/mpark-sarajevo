import Link from "next/link";

/** Global 404 – nema root layouta s <html>; link vodi na default lokal. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 p-6 text-center">
      <p className="text-sm font-medium text-zinc-500">404</p>
      <h1 className="mt-2 text-xl font-semibold text-zinc-900">
        Stranica nije pronađena
      </h1>
      <Link
        className="mt-6 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white"
        href="/bs"
      >
        Početna
      </Link>
    </div>
  );
}
