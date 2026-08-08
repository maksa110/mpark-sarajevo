"use client";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import LocaleSuggestionBanner from "@/components/LocaleSuggestionBanner";
import ContactWidget from "@/components/ContactWidget";

export default function LayoutClientExtras() {
  return (
    <>
      <GoogleAnalytics />
      <LocaleSuggestionBanner />
      <ContactWidget />
    </>
  );
}
