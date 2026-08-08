"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";

const PHONE_NUMBER = "+38761512152";
const WHATSAPP_URL =
  "https://wa.me/38761512152?text=Hello!%20I%20would%20like%20to%20reserve%20parking%20at%20mPark%20Sarajevo.";
const VIBER_URL = "viber://chat?number=%2B38761512152";
const VIBER_FALLBACK_URL = "https://www.viber.com/en/download/";

const actionClass =
  "flex min-h-12 items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-navy shadow-lg shadow-brand-navy/10 transition duration-200 hover:-translate-y-0.5 hover:border-brand-lime hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-lime/50 motion-reduce:transform-none motion-reduce:transition-none";

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const widgetRef = useRef(null);
  const toggleRef = useRef(null);
  const firstActionRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (!widgetRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    firstActionRef.current?.focus();

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleViberClick(event) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    let appOpened = false;

    const markAppOpened = () => {
      appOpened = true;
      cleanup();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") markAppOpened();
    };

    const cleanup = () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", markAppOpened);
      window.removeEventListener("blur", markAppOpened);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", markAppOpened, { once: true });
    window.addEventListener("blur", markAppOpened, { once: true });
    window.location.assign(VIBER_URL);

    window.setTimeout(() => {
      cleanup();
      if (!appOpened) window.location.assign(VIBER_FALLBACK_URL);
    }, 1200);
  }

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      role="region"
      aria-label="Contact options"
    >
      <div
        id={menuId}
        aria-hidden={!isOpen}
        className={`flex flex-col items-end gap-2 transition duration-200 motion-reduce:transition-none ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <a
          ref={firstActionRef}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isOpen ? 0 : -1}
          aria-label="Contact M Park Sarajevo on WhatsApp"
          className={actionClass}
        >
          <span className="grid size-8 place-items-center rounded-full bg-[#25D366] text-white">
            <MessageCircle aria-hidden="true" size={18} strokeWidth={2.5} />
          </span>
          WhatsApp
        </a>

        <a
          href={VIBER_URL}
          onClick={handleViberClick}
          tabIndex={isOpen ? 0 : -1}
          aria-label="Contact M Park Sarajevo on Viber"
          className={actionClass}
        >
          <span className="grid size-8 place-items-center rounded-full bg-[#7360F2] text-white">
            <MessageCircle aria-hidden="true" size={18} strokeWidth={2.5} />
          </span>
          Viber
        </a>

        <a
          href={`tel:${PHONE_NUMBER}`}
          tabIndex={isOpen ? 0 : -1}
          aria-label="Call M Park Sarajevo at +387 61 512 152"
          className={actionClass}
        >
          <span className="grid size-8 place-items-center rounded-full bg-brand-navy text-brand-lime">
            <Phone aria-hidden="true" size={18} strokeWidth={2.5} />
          </span>
          Call
        </a>
      </div>

      <button
        ref={toggleRef}
        type="button"
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className="group flex min-h-14 items-center gap-2.5 rounded-full bg-brand-navy px-5 py-3 font-extrabold text-white shadow-xl shadow-brand-navy/25 ring-1 ring-white/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-lime/60 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand-lime text-brand-navy transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none">
          {isOpen ? (
            <X aria-hidden="true" size={19} strokeWidth={2.5} />
          ) : (
            <MessageCircle aria-hidden="true" size={19} strokeWidth={2.5} />
          )}
        </span>
        <span>{isOpen ? "Close" : "Contact Us"}</span>
      </button>
    </div>
  );
}
