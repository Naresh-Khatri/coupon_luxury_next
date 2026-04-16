import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon, Store as StoreIcon } from "lucide-react";
import Banner from "@/components/Banner";
import StoreCard from "@/components/StoreCard";
import Header from "@/components/Header";
import { getPublicStores } from "@/server/db/queries/stores";
import { getSelectedCountry } from "@/lib/country";

export const metadata: Metadata = {
  title: "CouponLuxury - Deals, Promo codes & exclusive coupons",
  description:
    "Grab the greatest deals on all exclusive stores using luxury coupons, promo & discount codes. Shop the biggest brands like Nike, amazon, domino's using our offers",
  alternates: { canonical: "https://www.couponluxury.com/stores" },
};

export default async function StoresPage() {
  const country = await getSelectedCountry();
  const stores = await getPublicStores({ limit: 20, country });

  return (
    <div className="bg-[#eeeeee] pb-10 font-semibold">
      <h1 hidden>
        Shop in Style: Discover the Best Deals and Discounts for All Top big
        Brands
      </h1>
      <h2 hidden>
        Experience the Finest Shopping: Exclusive Coupons and Discounts for any
        Brand
      </h2>
      <Banner title="All Stores" subTitle={`${stores.length} stores available!`} />

      <div className="mx-auto mt-10 min-h-screen w-[90vw] max-w-6xl pb-10">
        <div className="w-full max-w-[1200px]">
          <nav
            aria-label="Breadcrumb"
            className="my-4 flex items-center gap-2 text-sm text-brand-900"
          >
            <Link href="/" className="flex items-center gap-2 hover:text-teal">
              <HomeIcon className="size-4" /> Home
            </Link>
            <ChevronRight className="size-4 text-gray-500" />
            <span className="flex items-center gap-2">
              <StoreIcon className="size-4" /> Stores
            </span>
          </nav>

          <Header
            leftText="Stores"
            rightText={`${stores.length} Stores available!`}
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                slug={store.slug}
                title={store.storeName}
                img={store.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
