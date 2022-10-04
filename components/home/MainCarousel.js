import { Box } from "@chakra-ui/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import styles from "../../styles/splide.module.css";
import Image from "next/future/image";
import Link from "next/link";

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
        {slides.map((slide) => (
          <SplideSlide key={slide.imgURL}>
            <Link href={slide.link}>
              <a
                target="_blank"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Image
                  style={{ aspectRatio: "5/4" }}
                  className={styles.carousel__img}
                  width="610"
                  height="500"
                  src={slide.imgURL}
                  alt={slide.imgAlt}
                />
              </a>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
}

export default MainCarousel;
