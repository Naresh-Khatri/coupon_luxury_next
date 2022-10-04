import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Grid,
  GridItem,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  faBagShopping,
  faHouse,
  faCube,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Banner from "../../components/Banner";
import OfferCard from "../../components/OfferCard";
import RecommendedStores from "../../components/RecommendedStores";

import SetMeta from "../../utils/SetMeta";

function StorePage({ categoryInfo, featuredStores }) {
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [filterBy, setFilterBy] = useState("all");

  const couponCount = categoryInfo.offers.filter(
    (offer) => offer.offerType == "coupon"
  ).length;
  useEffect(() => {
    handleFilterChange("all");
  });

  const handleFilterChange = (key) => {
    setFilterBy(key);
    if (key == "coupons")
      setFilteredOffers(
        categoryInfo.offers.filter((offer) => offer.offerType == "coupon")
      );
    else if (key == "deals")
      setFilteredOffers(
        categoryInfo.offers.filter((offer) => offer.offerType == "deal")
      );
    else setFilteredOffers(categoryInfo.offers);
  };

  return (
    <Box bg={"#e0e0e0"} pb={5}>
      <SetMeta
        title={categoryInfo.metaTitle}
        description={categoryInfo.metaDescription}
        keywords={categoryInfo.keywords}
        url={`https://www.couponluxury.com/${categoryInfo.slug}`}
      />
      <Banner
        title={`${
          categoryInfo.categoryName
        } Coupons & Deals For ${getMonthAndYear()}`}
      />
      <Center display={"flex"} flexDirection="column">
        <Box maxW={1200} w="100vw" justifyContent={"center"}>
          <Box p={4}>
            <Breadcrumb
              bg={"white"}
              p={4}
              borderRadius={15}
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
              color="brand.900"
            >
              <BreadcrumbItem>
                <Link href="/">
                  <a>
                    <Box fontSize="sm" _hover={{ color: "brand.1000" }}>
                      <FontAwesomeIcon
                        icon={faHouse}
                        style={{ paddingRight: "10px" }}
                      />
                      Home
                    </Box>
                  </a>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/categories" fontSize="sm">
                  <Box>
                    <FontAwesomeIcon
                      icon={faCube}
                      style={{ paddingRight: "10px" }}
                    />
                    Categories
                  </Box>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink fontSize="sm">
                  <Box>
                    <FontAwesomeIcon
                      icon={faBagShopping}
                      style={{ paddingRight: "10px" }}
                    />
                    {categoryInfo.categoryName}
                  </Box>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
          <Grid templateColumns={{ base: "", md: "repeat(7,1fr)" }}>
            <GridItem px={4} colSpan={{ base: 7, md: 2 }} as={"aside"}>
              <Box bg={"white"} borderRadius={15}>
                <Image
                  src={categoryInfo.image}
                  alt={`${categoryInfo.categoryName} - Logo`}
                  priority={1}
                  width={200}
                  height={100}
                  sizes={"100%"}
                  style={{ borderRadius: "15px" }}
                />
              </Box>

              <Box bg={"white"} p={4} borderRadius={15} my={3}>
                <Text fontSize={"3xl"}>Filter</Text>
                <RadioGroup
                  onChange={(e) => handleFilterChange(e)}
                  value={filterBy}
                >
                  <Stack>
                    <Radio value="all">All({categoryInfo.offers.length})</Radio>
                    <Radio value="coupons">Coupons({couponCount})</Radio>
                    <Radio value="deals">
                      Deals({categoryInfo.offers.length - couponCount})
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Box display={{ base: "none", md: "block" }}>
                <RecommendedStores stores={featuredStores} />
              </Box>
            </GridItem>
            <GridItem px={4} colSpan={5}>
              {filteredOffers.map((offer) => (
                <Box key={offer._id} mb={4}>
                  <OfferCard
                    offerDetails={{
                      ...offer,
                      categoryName: categoryInfo.categoryName,
                      image: categoryInfo.image,
                      fromPage: "categories",
                    }}
                  />
                </Box>
              ))}
              {filteredOffers.length == 0 && (
                <Center flexDirection={"column"} opacity={0.6}>
                  <Image
                    src={"/assets/not_found.svg"}
                    alt={"No coupons/deals found!"}
                    width={400}
                    height={400}
                  />
                  <Text
                    color="brand.900"
                    fontSize={"4xl"}
                    fontWeight={"extrabold"}
                  >
                    No Coupon or Deal
                  </Text>
                </Center>
              )}
            </GridItem>
          </Grid>
        </Box>
      </Center>
    </Box>
  );
}

export default StorePage;

export const getServerSideProps = async (ctx) => {
  try {
    let res = await fetch(
      "http://localhost:4000/categories/getUsingSlug/" + ctx.params.slug
    );
    const categoryInfo = await res.json();
    res = await fetch("http://localhost:4000/stores?featured=true&limit=16");
    const featuredStores = await res.json();
    return {
      props: {
        categoryInfo,
        featuredStores,
      },
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};

const getMonthAndYear = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};
