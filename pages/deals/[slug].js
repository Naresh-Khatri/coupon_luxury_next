import {
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Banner from "../../components/Banner";
import DealCard from "../../components/DealCard";

import SetMeta from "../../utils/SetMeta";

function DealPage({ dealsInfo, recommendedDeals }) {
  const { store, affURL, description, title } = dealsInfo;
  const toast = useToast();

  const [clickedOnDeal, setClickedOnDeal] = useState(false);
  const handleButtonClick = () => {
    toast({
      title: "Deal applied in new tab!",
      status: "success",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
    setClickedOnDeal(true);
  };
  return (
    <>
      <SetMeta
        title={dealsInfo.title}
        description={dealsInfo.description?.replace(/(<([^>]+)>)/gi, "")}
        url={`https://www.couponluxury.com/deal/${dealsInfo.slug}`}
      />
      <Banner subTitle="*No coupon code required to avail this discount" />
      <Flex
        as={"section"}
        className="hero-bg"
        justifyContent={"center"}
        h={300}
      >
        <SimpleGrid
          as="main"
          w={{ base: "100vw", md: "60vw" }}
          maxW={1200}
          columns={{ base: 1, md: 2 }}
        >
          <Center flexDirection="column">
            <Image
              src={store.image}
              alt={`${store.storeName} - logo`}
              width={250}
              height={125}
            />
            <Text color={"black"} fontSize={"3xl"} textAlign="center">
              {title}
            </Text>
          </Center>
          <Center flexDirection="column">
            <Link href={affURL}>
              <a target="_blank">
                <Button
                  bg="brand.900"
                  onClick={handleButtonClick}
                  color="white"
                  shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
                  _hover={{
                    bg: "brand.800",
                    shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
                  }}
                  w={"156"}
                  h={"63"}
                  fontSize={20}
                  px={5}
                  mb={5}
                >
                  GET DEAL
                </Button>
              </a>
            </Link>
            {clickedOnDeal && (
              <Text as={"p"} fontSize={"sm"}>
                {" "}
                Deal applied in new tab!
              </Text>
            )}
          </Center>
        </SimpleGrid>
      </Flex>
      <Box bg={"#f5f5f5"} py={10}>
        <Text
          color={"brand.900"}
          fontSize={{ base: "3xl", lg: "5xl" }}
          fontWeight="extrabold"
          mb={10}
          textAlign={"center"}
        >
          Related Deals
        </Text>
        <Center>
          <SimpleGrid columns={[2, 3, 5]} spacing={5} justifyContent="center">
            {recommendedDeals.map((deal) => (
              <DealCard
                key={deal.id}
                affURL={deal.affURL}
                storeName={deal.store.storeName}
                storeSlug={deal.store.slug}
                dealSlug={deal.slug}
                title={deal.title}
                code={deal.couponCode ? deal.couponCode : ""}
                type={deal.offerType}
                endDate={deal.endDate}
                showValidTill={false}
                storeImg={deal.store.image}
              />
            ))}
          </SimpleGrid>
        </Center>
      </Box>
    </>
  );
}

export default DealPage;

export const getServerSideProps = async (ctx) => {
  try {
    let res = await fetch(
      process.env.domain + `/offers/getWithSlug/${ctx.query.slug}`
    );
    const dealsInfo = await res.json();

    res = await fetch(
      process.env.domain +
        `/offers?offerType=deal&category=${dealsInfo.category}&featured=true&limit=20`
    );
    let recommendedDeals = await res.json();
    recommendedDeals = recommendedDeals.filter(
      (deal) => deal.id !== dealsInfo.id
    );

    return {
      props: {
        dealsInfo,
        recommendedDeals,
      },
    };
  } catch (err) {
    console.log("err fetching deal", err);
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};
