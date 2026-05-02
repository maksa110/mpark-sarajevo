import "../globals.css";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeMeta } from "@/i18n/routing";
import { SITE } from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-montserrat",
});

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "metadata" });
  const meta = localeMeta[locale];

  const title = t("title");
  const description = t("description");

  const kw = t.raw("keywords");
  const origin = SITE.url.replace(/\/$/, "");

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${origin}/${l}`])
  );
  languages["x-default"] = `${origin}/${routing.defaultLocale}`;

  return {
    metadataBase: new URL(SITE.url),
    // Cijeli naslov u <title> (bez templatea — izbjegava se \"segment | marka\" u tabu)
    title,
    description,
    keywords: Array.isArray(kw) ? kw : [],
    applicationName: SITE.brand,
    authors: [{ name: SITE.brand, url: SITE.url }],
    creator: SITE.brand,
    publisher: SITE.brand,
    category: "Parking",
    alternates: {
      canonical: `${origin}/${locale}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      url: `${SITE.url}/${locale}`,
      siteName: SITE.brand,
      title: t("ogTitle"),
      description: t("ogDescription"),
      // Images auto-populated by app/[locale]/opengraph-image.jsx
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("twitterDescription"),
      // Images auto-populated by app/[locale]/twitter-image (mirrors opengraph-image)
    },
    // Favicon: službeni logo PNG, zatim SVG rezerva
    icons: {
      icon: [
        { url: "/logo.png", type: "image/png", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: ["/logo.png"],
    },
    appleWebApp: {
      title: SITE.brand,
      capable: true,
      statusBarStyle: "default",
    },
    other: {
      "msapplication-TileColor": "#0B1A2E",
    },
    manifest: "/site.webmanifest",
  };
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B1A2E" },
    { media: "(prefers-color-scheme: dark)", color: "#06121F" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const meta = localeMeta[locale];

  return (
    <html lang={meta.htmlLang} className={montserrat.variable}>
      <head>
        {/* Without JS, force scroll-reveal placeholders to be visible.
            Guarantees crawlers/AT/no-JS users see all content. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;transition:none!important;}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
