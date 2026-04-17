import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 CouponLuxury",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <>
      <h1 hidden>404 CouponLuxury</h1>
      <div className="flex h-screen w-screen flex-col items-center justify-center pt-24">
        <p className="-mt-36 text-[150px] font-bold text-brand-900 md:text-[200px]">
          404
        </p>
        <p className="-mt-10 mb-10 text-xl font-semibold text-brand-900">
          Oh no! The page is not found.
        </p>
        <div className="h-[200px] w-[200px] md:h-[300px] md:w-[300px]">
          <Image
            src="/assets/404.svg"
            width={300}
            height={300}
            alt="404"
          />
        </div>
        <Link
          href="/"
          className="mt-5 mb-5 inline-flex h-[50px] w-[136px] items-center justify-center rounded-md bg-brand-900 px-5 text-xl text-white shadow-xl transition-colors hover:bg-brand-800"
          style={{ boxShadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.5)" }}
        >
          GO HOME
        </Link>
      </div>
    </>
  );
}
