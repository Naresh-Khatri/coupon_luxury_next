import type { Metadata } from "next";
import Banner from "@/components/Banner";
import DealCard from "@/components/DealCard";
import { getPublicOffers } from "@/server/db/queries/offers";

export const metadata: Metadata = {
  title: "Deals - CouponLuxury",
  description:
    "Grab the greatest deals on all exclusive stores using luxury coupons, promo & discount codes. Shop the biggest brands like Nike, amazon, domino's using our offers",
  alternates: { canonical: "https://www.couponluxury.com/deals" },
};

export default async function DealsPage() {
  const dealsList = await getPublicOffers({ offerType: "deal", limit: 50 });

  return (
    <div className="bg-[#e0e0e0]">
      <Banner
        title="All Deals"
        subTitle={`${dealsList.length} deals available!`}
      />
      <div className="flex justify-center py-10 px-2">
        <div className="grid grid-cols-2 justify-center gap-2 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {dealsList.map((deal) => (
            <DealCard
              key={deal.id}
              affURL={deal.affURL}
              storeName={deal.store.storeName}
              storeSlug={deal.store.slug}
              dealSlug={deal.slug}
              title={deal.title}
              code={deal.couponCode || ""}
              type={deal.offerType}
              endDate={deal.endDate}
              showValidTill={false}
              storeImg={deal.store.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
