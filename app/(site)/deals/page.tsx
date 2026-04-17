import type { Metadata } from "next";
import OffersListPage from "@/components/offers/OffersListPage";

export const metadata: Metadata = {
  title: "Deals - CouponLuxury",
  description:
    "Grab the greatest deals on all exclusive stores using luxury coupons, promo & discount codes. Shop the biggest brands like Nike, amazon, domino's using our offers",
  alternates: { canonical: "https://www.couponluxury.com/deals" },
};

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <OffersListPage
      config={{
        title: "All Deals",
        subtitle:
          "Hand-picked savings from the world's best brands. Filter by category, sort by what's expiring soon, or hunt for the biggest discounts.",
        offerType: "deal",
        itemLabel: "deal",
        breadcrumb: "Deals",
        showHasCode: false,
      }}
      searchParams={searchParams}
    />
  );
}
