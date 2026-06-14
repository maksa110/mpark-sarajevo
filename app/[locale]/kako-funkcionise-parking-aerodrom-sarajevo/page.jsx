import { buildSeoArticleMetadata } from "@/lib/seo-metadata";
import SeoLandingPageShell from "@/components/SeoLandingPageShell";
import { SEO_SLUGS } from "@/lib/seo-routes";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildSeoArticleMetadata({
    locale,
    namespace: "seoHowParkingWorks",
    pathnameKey: SEO_SLUGS.howParkingWorks,
  });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <SeoLandingPageShell
      locale={locale}
      namespace="seoHowParkingWorks"
      pathnameKey={SEO_SLUGS.howParkingWorks}
    />
  );
}
