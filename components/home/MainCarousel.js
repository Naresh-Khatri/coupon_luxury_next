import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import styles from "../../styles/splide.module.css";
import Link from "next/link";

function MainCarousel({ slides }) {
  const options = {
    type: "loop",
    autoplay: true,
    interval: 3000,
    speed: 3000,
    gap: "2rem",
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    perPage: 2,
    breakpoints: {
      1100: { padding: "1rem" },
      600: {
        perPage: 1,
        arrows: false,
        width: "100%",
        pagination: false,
        padding: "2rem",
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
              <a target="_blank">
                <Image
                  className={styles.carousel__img}
                  width="610"
                  height="450"
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
