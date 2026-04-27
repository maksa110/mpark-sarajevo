"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * Lightweight, accessible confirmation modal.
 * Tailwind-only — no extra UI library dependency.
 *
 * Props:
 *  - open       : boolean
 *  - title      : string
 *  - description: string
 *  - confirmLabel?: string (default "Potvrdi")
 *  - cancelLabel? : string (default "Otkaži")
 *  - destructive? : boolean (red confirm button)
 *  - loading?     : boolean (disables buttons + spinner on confirm)
 *  - onConfirm    : () => void | Promise<void>
 *  - onCancel     : () => void
 */
export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Potvrdi",
  cancelLabel = "Otkaži",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Focus the confirm button after a short tick so screen readers announce it
    const t = setTimeout(() => confirmRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-zinc-900/55 backdrop-blur-sm"
        onClick={() => !loading && onCancel?.()}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-900/5 motion-safe:animate-fade-up">
        <button
          type="button"
          onClick={() => !loading && onCancel?.()}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
          aria-label="Zatvori"
          disabled={loading}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              destructive
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3
              id="confirm-title"
              className="text-base font-semibold text-zinc-900"
            >
              {title}
            </h3>
            <p
              id="confirm-desc"
              className="mt-1 text-sm leading-relaxed text-zinc-600"
            >
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${
              destructive
                ? "bg-red-600 hover:bg-red-500"
                : "bg-brand-navy hover:bg-brand-navy-950"
            }`}
          >
            {loading && (
              <span
                className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden
              />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
