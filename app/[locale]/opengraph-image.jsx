import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

export const alt = "M Park Sarajevo – Privatni parking blizu Aerodroma Sarajevo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO_DATA_URL = `data:image/png;base64,${readFileSync(join(process.cwd(), "public", "logo.png")).toString("base64")}`;

const PRICE_BY_LOCALE = {
  bs: { value: "9 KM", per: "po danu" },
  en: { value: "€4.6", per: "per day" },
  de: { value: "€4,6", per: "pro Tag" },
};

const HEADLINE_BY_LOCALE = {
  bs: { line1: "Parking Aerodrom", line2: "Sarajevo" },
  en: { line1: "Sarajevo Airport", line2: "Parking" },
  de: { line1: "Flughafen-Parkplatz", line2: "Sarajevo" },
};

const FEATURES_BY_LOCALE = {
  bs: ["24/7 nadzor", "Transfer do aerodroma", "Online rezervacija"],
  en: ["24/7 CCTV", "Airport transfer", "Online booking"],
  de: ["24/7 Überwachung", "Flughafen-Transfer", "Online-Buchung"],
};

const FROM_LABEL_BY_LOCALE = {
  bs: "VEĆ OD",
  en: "FROM",
  de: "AB",
};

export default async function OgImage({ params }) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const headline = HEADLINE_BY_LOCALE[validLocale] || HEADLINE_BY_LOCALE.bs;
  const price = PRICE_BY_LOCALE[validLocale] || PRICE_BY_LOCALE.bs;
  const features = FEATURES_BY_LOCALE[validLocale] || FEATURES_BY_LOCALE.bs;
  const fromLabel = FROM_LABEL_BY_LOCALE[validLocale] || FROM_LABEL_BY_LOCALE.bs;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0B1A2E 0%, #06121F 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Subtle lime accent corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 280,
            height: 280,
            background:
              "radial-gradient(closest-side, rgba(157,239,63,0.18), transparent 70%)",
          }}
        />

        {/* Top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={LOGO_DATA_URL}
            width={240}
            height={48}
            alt=""
            style={{ height: 48, width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flex: 1,
            marginTop: 56,
            gap: 56,
          }}
        >
          {/* Left column: text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.04,
                whiteSpace: "nowrap",
              }}
            >
              <div style={{ display: "flex" }}>{headline.line1}</div>
              <div style={{ display: "flex", color: "#9DEF3F" }}>
                {headline.line2}
              </div>
            </div>

            {/* Lime accent bar */}
            <div
              style={{
                display: "flex",
                width: 120,
                height: 6,
                borderRadius: 3,
                background: "#9DEF3F",
                marginTop: 32,
              }}
            />

            {/* Feature pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 32,
              }}
            >
              {features.map((f, i) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 18px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(157,239,63,0.28)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.94)",
                    marginRight: i < features.length - 1 ? 10 : 0,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "#9DEF3F",
                      marginRight: 8,
                    }}
                  />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right column: price card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 320,
              padding: 32,
              borderRadius: 32,
              background: "#9DEF3F",
              color: "#0B1A2E",
              boxShadow: "0 30px 60px -20px rgba(157,239,63,0.45)",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              {fromLabel}
            </span>
            <span
              style={{
                fontSize: 110,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginTop: 8,
              }}
            >
              {price.value}
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginTop: 4,
                opacity: 0.85,
              }}
            >
              {price.per}
            </span>
          </div>
        </div>

        {/* Bottom row: domain + address */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            fontSize: 18,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
          }}
        >
          <span>{SITE.url.replace(/^https?:\/\//, "")}</span>
          <span>{SITE.addressShort}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
