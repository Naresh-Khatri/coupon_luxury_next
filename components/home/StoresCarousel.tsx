"use client";

import { useRef } from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";

import "@splidejs/react-splide/css";
import "@splidejs/splide/css/skyblue";

type Store = { id: string | number; storeName: string; image: string };

export default function StoresCarousel({
  featuredStores,
}: {
  featuredStores: Store[];
}) {
  const splide1 = useRef<any>(null);
  const splide2 = useRef<any>(null);

  const options = {
    type: "loop",
    autoplay: true,
    interval: 3000,
    speed: 3000,
    gap: "2rem",
    perPage: 10,
    pagination: false,
    arrows: false,
    breakpoints: {
      1600: { perPage: 8 },
      1024: { perPage: 7 },
      768: { perPage: 5 },
      600: { perPage: 4 },
      500: { perPage: 3 },
    },
    perMove: 1,
    rewind: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  };

  const changeAutoplay = (play: boolean) => {
    for (const ref of [splide1, splide2]) {
      const Autoplay = ref.current?.splide?.Components?.Autoplay;
      if (!Autoplay) continue;
      if (play) Autoplay.play();
      else Autoplay.pause();
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center p-5 md:p-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-gold md:text-sm">
          One destination
        </p>
        <h2 className="mb-3 text-center text-3xl font-bold leading-[1.15] md:text-5xl">
          More Than{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #0092c0, #C49A3C)",
            }}
          >
            1000+ Stores
          </span>{" "}
          In One Place
        </h2>
        <p className="hidden text-center text-base font-normal text-gray-500 md:block">
          Search your favourite store &amp; get exclusive deals
        </p>
      </div>
      <div
        className="mb-5 flex h-[160px] flex-col justify-between"
        onTouchStart={() => changeAutoplay(false)}
        onTouchEnd={() => changeAutoplay(true)}
        onMouseEnter={() => changeAutoplay(false)}
        onMouseLeave={() => changeAutoplay(true)}
      >
        <Splide aria-label="Offers" options={options} ref={splide1}>
          {featuredStores.map((store) => (
            <SplideSlide key={store.id}>
              <div className="mt-5 h-[45px] w-[90px] transition-transform duration-200 hover:scale-110 md:h-[50px] md:w-[100px] lg:h-[60px] lg:w-[120px]">
                <Image
                  className="rounded"
                  width={120}
                  height={60}
                  src={store.image}
                  alt={`${store.storeName} logo`}
                />
              </div>
            </SplideSlide>
          ))}
        </Splide>
        <Splide
          aria-label="Offers"
          options={{ ...options, direction: "rtl" }}
          ref={splide2}
        >
          {featuredStores.map((store) => (
            <SplideSlide key={store.id}>
              <div className="mt-5 h-[45px] w-[90px] transition-transform duration-200 hover:scale-110 md:h-[50px] md:w-[100px] lg:h-[60px] lg:w-[120px]">
                <Image
                  className="rounded"
                  width={120}
                  height={60}
                  src={store.image}
                  alt={`${store.storeName} logo`}
                />
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}
