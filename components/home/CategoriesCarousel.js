import { useEffect, useState } from "react";
import axios from "axios";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import styles from "../../styles/splide.module.css";
import Link from "next/link";

function MainCarousel() {
  const [categories, setCategories] = useState([]);
  const options = {
    type: "loop",
    autoplay: true,
    interval: 3000,
    speed: 3000,
    gap: "2rem",
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
        padding: "1rem",
      },
    },
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  };
  useEffect(() => {
    axios
      .get("http://localhost:4000/categories")
      .then((res) => {
        setCategories(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Flex justifyContent={"center"}>
      <Splide
        aria-label="Offers"
        options={options}
        className="carousel-container"
      >
        {categories.map((slide) => (
          <SplideSlide key={slide._id}>
            <Link href={`/categories/${slide.slug}`}>
              <a>
                <Image
                  className={styles.carousel__img}
                  width="200"
                  height="120"
                  src={slide.image}
                  alt={`Category imga: ${slide.categoryName}`}
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
