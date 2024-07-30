import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import { useRef, useState } from "react";

function DealsOfTheDay({ featuredStores }) {
  const splide1 = useRef();
  const splide2 = useRef();
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
      1600: { perPage: 8 },
      1024: { perPage: 7 },
      768: { perPage: 5 },
      600: { perPage: 4 },
      500: { perPage: 3 },
    },
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  };
  const changeAutoplay = (play) => {
    let Autoplay = splide1.current.splide.Components.Autoplay;
    if (play) {
      Autoplay.play();
    } else {
      Autoplay.pause();
    }
    Autoplay = splide2.current.splide.Components.Autoplay;
    if (play) {
      Autoplay.play();
    } else {
      Autoplay.pause();
    }
  };

  return (
    <Box w="full">
      <Center p={{ base: 5, md: 10 }} flexDir="column">
        <Text
          as={"h2"}
          fontSize={{ base: "3xl", md: "5xl" }}
          textAlign={"center"}
          mb={5}
          fontWeight="semibold"
        >
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
        <Text
          as={"p"}
          color={"gray.800"}
          textAlign="center"
          display={{ base: "none", md: "block" }}
          fontWeight="semibold"
        >
          Search your favourite store & get many deals
        </Text>
      </Center>
      <Flex
        h={160}
        mb={5}
        direction="column"
        justifyContent="space-between"
        onTouchStart={() => changeAutoplay(false)}
        onTouchEnd={() => changeAutoplay(true)}
        onMouseEnter={() => {
          changeAutoplay(false);
        }}
        onMouseLeave={() => {
          changeAutoplay(true);
        }}
      >
        <Splide aria-label="Offers" options={options} ref={splide1}>
          {featuredStores.map((store) => (
            <SplideSlide key={store.id}>
              <Box
                w={{ base: "90px", md: "100px", lg: "120px" }}
                h={{ base: "45px", md: "50px", lg: "60px" }}
                mt={5}
                _hover={{
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease-in",
                }}
                style={{
                  transition: "transform 0.2s ease-in",
                }}
              >
                <Image
                  style={{ borderRadius: "5px" }}
                  width={120}
                  height={60}
                  src={store.image}
                  alt={`${store.storeName} logo`}
                />
              </Box>
            </SplideSlide>
          ))}
        </Splide>
        <Splide
          aria-label="Offers"
          options={{ ...options, direction: "rtl" }}
          ref={splide2}
        >
          {featuredStores.map((store) => (
            <SplideSlide key={store.id}>
              <Box
                w={{ base: "90px", md: "100px", lg: "120px" }}
                h={{ base: "45px", md: "50px", lg: "60px" }}
                mt={5}
                _hover={{
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease-in",
                }}
                style={{
                  transition: "transform 0.2s ease-in",
                }}
              >
                <Image
                  style={{ borderRadius: "5px" }}
                  sizes={"100%"}
                  width={120}
                  height={60}
                  src={store.image}
                  alt={`${store.storeName} logo`}
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
