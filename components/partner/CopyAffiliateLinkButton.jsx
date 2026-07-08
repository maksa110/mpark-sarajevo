"use client";

import { useState } from "react";

export default function CopyAffiliateLinkButton({ link }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy-950"
    >
      {copied ? "Copied" : "Copy Affiliate Link"}
    </button>
  );
}
