import MainCarousel from "@/components/home/MainCarousel";
import CategoriesCarousel from "@/components/home/CategoriesCarousel";
import DealsOfTheDay from "@/components/home/DealsOfTheDay";
import StoresCarousel from "@/components/home/StoresCarousel";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import SubscribeBanner from "@/components/home/SubscribeBanner";
import { getMainFeed } from "@/server/db/queries/main";

export default async function Home() {
  const {
    slides,
    featuredStores,
    featuredOffers: deals,
    categories,
  } = await getMainFeed();

  return (
    <>
      <section className="hero-bg flex justify-center overflow-hidden">
        <h1 hidden>Couponluxury: Deals, coupon codes, Discounts &amp; offers</h1>
        <h2 hidden>
          Find Your Luxury Deals: Exclusive Discounts and Offers on High-End
          Brands
        </h2>
        <div className="w-screen max-w-[1300px] pt-5">
          <MainCarousel slides={slides} />
          <CategoriesCarousel carouselCat={categories} />
          <DealsOfTheDay deals={deals} />
        </div>
      </section>
      <StoresCarousel featuredStores={featuredStores} />
      <FeaturedCategories featuredCat={categories} />
      <SubscribeBanner />
    </>
  );
}
