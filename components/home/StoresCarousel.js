import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";

function DealsOfTheDay({ featuredStores }) {
  const options = {
    type: "loop",
    autoplay: true,
    interval: 3000,
    speed: 3000,
    gap: "2rem",
    perPage: 10,
    pagination: false,
    arrows: false,

    breakpoints: {
      1024: { perPage: 8 },
      768: { perPage: 6 },
      600: { perPage: 4 },
      500: { perPage: 3 },
    },
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  };

  return (
    <Box w="full">
      <Center p={10}>
        <Text as={"h2"} fontSize="5xl" textAlign={"center"}>
          More Than
          <Text
            as={"span"}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip={"text"}
          >
            {" "}
            1000+ Stores{" "}
          </Text>
          In One Place!
        </Text>
      </Center>
      <Center>
        <Text as={"p"} opacity={0.5} mt={2}>
          Search your favourite store & get many deals
        </Text>
      </Center>
      <Flex h={160} my={10} direction="column" justifyContent="space-between">
        <Splide
          aria-label="Offers"
          options={options}
          className="carousel-container"
        >
          {featuredStores.map((store) => (
            <SplideSlide key={store._id}>
              <Box w={"100px"} h={"50px"} mt={5}>
                <Image
                  style={{ borderRadius: "5px" }}
                  width={100}
                  height={50}
                  sizes={"100%"}
                  src={store.image}
                  alt={store.name}
                />
              </Box>
            </SplideSlide>
          ))}
        </Splide>
        <Splide
          aria-label="Offers"
          options={{ ...options, direction: "rtl" }}
          className="carousel-container"
        >
          {featuredStores.map((store) => (
            <SplideSlide key={store._id}>
              <Box w={"100px"} h={"50px"} mt={5}>
                <Image
                  style={{ borderRadius: "5px" }}
                  sizes={"100%"}
                  width={100}
                  height={50}
                  src={store.image}
                  alt={store.name}
                />
              </Box>
            </SplideSlide>
          ))}
        </Splide>
      </Flex>
    </Box>
  );
}

export default DealsOfTheDay;
