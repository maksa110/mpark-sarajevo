"use client";

import dynamic from "next/dynamic";

const Booking = dynamic(() => import("@/components/Booking"), {
  ssr: false,
  loading: () => <BookingFallback />,
});

export default function DeferredBooking() {
  return <Booking />;
}

function BookingFallback() {
  return (
    <section
      id="book"
      className="scroll-mt-20 border-b border-zinc-200/80 py-16 sm:py-20"
      aria-labelledby="book-loading-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="animate-pulse space-y-5">
              <div className="space-y-3">
                <div
                  id="book-loading-title"
                  className="h-8 w-2/3 rounded-full bg-zinc-200"
                />
                <div className="h-4 w-full rounded-full bg-zinc-100" />
                <div className="h-4 w-3/4 rounded-full bg-zinc-100" />
              </div>
              <div className="space-y-4">
                <div className="h-12 rounded-2xl bg-zinc-100" />
                <div className="h-12 rounded-2xl bg-zinc-100" />
                <div className="h-12 rounded-2xl bg-zinc-100" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-12 rounded-2xl bg-zinc-100" />
                  <div className="h-12 rounded-2xl bg-zinc-100" />
                  <div className="h-12 rounded-2xl bg-zinc-100" />
                  <div className="h-12 rounded-2xl bg-zinc-100" />
                </div>
                <div className="h-24 rounded-2xl bg-zinc-100" />
                <div className="h-14 rounded-2xl bg-lime-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
