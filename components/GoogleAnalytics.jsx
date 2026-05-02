import Script from "next/script";

/** Javni ID iz GA → Admin → Data streams; env ga može overrideati (npr. drugačiji stream). */
const DEFAULT_MEASUREMENT_ID = "G-TSDCML52W1";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_MEASUREMENT_ID;

/** Google Analytics 4 (gtag.js). */
export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-gtag" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
        `.trim()}
      </Script>
    </>
  );
}
