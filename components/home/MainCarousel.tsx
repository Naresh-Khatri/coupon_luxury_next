"use client";

import Image from "next/image";
import Link from "next/link";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { imageKitLoader } from "@/utils/imageKitLoader";

import "@splidejs/react-splide/css";

type Slide = { id: string | number; link: string; imgURL: string; imgAlt: string };

export default function MainCarousel({ slides }: { slides: Slide[] }) {
  const options = {
    type: "loop",
    interval: 4000,
    autoplay: true,
    speed: 1000,
    perMove: 1,
    perPage: 2,
    gap: "1.5rem",
    pagination: true,
    arrows: true,
    breakpoints: {
      768: {
        perPage: 1,
        gap: "1rem",
        arrows: false,
      },
    },
  };

  return (
    <div
      className="relative w-full py-6"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="mx-auto w-full max-w-[1400px] p-4">
        <Splide
          aria-label="Offer slides"
          options={options}
          className="main-carousel"
        >
          {slides.map((slide, index) => (
            <SplideSlide key={slide.id}>
              <Link
                href={slide.link}
                target="_blank"
                className="group block overflow-hidden rounded-2xl ring-1 ring-white/5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    fill
                    loader={imageKitLoader}
                    src={slide.imgURL}
                    alt={slide.imgAlt}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    quality={80}
                    priority={index <= 1}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </Link>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}
