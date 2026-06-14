import { buildSeoArticleMetadata } from "@/lib/seo-metadata";
import SeoLandingPageShell from "@/components/SeoLandingPageShell";
import { SEO_SLUGS } from "@/lib/seo-routes";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildSeoArticleMetadata({
    locale,
    namespace: "seoSecureParking",
    pathnameKey: SEO_SLUGS.secureParking,
  });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <SeoLandingPageShell
      locale={locale}
      namespace="seoSecureParking"
      pathnameKey={SEO_SLUGS.secureParking}
    />
  );
}
