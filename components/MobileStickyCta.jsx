import { useTranslations } from "next-intl";

export default function MobileStickyCta() {
  const t = useTranslations("stickyCta");

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden"
      role="region"
      aria-label={t("regionLabel")}
    >
      <a
        href="#book"
        className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-lime text-base font-extrabold uppercase tracking-wide text-brand-navy shadow-lg shadow-brand-lime/30 ring-1 ring-brand-lime/40 transition active:scale-[0.99]"
      >
        {t("label")}
      </a>
    </div>
  );
}
