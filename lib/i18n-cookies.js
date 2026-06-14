/** Korisnik je ručno odabrao jezik (Language switcher). */
export const LOCALE_PREFERRED_COOKIE = "MPARK_LOCALE_PREFERRED";

/** Korisnik je odbio geo-prijedlog jezika. */
export const LOCALE_HINT_DISMISSED_COOKIE = "MPARK_LOCALE_HINT_DISMISSED";

/** Middleware postavlja predloženi locale (en/de) — samo za soft banner, ne redirect. */
export const LOCALE_HINT_COOKIE = "MPARK_LOCALE_HINT";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const LOCALE_HINT_MAX_AGE = 60 * 60 * 2;

export function localeCookieOptions(maxAge = LOCALE_COOKIE_MAX_AGE) {
  return {
    path: "/",
    maxAge,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}
