"use client";

import Image from "next/image";
import Link from "next/link";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import transformPath from "@/utils/transformImagePath";

import "@splidejs/react-splide/css";
import "@splidejs/splide/css/skyblue";

type Cat = {
  id: string | number;
  slug: string;
  image: string;
  categoryName: string;
};

export default function CategoriesCarousel({
  carouselCat,
}: {
  carouselCat: Cat[];
}) {
  const options = {
    type: "loop",
    autoplay: true,
    interval: 3000,
    speed: 3000,
    width: "95%",
    perPage: 6,
    pagination: false,
    arrows: true,
    breakpoints: {
      850: { perPage: 4, arrows: false, width: "100%", pagination: false },
      600: { perPage: 3, arrows: false, width: "100%", pagination: false },
    },
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  };

  return (
    <div className="flex justify-center">
      <Splide aria-label="Offers" options={options} className="carousel-container">
        {carouselCat.map((slide, index) => (
          <SplideSlide key={slide.id}>
            <Link
              href={`/categories/${slide.slug}`}
              className="relative block"
            >
              <div className="w-full transition-transform duration-200 hover:scale-[1.03]">
                <Image
                  className="carousel__img"
                  width={150}
                  height={75}
                  src={transformPath(slide.image, 150)}
                  alt={`Category image: ${slide.categoryName}`}
                  priority={index <= 6}
                />
                <p className="line-clamp-1 text-center text-sm font-semibold">
                  {slide.categoryName}
                </p>
              </div>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
