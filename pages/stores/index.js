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
import Banner from "../../components/Banner";
import StoreCard from "../../components/StoreCard";
import Header from "../../components/Header";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faHouse, faShop } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import SetMeta from "../../utils/SetMeta";

function Stores({ stores }) {
  return (
    <Box bg={"#eeeeee"}>
      <SetMeta
        title="CouponLuxury - Deals, Promo codes & exclusive coupons"
        description="Grab the greatest deals on all exclusive stores using luxury coupons, promo & discount codes. Shop the biggest brands like Nike, amazon, domino's using our offers"
        url="https://www.couponluxury.com/stores"
      />
      <Text as={"h1"} hidden>
        CouponLuxury - Deals, Promo codes & exclusive coupons
      </Text>
      <Banner title="All Stores" />

      <Center display={"flex"} flexDirection="column">
        <Box maxW={1200} w="100vw" px={4} justifyContent={"center"}>
          <Box my={4}>
            <Breadcrumb
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
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="/" fontSize="sm">
                  <Box>
                    <FontAwesomeIcon
                      icon={faShop}
                      style={{ paddingRight: "10px" }}
                    />
                    Stores
                  </Box>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>

          <Header leftText={"Stores"} rightText={"26 Stores available!"} />
          <SimpleGrid
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
      </Center>
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
