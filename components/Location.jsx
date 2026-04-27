import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function Location() {
  const t = useTranslations("location");
  const tSite = useTranslations("site");

  return (
    <section
      id="location"
      className="scroll-mt-20 border-b border-zinc-200/80 bg-white py-16 sm:py-20"
      aria-labelledby="loc-h2"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal
          as="h2"
          id="loc-h2"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          {t("h2")}
        </Reveal>
        <Reveal as="p" delay={100} className="mt-3 max-w-2xl text-zinc-600">
          <strong className="font-medium text-zinc-800">
            {t("leadStrong")}
          </strong>
          {t("leadRest")}
        </Reveal>
        <Reveal as="p" delay={170} className="mt-3 max-w-2xl text-sm text-zinc-600">
          {t.rich("secondary", {
            strong: (chunks) => (
              <span className="font-medium text-zinc-800">{chunks}</span>
            ),
          })}
        </Reveal>
        <Reveal as="p" delay={230} className="mt-3 max-w-2xl text-sm text-zinc-600">
          {t("extra")}
        </Reveal>
        <Reveal delay={280} className="mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-lime-600" aria-hidden />
            <address className="not-italic font-medium text-zinc-900">
              {SITE.addressShort}
              <span className="ml-2 text-xs text-zinc-500">
                {tSite("addressNote")}
              </span>
            </address>
          </div>
          <div className="text-xs text-zinc-500">{tSite("locationLine")}</div>
        </Reveal>
        <Reveal
          delay={340}
          className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm transition duration-300 hover:shadow-md"
        >
          <iframe
            title={t("mapTitle")}
            src="https://www.google.com/maps?ll=43.83199,18.32795&z=18&q=mPark%20%7C%20Privatni%20Parking%20Aerodrom%20Sarajevo&output=embed"
            className="h-64 w-full border-0 sm:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Reveal>
      </div>
    </section>
  );
}
