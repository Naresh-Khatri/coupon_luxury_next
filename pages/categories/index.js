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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { faHouse, faCube } from "@fortawesome/free-solid-svg-icons";
import FeaturedCategories from "../../components/home/FeaturedCategories";

function index({ featuredCat }) {
  return (
    <Flex bg={"#e0e0e0"} justifyContent="center">
      <Center flexDirection={"column"} maxW={1240} px={2}>
        <Box my={4} alignSelf={"flex-start"}>
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            color="brand.900"
          >
            <BreadcrumbItem>
              <Link href="/" passHref>
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
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <Box position={"relative"}>
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
                    2 Deals / Coupons
                  </Text>
                </Flex>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Center>
    </Flex>
  );
}

export const getServerSideProps = async () => {
  let res = await fetch("http://localhost:4000/categories");
  const featuredCat = await res.json();
  return {
    props: {
      featuredCat,
    },
  };
};

export default index;
