import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCube } from "@fortawesome/free-solid-svg-icons";
import Banner from "../../components/Banner";

import SetMeta from "../../utils/SetMeta";

function index({ featuredCat }) {
  return (
    <Box>
      <SetMeta
        title={`All Deals and discount Offers in different categories`}
        description={`Shop on all categories using the latest luxury coupon codes and discount offers and grab the best deals on your order. Extra 20% off on different categories`}
        url={"https://www.couponluxury.com/categories"}
      />
      <Text as={"h1"} hidden>
        Indulge in Luxury: Unlock Savings on Top Brands Across All Categories
      </Text>
      <Text as={"h2"} hidden>
        Find Your bold Style: Discover Exclusive Coupons and Deals for All
        Categories
      </Text>
      <Banner
        title={"All Categories"}
        subTitle={`${featuredCat.length} Categories available`}
      />
      <Flex bg={"#e0e0e0"} pb={5} justifyContent="center">
        <Center flexDirection={"column"} maxW={1240} px={2}>
          <Box my={4} alignSelf={"flex-start"}>
            <Breadcrumb
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
              color="brand.900"
              fontWeight={"semibold"}
            >
              <BreadcrumbItem>
                <Link href="/" passHref>
                  <a>
                    <Box
                      fontSize="sm"
                      _hover={{ color: "brand.1000" }}
                      display="flex"
                    >
                      <FontAwesomeIcon
                        height={"1rem"}
                        icon={faHouse}
                        style={{ paddingRight: "10px" }}
                      />
                      Home
                    </Box>
                  </a>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="/" fontSize="sm">
                  <Box display="flex">
                    <FontAwesomeIcon
                      height={"1rem"}
                      icon={faCube}
                      style={{ paddingRight: "10px" }}
                    />
                    Categories
                  </Box>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={5}
            maxW={"1240px"}
          >
            {featuredCat.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <a>
                  <Box
                    position={"relative"}
                    _hover={{
                      opacity: 0.9,
                      transform: "scale(1.07)",
                      transition: "all .1s easy-in-out",
                    }}
                    style={{ transition: "all .1s ease-in-out" }}
                  >
                    <Image
                      src={category.image}
                      width={350}
                      height={200}
                      alt={category.imgAlt}
                      style={{
                        borderRadius: "15px",
                        filter: "brightness(0.5)",
                      }}
                    />
                    <Flex
                      style={{ position: "absolute", top: 0, left: 0 }}
                      w="350px"
                      h={"200px"}
                      direction="column"
                      justify={"center"}
                      align={"center"}
                    >
                      <Text
                        as={"h4"}
                        alignContent="center"
                        color="white"
                        fontSize={"3xl"}
                        fontWeight={"extrabold"}
                        textAlign={"center"}
                      >
                        {category.categoryName}
                      </Text>
                      <Text as={"p"} alignContent="center" color="white">
                        {`${category.offers.length} Deals / Coupons`}
                      </Text>
                    </Flex>
                  </Box>
                </a>
              </Link>
            ))}
          </SimpleGrid>
        </Center>
      </Flex>
    </Box>
  );
}

export const getStaticProps = async () => {
  try {
    let res = await fetch(process.env.domain + "/categories");
    const featuredCat = await res.json();
    return {
      props: {
        featuredCat,
      },
      revalidate: 60,
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};

export default index;
