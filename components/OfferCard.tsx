"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Info } from "lucide-react";
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

export default function OfferCard({ offerDetails }: { offerDetails: OfferDetails }) {
  const {
    title,
    couponCode,
    affURL,
    slug,
    discountType,
    discountValue,
    description,
    TnC,
    image,
    endDate,
    offerType,
    fromPage,
    storeName,
  } = offerDetails;
  const [isOpen, setIsOpen] = useState(false);

  const discountLabel =
    discountType === "percentage" ? `${discountValue}%` : `$${discountValue}`;

  return (
    <motion.div
      onClick={() => setIsOpen((v) => !v)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      whileHover={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        transition: { duration: 0.2 },
      }}
      className="h-fit cursor-pointer rounded-2xl border border-black/5 bg-white p-5"
    >
      <p className="mb-2 text-right text-xs font-medium text-gray-500">
        Valid till:{" "}
        <span className="font-semibold text-green-500">{endDate}</span>
      </p>

      <div className="md:grid md:grid-cols-3">
        <div className="flex h-full items-center justify-center">
          {fromPage === "categories" && offerDetails.store ? (
            <Link href={`/stores/${offerDetails.store.slug}`}>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={offerDetails.store.image}
                  alt="logo"
                  width={200}
                  height={100}
                />
              </div>
            </Link>
          ) : (
            <div
              className="hidden items-center justify-center rounded-xl p-3 font-[var(--font-display)] text-5xl font-extrabold text-white md:flex md:size-[180px]"
              style={{
                background:
                  "linear-gradient(135deg, #0072a0 0%, #0092c0 100%)",
                boxShadow: "0 8px 24px rgba(0,114,160,0.3)",
              }}
            >
              {discountLabel}
            </div>
          )}
        </div>

        <div className="col-span-2 md:pl-5">
          {fromPage === "stores" ? (
            <div className="grid grid-cols-5 md:block">
              <div className="md:hidden">
                <div
                  className="mr-3 flex w-fit items-center justify-center rounded-xl p-2 font-[var(--font-display)] text-3xl font-extrabold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #0072a0 0%, #0092c0 100%)",
                  }}
                >
                  {discountLabel}
                </div>
              </div>
              <h3 className="col-span-4 line-clamp-2 font-[var(--font-display)] text-2xl font-bold leading-[1.2] md:col-span-5">
                {title}
              </h3>
            </div>
          ) : (
            <h3 className="line-clamp-2 font-[var(--font-display)] text-2xl font-bold leading-[1.2]">
              {title}
            </h3>
          )}

          <div
            className="page-html mt-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="flex justify-center p-4">
            {offerType === "coupon" ? (
              <CodeRevealingButton
                code={couponCode}
                affURL={affURL}
                image={image}
                storeName={storeName}
              />
            ) : (
              <Link href={`/deals/${slug}`} onClick={(e) => e.stopPropagation()}>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="mb-5 inline-flex h-10 items-center justify-center rounded-xl bg-brand-900 px-14 text-[15px] font-semibold tracking-[0.5px] text-white shadow-lg transition-colors hover:bg-brand-800 active:bg-brand-700 md:h-12 md:text-base"
                  style={{ boxShadow: "0 8px 24px rgba(0,114,160,0.35)" }}
                >
                  Get Deal
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-2 flex h-9 w-full items-center justify-between rounded-lg border border-black/5 bg-white px-4 text-[13px] font-normal text-gray-600 hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex"
          >
            <ChevronDown className="size-4" />
          </motion.span>
          Show Details
        </span>
        <Info className="size-3.5" />
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
            <div className="mt-3 pb-2 px-5">
              <div
                className="page-html text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: TnC }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
