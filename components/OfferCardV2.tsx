"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info, CheckCircle2 } from "lucide-react";
import CodeRevealingButton from "./CodeRevealingButton/CodeRevealingButton";

type OfferDetails = {
  title: string;
  couponCode: string;
  affURL: string;
  slug: string;
  discountType: "percentage" | string;
  discountValue: string | number;
  description: string;
  TnC: string;
  image: string;
  endDate: string;
  offerType: "coupon" | "deal";
  fromPage?: "stores" | "categories";
  storeName: string;
  store?: { slug: string; image: string };
};

export default function OfferCardV2({
  offerDetails,
}: {
  offerDetails: OfferDetails;
}) {
  const {
    title,
    couponCode,
    affURL,
    slug,
    discountType,
    discountValue,
    TnC,
    image,
    endDate,
    offerType,
    fromPage,
    storeName,
  } = offerDetails;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen((v) => !v)}
      className="rounded-[15px] bg-white transition-all duration-100 hover:-translate-y-2 hover:scale-[1.02]"
    >
      <div className="flex h-[160px]">
        <div className="flex h-full items-center justify-center p-3">
          <div className="flex min-w-[70px] items-center justify-center">
            {fromPage === "categories" && offerDetails.store ? (
              <Link href={`/stores/${offerDetails.store.slug}`}>
                <div className="hidden sm:flex">
                  <Image
                    src={offerDetails.store.image}
                    alt="logo"
                    width={140}
                    height={70}
                  />
                </div>
                <div className="flex sm:hidden">
                  <Image
                    src={offerDetails.store.image}
                    alt="logo"
                    width={100}
                    height={50}
                  />
                </div>
              </Link>
            ) : (
              <div className="banner-bg flex size-[100px] items-center justify-center rounded-[15px] p-2 text-center text-3xl font-extrabold leading-none text-white">
                {discountType === "percentage"
                  ? `${discountValue}% OFF`
                  : `$${discountValue}`}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col justify-between p-3 sm:flex-row sm:p-5">
          <div>
            <p className="line-clamp-2 text-base font-semibold leading-[1.4] sm:text-[1.375rem]">
              {title}
            </p>
            <div className="mt-2 flex items-center gap-2 text-green-500">
              <CheckCircle2 className="size-4" />
              <span className="text-[13px] text-black sm:text-sm">
                valid Till: <span className="text-green-500">{endDate}</span>
              </span>
            </div>
          </div>

          <div className="flex w-[170px] items-center justify-end">
            {offerType === "coupon" ? (
              <CodeRevealingButton
                code={couponCode}
                affURL={affURL}
                image={image}
                storeName={storeName}
              />
            ) : (
              <Link href={`/deals/${slug}`} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-brand-900 px-7 text-white shadow-lg transition-colors hover:bg-brand-800 sm:h-12"
                >
                  Get Deal
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-b-[15px] bg-white px-4 py-2 text-sm font-normal"
      >
        <span className="flex items-center">
          {isOpen ? (
            <ChevronUp className="size-6" />
          ) : (
            <ChevronDown className="size-6" />
          )}
          <span className="ml-10 text-[14px] font-medium">Show Details</span>
        </span>
        <Info className="size-4" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-md px-10 pb-5 shadow-md">
              <div
                className="page-html mt-4 text-black"
                dangerouslySetInnerHTML={{ __html: TnC }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
