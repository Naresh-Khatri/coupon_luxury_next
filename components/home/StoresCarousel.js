import { Box, Button, Center, Grid, SimpleGrid, Text } from "@chakra-ui/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import OfferCard from "../DealCard";

function DealsOfTheDay() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/stores?limit=20").then((res) => {
      console.log(res.data);
      setStores(res.data);
    });
  }, []);

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
      <Center>
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
        <Text as={"p"} opacity={0.5}>
          Search your favourite store & get many deals
        </Text>
      </Center>
      <Splide
        aria-label="Offers"
        options={options}
        className="carousel-container"
      >
        {stores.map((store) => (
          <SplideSlide key={store._id}>
            <Box w={"130px"} h={"80px"}>
              <Image
                style={{ borderRadius: "5px", margin: "15px 0px" }}
                width={100}
                height={50}
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
        {stores.map((store) => (
          <SplideSlide key={store._id}>
            <Box w={"130px"} h={"80px"}>
              <Image
                style={{ borderRadius: "5px" }}
                width={"100"}
                height={50}
                src={store.image}
                alt={store.name}
              />
            </Box>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
}

export default DealsOfTheDay;
