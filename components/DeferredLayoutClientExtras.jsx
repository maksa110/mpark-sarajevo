"use client";

import dynamic from "next/dynamic";

const LayoutClientExtras = dynamic(
  () => import("@/components/LayoutClientExtras"),
  { ssr: false }
);

export default function DeferredLayoutClientExtras() {
  return <LayoutClientExtras />;
}
