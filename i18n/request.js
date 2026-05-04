import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  let messages = (await import(`@/messages/${locale}.json`)).default;

  if (locale === "en") {
    const seo = (await import(`@/messages/en.seo.json`)).default;
    messages = { ...messages, ...seo };
  } else if (locale === "de") {
    const seo = (await import(`@/messages/de.seo.json`)).default;
    messages = { ...messages, ...seo };
  }

  return {
    locale,
    messages,
    timeZone: "Europe/Sarajevo",
  };
});
