"use client";

import { useEffect } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";

/**
 * Single fixed-position toast. Auto-dismisses after `duration` ms.
 * Render conditionally from the parent — only one is shown at a time.
 *
 * Props:
 *  - open   : boolean
 *  - kind?  : "success" | "error" (default "success")
 *  - message: string
 *  - duration?: number (default 4000)
 *  - onClose : () => void
 */
export default function Toast({
  open,
  kind = "success",
  message,
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const isError = kind === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className="pointer-events-none fixed bottom-4 right-4 z-[110] flex justify-end sm:bottom-6 sm:right-6"
    >
      <div
        className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl px-4 py-3 shadow-lg ring-1 motion-safe:animate-fade-up ${
          isError
            ? "bg-red-50 text-red-900 ring-red-200"
            : "bg-lime-50 text-lime-900 ring-lime-200"
        }`}
      >
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            isError ? "text-red-600" : "text-lime-600"
          }`}
          aria-hidden
        />
        <p className="text-sm font-medium leading-snug">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`-mr-1 -mt-1 ml-1 rounded-lg p-1 transition ${
            isError
              ? "text-red-500 hover:bg-red-100"
              : "text-lime-700 hover:bg-lime-100"
          }`}
          aria-label="Zatvori obavijest"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
