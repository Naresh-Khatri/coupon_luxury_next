import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Container,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Banner from "../../components/Banner";
import StoreCard from "../../components/StoreCard";
import Header from "../../components/Header";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faShop } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import SetMeta from "../../utils/SetMeta";

function Stores({ stores }) {
  return (
    <Box bg={"#eeeeee"} pb={10} fontWeight={"semibold"}>
      <SetMeta
        title="CouponLuxury - Deals, Promo codes & exclusive coupons"
        description="Grab the greatest deals on all exclusive stores using luxury coupons, promo & discount codes. Shop the biggest brands like Nike, amazon, domino's using our offers"
        url="https://www.couponluxury.com/stores"
      />
      <Text as={"h1"} hidden>
        Shop in Style: Discover the Best Deals and Discounts for All Top big
        Brands
      </Text>
      <Text as={"h2"} hidden>
        Experience the Finest Shopping: Exclusive Coupons and Discounts for any
        Brand
      </Text>
      <Banner
        title="All Stores"
        subTitle={`${stores.length} stores available!`}
      />

      <Container mt={10} minH={"100vh"} maxW={"6xl"} w="90vw" pb={10} px={0}>
        <Box maxW={1200} w="100%">
          <Box my={4}>
            <Breadcrumb
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
              color="brand.900"
            >
              <BreadcrumbItem>
                <Link href="/">
                  <Box
                    fontSize="sm"
                    _hover={{ color: "brand.1000" }}
                    display="flex"
                  >
                    <FontAwesomeIcon
                      icon={faHouse}
                      height={"1rem"}
                      style={{ paddingRight: "10px" }}
                    />
                    Home
                  </Box>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <Box display="flex">
                  <FontAwesomeIcon
                    icon={faShop}
                    height={"1rem"}
                    style={{ paddingRight: "10px" }}
                  />
                  Stores
                </Box>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>

          <Header
            leftText={"Stores"}
            rightText={`${stores.length} Stores available!`}
          />
          <SimpleGrid
            // columns={{ base: 2, md: 3, lg: 5 }}
            minChildWidth={{ base: "110px", md: "130px", lg: "160px" }}
            spacing={3}
          >
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                slug={store.slug}
                title={store.storeName}
                img={store.image}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}

export const getStaticProps = async () => {
  try {
    const res = await fetch(process.env.domain + "/stores?limit=20");
    const data = await res.json();
    return {
      props: { stores: data },
      revalidate: 60,
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};

export default Stores;
