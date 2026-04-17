"use client";

import Image from "next/image";
import Link from "next/link";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { imageKitLoader } from "@/utils/imageKitLoader";

import "@splidejs/react-splide/css";
import "@splidejs/splide/css/skyblue";

type Slide = { id: string | number; link: string; imgURL: string; imgAlt: string };

export default function MainCarousel({ slides }: { slides: Slide[] }) {
  const options = {
    type: "loop",
    interval: 4000,
    autoplay: true,
    speed: 1000,
    perMove: 1,
    rewind: true,
    perPage: 2,
    breakpoints: {
      1100: {},
      480: {
        perPage: 1,
        arrows: false,
        width: "100%",
        pagination: false,
      },
    },
  };

  return (
    <div>
      <Splide aria-label="Offer slides" options={options} className="carousel-container">
        {slides.map((slide, index) => (
          <SplideSlide key={slide.id}>
            <Link
              href={slide.link}
              target="_blank"
              className="flex w-full justify-center"
            >
              <div className="w-full transition-transform duration-200 hover:scale-[1.03]">
                <Image
                  style={{ aspectRatio: "5/4" }}
                  className="carousel__img"
                  width={420}
                  height={360}
                  loader={imageKitLoader}
                  src={slide.imgURL}
                  alt={slide.imgAlt}
                  sizes="(min-width: 1200px) 50vw, (min-width: 768px) 100vw, 33vw"
                  quality={75}
                  priority={index <= 1}
                />
              </div>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
