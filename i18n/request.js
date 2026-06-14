import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  let messages = (await import(`@/messages/${locale}.json`)).default;

  if (locale === "bs") {
    const pillars = (await import(`@/messages/seo-pillars.bs.json`)).default;
    const blog = (await import(`@/messages/blog.bs.json`)).default;
    messages = { ...messages, ...pillars, ...blog };
  } else if (locale === "en") {
    const seo = (await import(`@/messages/en.seo.json`)).default;
    const pillars = (await import(`@/messages/seo-pillars.en.json`)).default;
    const blog = (await import(`@/messages/blog.en.json`)).default;
    messages = { ...messages, ...seo, ...pillars, ...blog };
  } else if (locale === "de") {
    const seo = (await import(`@/messages/de.seo.json`)).default;
    const pillars = (await import(`@/messages/seo-pillars.de.json`)).default;
    const blog = (await import(`@/messages/blog.de.json`)).default;
    messages = { ...messages, ...seo, ...pillars, ...blog };
  }

  return {
    locale,
    messages,
    timeZone: "Europe/Sarajevo",
  };
});
