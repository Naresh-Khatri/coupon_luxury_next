import { useState, useEffect } from "react";
import { Box, Center, Flex, Link, SimpleGrid, Text } from "@chakra-ui/react";

import axios from "axios";
import Image from "next/image";

function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:4000/categories").then((res) => {
      setCategories(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <>
      <Center>
        <Text as={"h2"} fontSize="5xl" textAlign={"center"}>
          Counpon Luxuxy&rsquo;s
          <Text
            as={"span"}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip={"text"}
          >
            {" "}
            Featured Categories{" "}
          </Text>
        </Text>
      </Center>
      <Center>
        <Text as={"p"} opacity={0.5}>
          Search your favourite store & get many deals
        </Text>
      </Center>
      <Center>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <Box position={"relative"}>
                <Image
                  src={category.image}
                  width={350}
                  height={200}
                  alt={category.imgAlt}
                  style={{
                    position: "relative",
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
    </>
  );
}

export default FeaturedCategories;
