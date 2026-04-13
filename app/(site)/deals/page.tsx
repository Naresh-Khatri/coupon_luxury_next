import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import DealCard from "@/components/DealCard";
import { domain } from "@/lib/lib";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Deals - CouponLuxury",
  description:
    "Grab the greatest deals on all exclusive stores using luxury coupons, promo & discount codes. Shop the biggest brands like Nike, amazon, domino's using our offers",
  alternates: { canonical: "https://www.couponluxury.com/deals" },
};

type Deal = {
  id: string | number;
  affURL: string;
  slug: string;
  title: string;
  couponCode?: string;
  offerType: "coupon" | "deal";
  endDate: string;
  store: { storeName: string; slug: string; image: string };
};

async function getDeals(): Promise<Deal[]> {
  const res = await fetch(`${domain}/offers?offerType=deal&limit=50`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function DealsPage() {
  const dealsList = await getDeals();
  if (!dealsList) notFound();

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
