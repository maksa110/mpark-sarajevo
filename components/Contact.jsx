import { MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function Contact() {
  const t = useTranslations("contact");
  const tSite = useTranslations("site");
  const waUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    t("whatsappText")
  )}`;

  return (
    <section
      id="contact"
      className="scroll-mt-20 py-16 sm:py-20"
      aria-labelledby="con-h2"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal
          as="h2"
          id="con-h2"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          {t("h2")}
        </Reveal>
        <Reveal as="p" delay={100} className="mt-3 text-zinc-600">
          {t("lead")}
        </Reveal>
        <Reveal
          delay={180}
          className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg sm:p-8"
        >
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone
                className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                aria-hidden
              />
              <a
                href={`tel:${SITE.phoneTel}`}
                className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-zinc-500" aria-hidden>
                @
              </span>
              <a
                href={`mailto:${SITE.email}`}
                className="break-all font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-lime-600"
                aria-hidden
              />
              <address className="not-italic font-medium text-zinc-900">
                {SITE.addressShort}
                <span className="mt-1 block text-xs text-zinc-500">
                  {tSite("addressNote")}
                </span>
              </address>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-lime-600"
                aria-hidden
              />
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-lime-700 underline-offset-4 hover:underline"
              >
                {t("whatsappLabel")}
              </a>
            </li>
          </ul>
          <div className="mt-6 text-xs text-zinc-500">
            <span>{tSite("seoLine")}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
