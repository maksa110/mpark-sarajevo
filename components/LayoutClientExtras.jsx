"use client";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import LocaleSuggestionBanner from "@/components/LocaleSuggestionBanner";

export default function LayoutClientExtras() {
  return (
    <>
      <GoogleAnalytics />
      <LocaleSuggestionBanner />
    </>
  );
}
