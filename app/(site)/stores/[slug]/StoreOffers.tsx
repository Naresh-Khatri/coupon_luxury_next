"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import OfferCard, { type OfferCardData } from "@/components/offers/OfferCard";
import { cn } from "@/lib/utils";

type StoreOffer = OfferCardData & { offerType: string };

type Store = { storeName: string; slug: string; image: string };

type Tab = "all" | "fresh" | "coupons" | "deals";

const FRESH_WINDOW_DAYS = 14;

function isFresh(o: StoreOffer): boolean {
  if (!o.verifiedAt) return false;
  const d = o.verifiedAt instanceof Date ? o.verifiedAt : new Date(o.verifiedAt);
  if (Number.isNaN(d.getTime())) return false;
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  return days <= FRESH_WINDOW_DAYS;
}

export default function StoreOffers({
  offers,
  store,
}: {
  offers: StoreOffer[];
  store: Store;
}) {
  const [tab, setTab] = useState<Tab>("all");

  const { coupons, deals, fresh } = useMemo(() => {
    const coupons = offers.filter((o) => o.offerType === "coupon");
    const deals = offers.filter((o) => o.offerType !== "coupon");
    const fresh = offers.filter(isFresh);
    return { coupons, deals, fresh };
  }, [offers]);

  const filtered =
    tab === "coupons"
      ? coupons
      : tab === "deals"
        ? deals
        : tab === "fresh"
          ? fresh
          : offers;

  const tabs: Array<{ id: Tab; label: string; count: number }> = [
    { id: "all", label: "All", count: offers.length },
    { id: "fresh", label: "Fresh", count: fresh.length },
    { id: "coupons", label: "Coupons", count: coupons.length },
    { id: "deals", label: "Deals", count: deals.length },
  ];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter offers"
          className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm"
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:text-navy"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "text-[11px]",
                    active ? "text-white/70" : "text-gray-400"
                  )}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[12.5px] text-gray-500">
          Showing{" "}
          <span className="font-semibold text-navy">{filtered.length}</span>{" "}
          {tab === "all" ? "offers" : tab}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gold/10">
            <SearchIcon className="size-5 text-gold" />
          </div>
          <h3 className="text-base font-bold text-navy">
            No {tab === "all" ? "offers" : tab} right now
          </h3>
          <p className="mt-1 max-w-[320px] text-sm text-gray-500">
            Check back soon — fresh savings drop often.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {filtered.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={{ ...offer, store }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
