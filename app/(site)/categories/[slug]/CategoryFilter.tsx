"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Search as SearchIcon,
  SlidersHorizontal,
  Ticket,
  X,
} from "lucide-react";
import OfferCardV2 from "@/components/OfferCardV2";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import transformPath from "@/utils/transformImagePath";

type SubCategory = {
  id: number;
  subCategoryName: string;
  slug: string;
};

type StoreLite = {
  id: number;
  storeName: string;
  slug: string;
  image: string;
  subCategoryId: number;
};

type Offer = {
  id: string | number;
  offerType: string;
  store?: { id: number; storeName: string; slug: string; image: string } | null;
  [key: string]: any;
};

type CategoryInfo = {
  categoryName: string;
  offers: Offer[];
  stores?: StoreLite[];
  subCategories?: SubCategory[];
  [key: string]: any;
};

type FeaturedStore = {
  id: number;
  storeName: string;
  slug: string;
  image: string;
};

type Filter = "all" | "coupons" | "deals";

export default function CategoryFilter({
  categoryInfo,
  featuredStores,
  className,
}: {
  categoryInfo: CategoryInfo;
  featuredStores: FeaturedStore[];
  className?: string;
}) {
  const { offers, stores = [], subCategories = [] } = categoryInfo;
  const [filterBy, setFilterBy] = useState<Filter>("all");
  const [subCatIds, setSubCatIds] = useState<Set<number>>(new Set());
  const [storeIds, setStoreIds] = useState<Set<number>>(new Set());
  const [storeSearch, setStoreSearch] = useState("");

  const storeById = useMemo(() => {
    const map = new Map<number, StoreLite>();
    for (const s of stores) map.set(s.id, s);
    return map;
  }, [stores]);

  const offerSubCatId = (o: Offer): number | null => {
    const sid = o.store?.id;
    if (!sid) return null;
    return storeById.get(sid)?.subCategoryId ?? null;
  };

  const subCatCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const o of offers) {
      const sc = offerSubCatId(o);
      if (sc != null) counts.set(sc, (counts.get(sc) ?? 0) + 1);
    }
    return counts;
  }, [offers, storeById]);

  const storeCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const o of offers) {
      const sid = o.store?.id;
      if (sid) counts.set(sid, (counts.get(sid) ?? 0) + 1);
    }
    return counts;
  }, [offers]);

  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      if (filterBy === "coupons" && o.offerType !== "coupon") return false;
      if (filterBy === "deals" && o.offerType === "coupon") return false;
      if (subCatIds.size > 0) {
        const sc = offerSubCatId(o);
        if (sc == null || !subCatIds.has(sc)) return false;
      }
      if (storeIds.size > 0) {
        const sid = o.store?.id;
        if (!sid || !storeIds.has(sid)) return false;
      }
      return true;
    });
  }, [offers, filterBy, subCatIds, storeIds, storeById]);

  const couponCount = useMemo(
    () => offers.filter((o) => o.offerType === "coupon").length,
    [offers]
  );

  const filterOptions: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: offers.length },
    { value: "coupons", label: "Coupons", count: couponCount },
    { value: "deals", label: "Deals", count: offers.length - couponCount },
  ];

  const toggle = (set: Set<number>, id: number, next: (s: Set<number>) => void) => {
    const copy = new Set(set);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    next(copy);
  };

  const clearAll = () => {
    setSubCatIds(new Set());
    setStoreIds(new Set());
    setFilterBy("all");
    setStoreSearch("");
  };

  const activeSubCats = subCategories.filter((sc) => subCatCounts.has(sc.id));
  const activeStores = stores
    .filter((s) => storeCounts.has(s.id))
    .sort(
      (a, b) => (storeCounts.get(b.id) ?? 0) - (storeCounts.get(a.id) ?? 0)
    );
  const visibleStores = storeSearch
    ? activeStores.filter((s) =>
        s.storeName.toLowerCase().includes(storeSearch.toLowerCase())
      )
    : activeStores;

  const recommended = featuredStores.slice(0, 6);
  const hasActiveFilters =
    subCatIds.size > 0 || storeIds.size > 0 || filterBy !== "all";

  const filtersPanel = (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold/80">
            Type
          </h3>
        </div>
        <div className="space-y-1">
          {filterOptions.map((opt) => {
            const active = filterBy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilterBy(opt.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-foreground/80 hover:bg-white/5"
                )}
              >
                <span>{opt.label}</span>
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    active ? "text-gold/80" : "text-muted-foreground"
                  )}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeStores.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold/80">
              Stores
            </h3>
            {storeIds.size > 0 && (
              <button
                type="button"
                onClick={() => setStoreIds(new Set())}
                className="text-[11px] text-muted-foreground hover:text-gold"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative mb-2">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              placeholder="Search stores"
              className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
          </div>
          <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {visibleStores.map((store) => {
              const checked = storeIds.has(store.id);
              return (
                <label
                  key={store.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] hover:bg-white/5"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      toggle(storeIds, store.id, setStoreIds)
                    }
                    className="size-3.5"
                  />
                  <span
                    className={cn(
                      "flex-1 truncate",
                      checked ? "text-foreground" : "text-foreground/75"
                    )}
                  >
                    {store.storeName}
                  </span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {storeCounts.get(store.id)}
                  </span>
                </label>
              );
            })}
            {visibleStores.length === 0 && (
              <p className="px-2 py-2 text-[12px] text-muted-foreground">
                No stores match &ldquo;{storeSearch}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      {activeSubCats.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold/80">
              Categories
            </h3>
            {subCatIds.size > 0 && (
              <button
                type="button"
                onClick={() => setSubCatIds(new Set())}
                className="text-[11px] text-muted-foreground hover:text-gold"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {activeSubCats.map((sc) => {
              const checked = subCatIds.has(sc.id);
              const count = subCatCounts.get(sc.id) ?? 0;
              return (
                <label
                  key={sc.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] hover:bg-white/5"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      toggle(subCatIds, sc.id, setSubCatIds)
                    }
                    className="size-3.5"
                  />
                  <span
                    className={cn(
                      "flex-1 truncate",
                      checked ? "text-foreground" : "text-foreground/75"
                    )}
                  >
                    {sc.subCategoryName}
                  </span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background py-2 text-[12px] font-medium text-muted-foreground hover:border-gold/40 hover:text-gold"
        >
          <X className="size-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className={cn("grid gap-6 md:grid-cols-[260px_1fr]", className)}>
      <aside className="hidden md:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-gold" />
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
          </div>
          {filtersPanel}
        </div>
      </aside>

      <div className="min-w-0">
        {recommended.length > 0 && (
          <div className="mb-5 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="shrink-0 text-[10.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Recommended
              </span>
              <div className="flex items-center gap-2">
                {recommended.map((store) => (
                  <Link
                    key={store.id}
                    href={`/stores/${store.slug}`}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 transition-colors hover:border-gold/50"
                  >
                    <span className="flex size-5 items-center justify-center overflow-hidden rounded-sm bg-white">
                      <Image
                        src={transformPath(store.image, 80)}
                        alt={store.storeName}
                        width={20}
                        height={20}
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    </span>
                    <span className="text-[12px] font-medium text-foreground/80 group-hover:text-gold">
                      {store.storeName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-[12.5px] text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredOffers.length}
            </span>{" "}
            of {offers.length} offers
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 md:hidden"
              >
                <SlidersHorizontal className="size-3.5" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
                    {subCatIds.size + storeIds.size + (filterBy !== "all" ? 1 : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{filtersPanel}</div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="space-y-3">
          {filteredOffers.map((offer) => (
            <OfferCardV2
              key={offer.id}
              offerDetails={{
                ...(offer as any),
                categoryName: categoryInfo.categoryName,
                storeName: offer.store?.storeName || "",
                image: (offer as any).coverImg || offer.store?.image || "",
                coverImg: (offer as any).coverImg ?? null,
                fromPage: "categories",
              }}
            />
          ))}

          {filteredOffers.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <Ticket className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  No offers match your filters
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Try adjusting or clearing your filters to see more results.
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gold/40 bg-gold/10 px-4 py-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold hover:bg-gold/15"
                >
                  <X className="size-3.5" /> Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {activeSubCats.length > 1 && filterBy !== "all" && (
          <div className="mt-8 flex items-center gap-2 text-[11px] text-muted-foreground">
            <ChevronDown className="size-3" />
            Scroll for more offers
          </div>
        )}
      </div>
    </div>
  );
}
