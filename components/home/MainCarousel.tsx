"use client";

import Image from "next/image";
import Link from "next/link";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { imageKitLoader } from "@/utils/imageKitLoader";

import "@splidejs/react-splide/css";

type Slide = {
  id: string | number;
  link: string;
  imgURL: string;
  imgAlt: string;
  title?: string | null;
  description?: string | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
};

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
          {slides.map((slide, index) => {
            const hasOverlay = !!(
              slide.title ||
              slide.description ||
              slide.ctaLabel
            );
            return (
              <SplideSlide key={slide.id}>
                <Link
                  href={slide.link}
                  target="_blank"
                  className="group relative block overflow-hidden rounded-2xl ring-1 ring-white/5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]"
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
                    {hasOverlay && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-5 text-white md:gap-3 md:p-7">
                          {slide.title && (
                            <h3 className="font-display text-xl font-semibold leading-tight drop-shadow md:text-2xl">
                              {slide.title}
                            </h3>
                          )}
                          {slide.description && (
                            <p className="line-clamp-2 max-w-md text-sm/relaxed text-white/90 drop-shadow">
                              {slide.description}
                            </p>
                          )}
                          {slide.ctaLabel && (
                            <CtaButton
                              href={slide.ctaLink || slide.link}
                              label={slide.ctaLabel}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              </SplideSlide>
            );
          })}
        </Splide>
      </div>
    </div>
  );
}

function CtaButton({ href, label }: { href: string; label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== "undefined") window.open(href, "_blank");
      }}
      className="mt-1 inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-lg transition-transform duration-200 hover:scale-[1.03]"
    >
      {label}
    </button>
  );
}
