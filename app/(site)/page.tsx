import MainCarousel from "@/components/home/MainCarousel";
import PopularStores from "@/components/home/PopularStores";
import TopCoupons from "@/components/home/TopCoupons";
import DealsOfTheDay from "@/components/home/DealsOfTheDay";
import PopularCategoriesList from "@/components/home/PopularCategoriesList";
import SubscribeBanner from "@/components/home/SubscribeBanner";
import { getMainFeed } from "@/server/db/queries/main";
import { getSelectedCountry } from "@/lib/country";

export default async function Home() {
  const country = await getSelectedCountry();
  const {
    slides,
    featuredStores,
    featuredDeals,
    featuredCoupons,
    categories,
  } = await getMainFeed(country);

  return (
    <>
      <section className="hero-bg overflow-hidden">
        <h1 hidden>Couponluxury: Deals, coupon codes, Discounts &amp; offers</h1>
        <h2 hidden>
          Find Your Luxury Deals: Exclusive Discounts and Offers on High-End
          Brands
        </h2>
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 pb-10">
          <MainCarousel slides={slides} />
        </div>
      </section>

      <PopularStores featuredStores={featuredStores} />
      <TopCoupons coupons={featuredCoupons} categories={categories} />
      <DealsOfTheDay deals={featuredDeals} />
      <PopularCategoriesList categories={categories} />
      <SubscribeBanner />
    </>
  );
}
