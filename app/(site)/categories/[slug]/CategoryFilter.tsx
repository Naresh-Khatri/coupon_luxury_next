"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Filter as FilterIcon, Store as StoreIcon, X } from "lucide-react";
import OfferCardV2 from "@/components/OfferCardV2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  image: string;
  offers: Offer[];
  stores?: StoreLite[];
  subCategories?: SubCategory[];
  [key: string]: any;
};

type Filter = "all" | "coupons" | "deals";

export default function CategoryFilter({
  categoryInfo,
  className,
}: {
  categoryInfo: CategoryInfo;
  className?: string;
}) {
  const { offers, stores = [], subCategories = [] } = categoryInfo;
  const [filterBy, setFilterBy] = useState<Filter>("all");
  const [subCatIds, setSubCatIds] = useState<Set<number>>(new Set());
  const [storeIds, setStoreIds] = useState<Set<number>>(new Set());

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

  const filterOptions: { value: Filter; label: string }[] = [
    { value: "all", label: `All (${offers.length})` },
    { value: "coupons", label: `Coupons (${couponCount})` },
    { value: "deals", label: `Deals (${offers.length - couponCount})` },
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
  };

  const activeSubCats = subCategories.filter((sc) =>
    subCatCounts.has(sc.id)
  );
  const activeStores = stores
    .filter((s) => storeCounts.has(s.id))
    .sort(
      (a, b) => (storeCounts.get(b.id) ?? 0) - (storeCounts.get(a.id) ?? 0)
    );

  const topStores = activeStores.slice(0, 8);
  const hasActiveFilters = subCatIds.size > 0 || storeIds.size > 0 || filterBy !== "all";

  return (
    <div className={cn(className)}>
      {topStores.length > 0 && (
        <div className="mb-4 rounded-xl bg-card border border-border p-4">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Top stores in {categoryInfo.categoryName}
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {topStores.map((store) => {
              const active = storeIds.has(store.id);
              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => toggle(storeIds, store.id, setStoreIds)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-2 transition-all",
                    active
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/60 hover:bg-gold/5"
                  )}
                  title={store.storeName}
                >
                  <div className="flex h-10 w-full items-center justify-center">
                    <Image
                      src={transformPath(store.image, 160)}
                      alt={store.storeName}
                      width={80}
                      height={40}
                      className="max-h-[32px] w-auto max-w-[80%] object-contain"
                    />
                  </div>
                  <span className="line-clamp-1 text-center text-[10.5px] font-medium text-foreground/80">
                    {store.storeName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-4 rounded-xl bg-card border border-border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterIcon className="size-4 text-muted-foreground" />
          <div className="inline-flex rounded-full border border-border p-1">
            {filterOptions.map((opt) => {
              const active = filterBy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilterBy(opt.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors",
                    active ? "bg-gold text-navy" : "text-foreground/80 hover:text-gold"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {activeStores.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <StoreIcon className="size-3.5" />
                  Stores
                  {storeIds.size > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {storeIds.size}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-80 w-64 overflow-y-auto p-2">
                <div className="space-y-1">
                  {activeStores.map((store) => {
                    const checked = storeIds.has(store.id);
                    return (
                      <label
                        key={store.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-white/5 text-foreground/80"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            toggle(storeIds, store.id, setStoreIds)
                          }
                        />
                        <span className="flex-1 truncate">{store.storeName}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {storeCounts.get(store.id)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="ml-auto gap-1 text-gray-500"
            >
              <X className="size-3.5" /> Clear
            </Button>
          )}
        </div>

        {activeSubCats.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeSubCats.map((sc) => {
              const active = subCatIds.has(sc.id);
              const count = subCatCounts.get(sc.id) ?? 0;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => toggle(subCatIds, sc.id, setSubCatIds)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                    active
                      ? "border-gold bg-gold text-navy"
                      : "border-border text-foreground/80 hover:border-gold/50 hover:bg-gold/5"
                  )}
                >
                  {sc.subCategoryName}
                  <span
                    className={cn(
                      "text-[10.5px]",
                      active ? "text-navy/70" : "text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="mb-3 text-[12.5px] text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{filteredOffers.length}</span>{" "}
        of {offers.length} offers
      </p>

      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <OfferCardV2
            key={offer.id}
            offerDetails={{
              ...(offer as any),
              categoryName: categoryInfo.categoryName,
              storeName: offer.store?.storeName || "",
              image: categoryInfo.image,
              fromPage: "categories",
            }}
          />
        ))}
        {filteredOffers.length === 0 && (
          <div className="flex flex-col items-center opacity-60">
            <Image
              src="/assets/not_found.svg"
              alt="No coupons/deals found!"
              width={400}
              height={400}
            />
            <p className="text-center text-4xl font-extrabold text-foreground">
              No offers match your filters
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearAll}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
