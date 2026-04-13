"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import OfferCardV2 from "@/components/OfferCardV2";
import { cn } from "@/lib/utils";

type Offer = {
  id: string | number;
  offerType: string;
  [key: string]: any;
};

type StoreInfo = {
  storeName: string;
  image: string;
  slug: string;
  offers: Offer[];
  [key: string]: any;
};

type Filter = "all" | "coupons" | "deals";

export default function StoreFilter({
  storeInfo,
  className,
}: {
  storeInfo: StoreInfo;
  className?: string;
}) {
  const [filterBy, setFilterBy] = useState<Filter>("all");
  const couponCount = useMemo(
    () => storeInfo.offers.filter((o) => o.offerType === "coupon").length,
    [storeInfo.offers]
  );

  const filteredOffers = useMemo(() => {
    if (filterBy === "coupons")
      return storeInfo.offers.filter((o) => o.offerType === "coupon");
    if (filterBy === "deals")
      return storeInfo.offers.filter((o) => o.offerType === "deal");
    return storeInfo.offers;
  }, [filterBy, storeInfo.offers]);

  const filterOptions: { value: Filter; label: string }[] = [
    { value: "all", label: `All(${storeInfo.offers.length})` },
    { value: "coupons", label: `Coupons(${couponCount})` },
    { value: "deals", label: `Deals(${storeInfo.offers.length - couponCount})` },
  ];

  return (
    <>
      <div className={cn(className)}>
        <div className="my-3 hidden rounded-xl bg-white p-4 font-semibold md:block">
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
                storeName: storeInfo.storeName,
                image: storeInfo.image,
                fromPage: "stores",
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
      {/* Mobile filter */}
      <div className="mx-4 my-3 block rounded-xl bg-white p-4 font-semibold md:hidden">
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
    </>
  );
}
