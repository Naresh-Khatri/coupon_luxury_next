import { Flex, Text } from "@chakra-ui/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import styles from "../../styles/splide.module.css";
import Image from "next/future/image";
import Link from "next/link";

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
        {carouselCat.map((slide) => (
          <SplideSlide key={slide._id}>
            <Link href={`/categories/${slide.slug}`}>
              <a target="_blank">
                <Image
                  className={styles.carousel__img}
                  width={200}
                  height={50}
                  src={slide.image}
                  sizes={"100vw"}
                  alt={`Category image: ${slide.categoryName}`}
                />
                <Text textAlign={"center"} fontSize={14} noOfLines={1}>
                  {slide.categoryName}
                </Text>
              </a>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </Flex>
  );
}

export default MainCarousel;
