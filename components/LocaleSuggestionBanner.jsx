"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  LOCALE_HINT_COOKIE,
  LOCALE_HINT_DISMISSED_COOKIE,
  LOCALE_PREFERRED_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
} from "@/lib/i18n-cookies";

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name, value, maxAge = LOCALE_COOKIE_MAX_AGE) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearCookie(name) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Soft geo-prijedlog jezika — samo na /bs početnici, bez redirecta.
 * Ne prikazuje se ako je korisnik već odabrao jezik ili odbio prijedlog.
 */
export default function LocaleSuggestionBanner() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("localeSuggestion");
  const [hintLocale, setHintLocale] = useState(null);

  const isHome = pathname === "/" || pathname === "";

  useEffect(() => {
    if (locale !== routing.defaultLocale || !isHome) {
      setHintLocale(null);
      return;
    }

    const preferred = readCookie(LOCALE_PREFERRED_COOKIE);
    const dismissed = readCookie(LOCALE_HINT_DISMISSED_COOKIE);
    const hint = readCookie(LOCALE_HINT_COOKIE);

    if (
      preferred ||
      dismissed ||
      !hint ||
      hint === routing.defaultLocale ||
      !routing.locales.includes(hint)
    ) {
      setHintLocale(null);
      return;
    }

    setHintLocale(hint);
  }, [locale, isHome, pathname]);

  if (!hintLocale) return null;

  const messageKey = hintLocale === "de" ? "messageDe" : "messageEn";
  const switchKey = hintLocale === "de" ? "switchToDe" : "switchToEn";

  function accept() {
    writeCookie(LOCALE_PREFERRED_COOKIE, hintLocale);
    clearCookie(LOCALE_HINT_COOKIE);
    setHintLocale(null);
    router.replace(pathname, { locale: hintLocale });
  }

  function dismiss() {
    writeCookie(LOCALE_HINT_DISMISSED_COOKIE, "1");
    clearCookie(LOCALE_HINT_COOKIE);
    setHintLocale(null);
  }

  return (
    <div
      role="region"
      aria-label={t("ariaLabel")}
      className="border-b border-brand-lime/30 bg-brand-navy/95 px-4 py-3 text-center text-sm text-white backdrop-blur-sm"
    >
      <p className="mx-auto max-w-3xl leading-relaxed">
        <span>{t(messageKey)}</span>{" "}
        <button
          type="button"
          onClick={accept}
          className="font-semibold text-brand-lime underline decoration-brand-lime/50 underline-offset-2 hover:text-brand-lime-300"
        >
          {t(switchKey)}
        </button>
        <span className="mx-2 text-white/40" aria-hidden>
          ·
        </span>
        <button
          type="button"
          onClick={dismiss}
          className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-white"
        >
          {t("dismiss")}
        </button>
      </p>
    </div>
  );
}
