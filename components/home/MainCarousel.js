import { Box } from "@chakra-ui/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/future/image";
import Link from "next/link";

import styles from "../../styles/splide.module.css";
import transform from "../../utils/transformImagePath";

import "@splidejs/react-splide/css";
import "@splidejs/splide/css/skyblue";


function MainCarousel({ slides }) {
  const options = {
    type: "loop",
    interval: 3000,
    autoplay: true,
    speed: 3000,
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    perPage: 2,
    breakpoints: {
      1100: {
        //  padding: "1rem"
      },
      600: {
        perPage: 1,
        arrows: false,
        width: "100%",
        pagination: false,
      },
    },
  };

  return (
    <Box>
      <Splide
        aria-label="Offer slides"
        options={options}
        className="carousel-container"
      >
        {slides.map((slide, index) => (
          <SplideSlide key={slide.imgURL}>
            <Link href={slide.link}>
              <a
                target="_blank"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Box h={{ base: "auto", lg: "470px" }} w="full">
                  <Image
                    style={{ aspectRatio: "5/4" }}
                    className={styles.carousel__img}
                    width={350}
                    height={300}
                    src={transform(slide.imgURL, 500)}
                    alt={slide.imgAlt}
                    priority={index <= 1 ? true : false}
                  />
                </Box>
              </a>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
}

export default MainCarousel;
