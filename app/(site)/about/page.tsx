import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - CouponLuxury",
  alternates: { canonical: "https://www.couponluxury.com/about" },
};

export default function AboutUs() {
  return (
    <div className="min-h-screen w-screen bg-[#ebf8ff] pb-10 md:pt-24">
      <div className="mx-auto h-full w-full max-w-[1240px]">
        <div className="flex h-full items-center justify-center">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="hidden md:block">
              <Image
                src="/assets/about_us.svg"
                alt="about couponluxury"
                width={500}
                height={500}
              />
            </div>
            <div>
              <h1 className="py-7 text-4xl font-extrabold leading-none text-brand-900 md:text-5xl">
                About Us
              </h1>
              <p className="pb-3">
                CouponLuxury is a trusted global brand that is well-known for
                its best online coupon code, promo code, deals &amp; discount
                codes. As a company with an award-winning user interface and a
                world-class user experience, we are known for maintaining high
                standards. Authentic, up-to-date coupons and deals have always
                been our USP. As a leading player in the coupon and deals
                industry, CouponLuxury has won lots of customer satisfaction.
                They will help you save money while shopping online from brands
                like amazon, Nike, shein etc.
              </p>
              <p className="pb-3">
                Founded in 2022, we provide the best coupons and deals to our
                customers and bring benefits both to us and our affiliates
                through our strategic B2B partnerships. We increase revenue,
                create brand awareness, and extend the reach of companies
                through our business partnership programs. The objective of our
                network is to provide end-consumers with the best deals through
                cross-promotion among merchants and strategic companies. In
                spite of the fact that CouponLuxury receives partnership
                requests in bulk every day, we intend to partner with businesses
                that offer our users just what they want. Ultimately, it&lsquo;s
                all about saving our users money!
              </p>
              <div className="text-right text-brand-900">
                <Link href="mailto:contact@couponluxury.com">
                  contact@couponluxury.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
