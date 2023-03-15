import { Box, Flex, Text } from "@chakra-ui/react";
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
      <SetMeta />

      <Flex
        as="main"
        className="hero-bg"
        justifyContent="center"
        overflow={"hidden"}
      >
        <Text as="h1" hidden>
          Couponluxury: Deals, coupon codes, Discounts & offers
        </Text>
        <Text as="h2" hidden>
        Find Your Luxury Deals: Exclusive Discounts and Offers on High-End Brands
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
    const res = await fetch(process.env.domain + "/main");
    const {
      slides,
      featuredStores,
      featuredOffers: deals,
      categories: carouselCat,
    } = await res.json();
    const featuredCat = carouselCat;

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
    console.log(err);
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};
