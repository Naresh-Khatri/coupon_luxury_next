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
      <Center flexDir={"column"} py={10} px={6}>
        <Text
          as={"h2"}
          fontSize={{ base: "3xl", md: "5xl" }}
          textAlign={"center"}
          mb={{ base: 0, md: 5 }}
        >
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
        <Text
          as={"p"}
          color={"gray.800"}
          textAlign="center"
          display={{ base: "none", md: "block" }}
        >
          Search your favourite store & get many deals
        </Text>
      </Center>
      <Center>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {featuredCat.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Box
                position={"relative"}
                h={200}
                w={350}
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
                  alt={category.imgAlt || category.categoryName + " image"}
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
                    alignContent="center"
                    color="white"
                    fontSize={"3xl"}
                    fontWeight={"extrabold"}
                    textAlign={"center"}
                  >
                    {category.categoryName}
                  </Text>
                  <Text as={"p"} alignContent="center" color="white">
                    {category.offers.length} Deals / Coupons
                  </Text>
                </Flex>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Center>
      <Center mt={10}>
        <Link href={`/categories`}>
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
