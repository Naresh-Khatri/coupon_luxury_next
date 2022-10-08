import { Box, Flex, Text } from "@chakra-ui/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/future/image";
import Link from "next/link";

import "@splidejs/react-splide/css";
import "@splidejs/splide/css/skyblue";

import styles from "../../styles/splide.module.css";
import transformPath from "../../utils/transformImagePath";

function MainCarousel({ carouselCat }) {
  const options = {
    type: "loop",
    autoplay: true,
    interval: 3000,
    speed: 3000,
    width: "95%",
    perPage: 6,
    pagination: true,
    arrows: true,
    pagination: false,

    breakpoints: {
      850: { perPage: 4, arrows: false, width: "100%", pagination: false },
      600: {
        perPage: 3,
        arrows: false,
        width: "100%",
        pagination: false,
      },
    },
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  };
  return (
    <Flex justifyContent={"center"}>
      <Splide
        aria-label="Offers"
        options={options}
        className="carousel-container"
      >
        {carouselCat.map((slide, index) => (
          <SplideSlide key={slide.id}>
            <Link href={`/categories/${slide.slug}`}>
              <a
                target="_blank"
                style={{
                  position: "relative",
                  width: "650px",
                  height: "160px",
                }}
              >
                <Box minH="13vh" w="full">
                  <Image
                    className={styles.carousel__img}
                    width={100}
                    height={50}
                    src={transformPath(slide.image, 150)}
                    alt={`Category image: ${slide.categoryName}`}
                    priority={index <= 6 ? true : false}
                  />
                  <Text textAlign={"center"} fontSize={14} noOfLines={1}>
                    {slide.categoryName}
                  </Text>
                </Box>
              </a>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </Flex>
  );
}

export default MainCarousel;
