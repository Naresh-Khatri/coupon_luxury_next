import { notFound } from "next/navigation";
import MainCarousel from "@/components/home/MainCarousel";
import CategoriesCarousel from "@/components/home/CategoriesCarousel";
import DealsOfTheDay from "@/components/home/DealsOfTheDay";
import StoresCarousel from "@/components/home/StoresCarousel";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import SubscribeBanner from "@/components/home/SubscribeBanner";
import { domain } from "@/lib/lib";

export const revalidate = 60;

async function getData() {
  const res = await fetch(`${domain}/main`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function Home() {
  const data = await getData();
  if (!data) notFound();

  const {
    slides,
    featuredStores,
    featuredOffers: deals,
    categories: carouselCat,
  } = data;
  const featuredCat = carouselCat;

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
          <CategoriesCarousel carouselCat={carouselCat} />
          <DealsOfTheDay deals={deals} />
        </div>
      </section>
      <StoresCarousel featuredStores={featuredStores} />
      <FeaturedCategories featuredCat={featuredCat} />
      <SubscribeBanner />
    </>
  );
}
