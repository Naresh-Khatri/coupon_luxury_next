import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

function FeaturedCategories({ featuredCat }) {
  return (
    <Box bg={"#eeeeee"}>
      <Center flexDir={"column"} p={10}>
        <Text as={"h2"} fontSize="5xl" textAlign={"center"}>
          Coupon Luxuxy&rsquo;s
          <Text
            as={"span"}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip={"text"}
          >
            {" "}
            Featured Categories{" "}
          </Text>
        </Text>
        <Text as={"p"} opacity={0.5}>
          Search your favourite store & get many deals
        </Text>
      </Center>
      <Center>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {featuredCat.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <Box position={"relative"}>
                <Image
                  src={category.image}
                  width={350}
                  height={200}
                  alt={category.imgAlt}
                  objectPosition="relative"
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
      <Center mt={10}>
        <Link href={`/deals`}>
          <Button
            bg="brand.900"
            color="white"
            shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
            _hover={{
              bg: "brand.800",
              shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
            }}
            size="lg"
            fontSize={20}
            px={5}
            mb={5}
            borderRadius={10}
          >
            VIEW ALL CATEGORIES
          </Button>
        </Link>
      </Center>
    </Box>
  );
}

export default FeaturedCategories;
