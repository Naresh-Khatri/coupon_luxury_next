import MainCarousel from "@/components/home/MainCarousel";
import PopularStores from "@/components/home/PopularStores";
import TopCoupons from "@/components/home/TopCoupons";
import DealsOfTheDay from "@/components/home/DealsOfTheDay";
import PopularList from "@/components/home/PopularList";
import SubscribeBanner from "@/components/home/SubscribeBanner";
import StoreOfTheMonth from "@/components/home/StoreOfTheMonth";
import EditorsPicks from "@/components/home/EditorsPicks";
import TrendingOffers from "@/components/home/TrendingOffers";
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
    storeOfTheMonth,
    editorsPicks,
    trendingOffers,
    popularStores,
  } = await getMainFeed(country);

  const categoryItems = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.categoryName,
    count: c.offers.length,
  }));

  const storeItems = popularStores.map((st) => ({
    id: st.id,
    slug: st.slug,
    name: st.storeName,
    image: st.image,
    count: st.offerCount,
  }));

  return (
    <>
      <section className="hero-bg overflow-hidden">
        <h1 hidden>Couponluxury: Deals, coupon codes, Discounts &amp; offers</h1>
        <h2 hidden>
          Find Your Luxury Deals: Exclusive Discounts and Offers on High-End
          Brands
        </h2>
        <MainCarousel slides={slides} />
      </section>

      {storeOfTheMonth && <StoreOfTheMonth store={storeOfTheMonth} />}
      <PopularStores featuredStores={featuredStores} />
      <TrendingOffers offers={trendingOffers} />
      <EditorsPicks offers={editorsPicks} />
      <TopCoupons coupons={featuredCoupons} categories={categories} />
      <DealsOfTheDay deals={featuredDeals} />
      <section className="bg-background">
        <div className="mx-auto max-w-[1200px]">
          <PopularList
            title="Popular Categories"
            items={categoryItems}
            hrefBase="/categories"
            defaultOpen={false}
          />
          <PopularList
            title="Popular Stores"
            items={storeItems}
            hrefBase="/stores"
            defaultOpen={false}
          />
        </div>
      </section>
      <SubscribeBanner />
    </>
  );
}
