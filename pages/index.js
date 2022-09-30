import { Box, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import MainCarousel from "../components/home/MainCarousel";
import CategoriesCarousel from "../components/home/CategoriesCarousel";
import DealsOfTheDay from "../components/home/DealsOfTheDay";
import StoresCarousel from "../components/home/StoresCarousel";
import FeaturedCategories from "../components/home/FeaturedCategories";
import SubscribeBanner from "../components/home/SubscribeBanner";

export default function Home({
  slides,
  carouselCat,
  deals,
  featuredStores,
  featuredCat,
}) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" className="hero-bg" justifyContent="center">
        <Text as="h1" style={{ display: "none" }}>
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
export const getServerSideProps = async () => {
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
  };
};
