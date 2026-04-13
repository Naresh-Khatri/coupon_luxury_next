import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Link as LinkIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - CouponLuxury",
  alternates: { canonical: "https://www.couponluxury.com/contact" },
};

const socialLinks = [
  { href: "https://facebook.com/CouponLuxury/", Icon: Facebook, color: "#4267B2" },
  { href: "https://twitter.com/coupon_luxury", Icon: Twitter, color: "#1DA1F2" },
  {
    href: "https://www.instagram.com/couponluxury/",
    Icon: Instagram,
    color: "#E1306C",
  },
  {
    href: "https://youtube.com/channel/UCiGBpYZFIzyw_R5W1KUocJQ",
    Icon: Youtube,
    color: "#FF0000",
  },
  {
    href: "https://www.pinterest.com/couponluxury/",
    Icon: LinkIcon,
    color: "#E60023",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen w-screen bg-[#ebf8ff] pb-10 pt-24 md:pt-36">
      <div className="mx-auto flex h-full w-full max-w-[1240px] flex-col items-center justify-center">
        <div className="mb-10 -mt-20">
          <h1 className="py-3 text-4xl font-extrabold leading-none text-brand-900 md:text-5xl">
            Contact Us
          </h1>
          <div className="font-extrabold text-brand-900">
            <Link href="mailto:contact@couponluxury.com">
              contact@couponluxury.com
            </Link>
          </div>
          <nav className="mt-2 flex items-center gap-7">
            {socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-12 items-center justify-center rounded-md bg-white shadow"
              >
                <s.Icon className="size-8" color={s.color} />
              </a>
            ))}
          </nav>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="w-full">
              <iframe
                id="map"
                title="map"
                src="https://maps.google.com/maps?q=gorgaon&output=embed"
                height="450"
                width="100%"
                loading="lazy"
                className="rounded-xl"
              />
            </div>
            <div className="hidden md:block">
              <Image
                src="/assets/contact_us.svg"
                alt="contact couponluxury"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
