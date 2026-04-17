import Link from "next/link";
import { ChevronRight, Home as HomeIcon, Search as SearchIcon } from "lucide-react";
import { getOffersList } from "@/server/db/queries/offers";
import { getPublicCategories } from "@/server/db/queries/categories";
import { getTopStoresForOffers } from "@/server/db/queries/stores";
import { getSelectedCountry } from "@/lib/country";
import OfferCard from "./OfferCard";
import OffersFilters from "./OffersFilters";
import OffersToolbar from "./OffersToolbar";
import ActiveFilterChips from "./ActiveFilterChips";
import OffersPagination from "./OffersPagination";
import TopStoresStrip from "./TopStoresStrip";
import { parseOffersParams } from "./search-params";

export type OffersListPageConfig = {
  title: string;
  subtitle?: string;
  offerType?: "deal" | "coupon";
  itemLabel?: string;
  showHasCode?: boolean;
  breadcrumb: string;
  perPage?: number;
};

export default async function OffersListPage({
  config,
  searchParams,
}: {
  config: OffersListPageConfig;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = parseOffersParams(sp);
  const country = await getSelectedCountry();
  const perPage = config.perPage ?? 24;
  const itemLabel = config.itemLabel ?? config.offerType ?? "offer";

  const [categoriesRaw, topStores] = await Promise.all([
    getPublicCategories(),
    getTopStoresForOffers({
      offerType: config.offerType,
      country,
      limit: 10,
    }),
  ]);
  const slugToId = new Map(categoriesRaw.map((c) => [c.slug, c.id]));
  const selectedCatIds = params.categories
    .map((slug) => slugToId.get(slug))
    .filter((id): id is number => typeof id === "number");

  const final = await getOffersList({
    offerType: config.offerType,
    country,
    categoryIds: selectedCatIds.length > 0 ? selectedCatIds : undefined,
    q: params.q || undefined,
    hasCode: params.code || undefined,
    discountType: params.type ?? undefined,
    sort: params.sort,
    page: params.page,
    perPage,
  });

  const categoryOptions = categoriesRaw.map((c) => ({
    slug: c.slug,
    categoryName: c.categoryName,
  }));

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="banner-bg relative overflow-hidden">
        <div className="relative mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-gold"
            >
              <HomeIcon className="size-3" />
              Home
            </Link>
            <ChevronRight className="size-3 text-white/40" />
            <span className="text-gold">{config.breadcrumb}</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {config.title}
          </h1>
          {config.subtitle && (
            <p className="mt-2 max-w-[540px] text-[14px] leading-relaxed text-white/70">
              {config.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[84px] rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <OffersFilters
                categories={categoryOptions}
                showHasCode={config.showHasCode}
              />
            </div>
          </div>

          {/* Main */}
          <div className="min-w-0">
            <OffersToolbar
              total={final.total}
              itemLabel={itemLabel}
              categories={categoryOptions}
              showHasCode={config.showHasCode}
            />

            <ActiveFilterChips categories={categoryOptions} />

            <TopStoresStrip stores={topStores} itemLabel={itemLabel} />

            {final.items.length === 0 ? (
              <EmptyState itemLabel={itemLabel} />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {final.items.map((item) => (
                  <OfferCard key={item.id} offer={item} />
                ))}
              </div>
            )}

            <OffersPagination pageCount={final.pageCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ itemLabel }: { itemLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-gold/10">
        <SearchIcon className="size-6 text-gold" />
      </div>
      <h3 className="text-lg font-bold text-navy">No {itemLabel}s match</h3>
      <p className="mt-1 max-w-[320px] text-sm text-gray-500">
        Try removing a filter or broadening your search to see more results.
      </p>
    </div>
  );
}
