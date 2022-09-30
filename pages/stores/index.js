import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Banner from "../../components/Banner";
import axios from "axios";
import StoreCard from "../../components/StoreCard";
import Header from "../../components/Header";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faHouse, faShop } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function Stores({ stores }) {
  return (
    <Box bg={"#eeeeee"}>
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
                key={store._id}
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

export const getServerSideProps = async () => {
  const res = await fetch("http://localhost:4000/stores?limit=20");
  const data = await res.json();
  return {
    props: { stores: data },
  };
};

export default Stores;
