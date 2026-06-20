"use client";

import dynamic from "next/dynamic";

const TrustindexCertificate = dynamic(
  () => import("@/components/TrustindexCertificate"),
  { ssr: false }
);

export default function DeferredTrustindexCertificate() {
  return <TrustindexCertificate />;
}
