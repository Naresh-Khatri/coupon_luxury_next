"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import OfferCardV2 from "@/components/OfferCardV2";
import { cn } from "@/lib/utils";

type Offer = {
  id: string | number;
  offerType: "coupon" | "deal";
  store?: { storeName: string };
  [key: string]: any;
};

type CategoryInfo = {
  categoryName: string;
  image: string;
  offers: Offer[];
};

type Filter = "all" | "coupons" | "deals";

export default function CategoryFilter({
  categoryInfo,
  className,
}: {
  categoryInfo: CategoryInfo;
  className?: string;
}) {
  const [filterBy, setFilterBy] = useState<Filter>("all");
  const couponCount = useMemo(
    () => categoryInfo.offers.filter((o) => o.offerType === "coupon").length,
    [categoryInfo.offers]
  );

  const filteredOffers = useMemo(() => {
    if (filterBy === "coupons")
      return categoryInfo.offers.filter((o) => o.offerType === "coupon");
    if (filterBy === "deals")
      return categoryInfo.offers.filter((o) => o.offerType === "deal");
    return categoryInfo.offers;
  }, [filterBy, categoryInfo.offers]);

  const filterOptions: { value: Filter; label: string }[] = [
    { value: "all", label: `All(${categoryInfo.offers.length})` },
    { value: "coupons", label: `Coupons(${couponCount})` },
    {
      value: "deals",
      label: `Deals(${categoryInfo.offers.length - couponCount})`,
    },
  ];

  return (
    <div className={cn(className)}>
      <div className="mb-3 rounded-xl bg-white p-4 font-semibold md:hidden">
        <h3 className="text-3xl">Filter</h3>
        <div className="mt-2 space-y-2">
          {filterOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filterBy === opt.value}
                onChange={() => setFilterBy(opt.value)}
                className="size-4 accent-teal"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
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
            <p className="text-center text-4xl font-extrabold text-brand-900">
              No Coupon or Deal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
