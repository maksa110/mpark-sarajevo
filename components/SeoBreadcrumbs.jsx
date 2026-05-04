import { Link } from "@/i18n/navigation";

/**
 * Vidljivi breadcrumb (uz JSON-LD BreadcrumbList na SEO stranicama).
 */
export default function SeoBreadcrumbs({ homeLabel, currentLabel }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-zinc-100 bg-gradient-to-b from-zinc-50 to-white"
    >
      <div className="mx-auto max-w-3xl px-4 py-3 text-sm sm:px-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-zinc-600">
          <li>
            <Link
              href="/"
              className="font-medium text-brand-navy underline-offset-4 hover:text-brand-lime hover:underline"
            >
              {homeLabel}
            </Link>
          </li>
          <li aria-hidden className="select-none text-zinc-400">
            /
          </li>
          <li className="max-w-[min(100%,36rem)] truncate font-semibold text-zinc-900">
            {currentLabel}
          </li>
        </ol>
      </div>
    </nav>
  );
}
