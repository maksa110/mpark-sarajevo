import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

const IMAGES = [
  {
    key: "zone",
    src: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&q=80&auto=format&fit=crop",
  },
  {
    key: "fenced",
    src: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200&q=80&auto=format&fit=crop",
  },
  {
    key: "transfer",
    src: "/gallery-transfer-vehicle.png",
    objectFit: "contain",
  },
];

export default function Gallery() {
  const t = useTranslations("gallery");

  return (
    <section
      id="gallery"
      className="scroll-mt-20 border-b border-zinc-200/80 bg-white py-16 sm:py-20"
      aria-labelledby="gal-h2"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal
          as="h2"
          id="gal-h2"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          {t("h2")}
        </Reveal>
        <Reveal as="p" delay={100} className="mt-3 max-w-2xl text-zinc-600">
          {t("lead")}
        </Reveal>

        <ul
          role="list"
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {IMAGES.map((img, i) => (
            <Reveal as="li" key={img.key} delay={120 + i * 130} className="h-full">
              <figure className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={t(`items.${img.key}.alt`)}
                    fill
                    loading={i === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={
                      img.objectFit === "contain"
                        ? "object-contain bg-white p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        : "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    }
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                    aria-hidden
                  />
                </div>
                <figcaption className="flex flex-col gap-0.5 border-t border-zinc-100 bg-white px-4 py-3 sm:px-5">
                  <span className="text-sm font-semibold text-zinc-900">
                    {t(`items.${img.key}.caption`)}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {t(`items.${img.key}.sub`)}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
