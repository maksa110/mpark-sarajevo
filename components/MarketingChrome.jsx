import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import MobileStickyCta from "@/components/MobileStickyCta";
import SeoTopicNav from "@/components/SeoTopicNav";

/**
 * Zajednički omotač za javne marketing stranice (header/footer/sticky CTA).
 * @param {{ children: import("react").ReactNode, skipBookingHref: string, skipLabel: string }} props
 */
export default function MarketingChrome({
  children,
  skipBookingHref,
  skipLabel,
  currentPathnameKey,
}) {
  return (
    <div className="pb-[calc(4.25rem+env(safe-area-inset-bottom))] sm:pb-0">
      <a
        href={skipBookingHref}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-2xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        {skipLabel}
      </a>
      <Header />
      {/* 
        Header je position:fixed — bez ovog offseta SeoTopicNav i vrh breadcrumb-a
        ostaju ispod trake (izgleda kao “nešto se ne vidi” / odrezano).
        Ista logika kao pt-20/pt-24 na Hero sekciji početnice.
      */}
      <div className="pt-20 sm:pt-24">
        <SeoTopicNav currentPathnameKey={currentPathnameKey} />
        <main className="min-h-[40vh]">{children}</main>
      </div>
      <SiteFooter />
      <MobileStickyCta />
    </div>
  );
}
