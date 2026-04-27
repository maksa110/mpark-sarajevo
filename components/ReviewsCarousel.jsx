"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ReviewsCarousel({ children, prevLabel, nextLabel }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = 20;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative mt-10">
      <ul
        ref={trackRef}
        role="list"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 [scrollbar-width:thin] [-ms-overflow-style:none]"
      >
        {children}
      </ul>

      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={!canPrev}
        aria-label={prevLabel}
        className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md transition hover:border-zinc-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5 text-zinc-700" aria-hidden />
      </button>

      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={!canNext}
        aria-label={nextLabel}
        className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md transition hover:border-zinc-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-0"
      >
        <ChevronRight className="h-5 w-5 text-zinc-700" aria-hidden />
      </button>
    </div>
  );
}
