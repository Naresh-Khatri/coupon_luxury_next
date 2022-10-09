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
      480: {
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
          <SplideSlide key={slide.id}>
            <Link href={slide.link}>
              <a
                target="_blank"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {/* minH={{ base: "30vh", lg: "470px" }} */}
                <Box
                  w="full"
                  style={{
                    transition: "transform 0.2s ease-in",
                  }}
                  _hover={{
                    transform: "scale(1.03)",
                    transition: "transform 0.1s ease-in",
                  }}
                >
                  <Image
                    style={{ aspectRatio: "5/4" }}
                    className={styles.carousel__img}
                    width={420}
                    height={360}
                    // src={transform(slide.imgURL, 500)}
                    src={slide.imgURL}
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
