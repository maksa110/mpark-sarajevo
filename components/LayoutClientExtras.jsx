"use client";

import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), {
  ssr: false,
});

const LocaleSuggestionBanner = dynamic(
  () => import("@/components/LocaleSuggestionBanner"),
  { ssr: false }
);

export default function LayoutClientExtras() {
  return (
    <>
      <GoogleAnalytics />
      <LocaleSuggestionBanner />
    </>
  );
}
