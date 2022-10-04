import { Box, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import MainCarousel from "../components/home/MainCarousel";
import CategoriesCarousel from "../components/home/CategoriesCarousel";
import DealsOfTheDay from "../components/home/DealsOfTheDay";
import StoresCarousel from "../components/home/StoresCarousel";
import FeaturedCategories from "../components/home/FeaturedCategories";
import SubscribeBanner from "../components/home/SubscribeBanner";

import SetMeta from "../utils/SetMeta";

export default function Home({
  slides,
  carouselCat,
  deals,
  featuredStores,
  featuredCat,
}) {
  return (
    <>
      <SetMeta
        title="Couponluxury: Deals, coupon codes, Discounts & offers"
        description="Avail the most luxurious deals and promo codes to get the best discount offers while shopping from brands. Exclusive coupon codes available on CouponLuxury"
        keywords="coupons, coupon codes, promo codes, discount codes, deals, online shopping, offers, vouchers, cashbacks"
        url="https://www.couponluxury.com/"
      />

      <Flex as="main" className="hero-bg" justifyContent="center">
        <Text as="h1" hidden>
          Couponluxury: Deals, coupon codes, Discounts & offers
        </Text>
        <Box pt={5} w={"100vw"} maxW={1300}>
          <MainCarousel slides={slides} />
          <CategoriesCarousel carouselCat={carouselCat} />
          <DealsOfTheDay deals={deals} />
        </Box>
      </Flex>
      <StoresCarousel featuredStores={featuredStores} />
      <FeaturedCategories featuredCat={featuredCat} />
      <SubscribeBanner />
    </>
  );
}
export const getStaticProps = async () => {
  try {
    let res = await fetch("http://localhost:4000/slides");
    const slides = await res.json();
    res = await fetch("http://localhost:4000/categories");
    const carouselCat = await res.json();
    const featuredCat = carouselCat;
    res = await fetch("http://localhost:4000/offers?feature=true&limit=20");
    const deals = await res.json();
    res = await fetch("http://localhost:4000/stores?limit=20");
    const featuredStores = await res.json();

    return {
      props: {
        slides,
        carouselCat,
        featuredCat,
        deals,
        featuredStores,
      },
      revalidate: 60,
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};
