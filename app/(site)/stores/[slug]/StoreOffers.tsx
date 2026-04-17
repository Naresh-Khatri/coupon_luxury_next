"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Filter,
  Search as SearchIcon,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StoreOfferRow, { type StoreOfferRowData } from "./StoreOfferRow";

type StoreOffer = StoreOfferRowData & { offerType: string };

type Store = { storeName: string; slug: string; image: string };

type TypeFilter = "all" | "coupons" | "deals";
type Sort = "recommended" | "newest" | "popular" | "expiring";

const FRESH_WINDOW_DAYS = 14;

function isFresh(o: StoreOffer): boolean {
  if (!o.verifiedAt) return false;
  const d = o.verifiedAt instanceof Date ? o.verifiedAt : new Date(o.verifiedAt);
  if (Number.isNaN(d.getTime())) return false;
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  return days <= FRESH_WINDOW_DAYS;
}

function endTime(d?: string | null): number {
  if (!d) return Number.POSITIVE_INFINITY;
  const t = new Date(d).getTime();
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

function verifiedTime(v?: Date | string | null): number {
  if (!v) return 0;
  const d = v instanceof Date ? v : new Date(v);
  const t = d.getTime();
  return Number.isFinite(t) ? t : 0;
}

export default function StoreOffers({
  offers,
  store,
}: {
  offers: StoreOffer[];
  store: Store;
}) {
  const [type, setType] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<Sort>("recommended");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [exclusiveOnly, setExclusiveOnly] = useState(false);
  const [freshOnly, setFreshOnly] = useState(false);
  const [railOpen, setRailOpen] = useState(false);

  const activeFilterCount =
    (type !== "all" ? 1 : 0) +
    (sort !== "recommended" ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (exclusiveOnly ? 1 : 0) +
    (freshOnly ? 1 : 0);

  const counts = useMemo(() => {
    const coupons = offers.filter((o) => o.offerType === "coupon").length;
    const deals = offers.length - coupons;
    const verified = offers.filter((o) => !!o.verifiedAt).length;
    const exclusive = offers.filter((o) => !!o.featured).length;
    const fresh = offers.filter(isFresh).length;
    return { all: offers.length, coupons, deals, verified, exclusive, fresh };
  }, [offers]);

  const filtered = useMemo(() => {
    let list = offers.slice();
    if (type === "coupons") list = list.filter((o) => o.offerType === "coupon");
    else if (type === "deals")
      list = list.filter((o) => o.offerType !== "coupon");
    if (verifiedOnly) list = list.filter((o) => !!o.verifiedAt);
    if (exclusiveOnly) list = list.filter((o) => !!o.featured);
    if (freshOnly) list = list.filter(isFresh);

    switch (sort) {
      case "newest":
        list.sort((a, b) => verifiedTime(b.verifiedAt) - verifiedTime(a.verifiedAt));
        break;
      case "popular":
        list.sort((a, b) => (b.uses ?? 0) - (a.uses ?? 0));
        break;
      case "expiring":
        list.sort((a, b) => endTime(a.endDate) - endTime(b.endDate));
        break;
      default:
        list.sort((a, b) => {
          const af = a.featured ? 1 : 0;
          const bf = b.featured ? 1 : 0;
          if (bf !== af) return bf - af;
          return verifiedTime(b.verifiedAt) - verifiedTime(a.verifiedAt);
        });
    }
    return list;
  }, [offers, type, sort, verifiedOnly, exclusiveOnly, freshOnly]);

  const typeTabs: Array<{ id: TypeFilter; label: string; count: number }> = [
    { id: "all", label: "All", count: counts.all },
    { id: "coupons", label: "Coupons", count: counts.coupons },
    { id: "deals", label: "Deals", count: counts.deals },
  ];

  const sortOptions: Array<{ id: Sort; label: string }> = [
    { id: "recommended", label: "Recommended" },
    { id: "newest", label: "Newly added" },
    { id: "popular", label: "Most used" },
    { id: "expiring", label: "Expiring soon" },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Filter rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setRailOpen((v) => !v)}
            aria-expanded={railOpen}
            aria-controls="store-filter-body"
            className="flex w-full items-center justify-between gap-2 border-b border-border px-4 py-3 text-left lg:pointer-events-none lg:cursor-default"
          >
            <span className="inline-flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Filters
              </span>
              {activeFilterCount > 0 && (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-gold/20 text-[10.5px] font-bold text-gold lg:hidden">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform lg:hidden",
                railOpen && "rotate-180"
              )}
            />
          </button>

          <div
            id="store-filter-body"
            className={cn(
              "lg:block",
              railOpen ? "block" : "hidden"
            )}
          >
            <div className="px-4 py-4">
            <h3 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Categories
            </h3>
            <div className="mt-2 flex flex-col">
              {typeTabs.map((t) => {
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                      active
                        ? "bg-gold/15 font-semibold text-gold"
                        : "text-foreground/80 hover:bg-white/5"
                    )}
                  >
                    <span>{t.label}</span>
                    <span className="text-[11px] text-muted-foreground">{t.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border px-4 py-4">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
              <h3 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Sort by
              </h3>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {sortOptions.map((s) => (
                <label
                  key={s.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
                    sort === s.id
                      ? "bg-gold/10 font-semibold text-gold"
                      : "text-foreground/80 hover:bg-white/5"
                  )}
                >
                  <input
                    type="radio"
                    name="sort"
                    className="accent-gold"
                    checked={sort === s.id}
                    onChange={() => setSort(s.id)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-border px-4 py-4">
            <h3 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Coupons info
            </h3>
            <div className="mt-2 flex flex-col gap-1">
              <CheckRow
                label="Verified"
                count={counts.verified}
                checked={verifiedOnly}
                onChange={setVerifiedOnly}
              />
              <CheckRow
                label="Exclusive"
                count={counts.exclusive}
                checked={exclusiveOnly}
                onChange={setExclusiveOnly}
              />
              <CheckRow
                label={`Fresh (${FRESH_WINDOW_DAYS}d)`}
                count={counts.fresh}
                checked={freshOnly}
                onChange={setFreshOnly}
              />
            </div>
          </div>
          </div>
        </div>
      </aside>

      {/* Offers list */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {typeTabs.map((t) => {
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[12.5px] font-medium transition-colors",
                    active
                      ? "border-gold bg-gold text-navy"
                      : "border-border bg-muted text-foreground/80 hover:border-gold/60 hover:text-gold"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "text-[11px]",
                      active ? "text-navy/70" : "text-muted-foreground"
                    )}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[12px] text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            {type === "all" ? "offers" : type}
            {store.storeName ? ` from ${store.storeName}` : ""}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gold/10">
              <SearchIcon className="size-5 text-gold" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No matching offers
            </h3>
            <p className="mt-1 max-w-[320px] text-sm text-muted-foreground">
              Try clearing a filter or switching to another category.
            </p>
          </div>
        ) : (
          <motion.div layout className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {filtered.map((offer) => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <StoreOfferRow offer={offer} storeSlug={store.slug} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
        checked ? "bg-gold/10 font-semibold text-gold" : "text-foreground/80 hover:bg-white/5"
      )}
    >
      <span className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-gold"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </span>
      <span className="text-[11px] text-muted-foreground">{count}</span>
    </label>
  );
}
