"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function MobileStickyCta() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const t = useTranslations("stickyCta");

  const className =
    "flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-lime text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/30 ring-1 ring-brand-lime/40 transition active:scale-[0.99]";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden"
      role="region"
      aria-label={t("regionLabel")}
    >
      {isHome ? (
        <a href="#book" className={className}>
          {t("label")}
        </a>
      ) : (
        <Link
          href={{ pathname: "/rezervacija", hash: "book" }}
          className={className}
        >
          {t("label")}
        </Link>
      )}
    </div>
  );
}
