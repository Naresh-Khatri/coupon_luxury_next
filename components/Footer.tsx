"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Link as LinkIcon,
} from "lucide-react";

const socialLinks = [
  {
    href: "https://facebook.com/CouponLuxury/",
    Icon: Facebook,
    label: "Facebook",
    color: "#4267B2",
  },
  {
    href: "https://twitter.com/coupon_luxury",
    Icon: Twitter,
    label: "Twitter",
    color: "#1DA1F2",
  },
  {
    href: "https://www.instagram.com/couponluxury/",
    Icon: Instagram,
    label: "Instagram",
    color: "#E1306C",
  },
  {
    href: "https://youtube.com/channel/UCiGBpYZFIzyw_R5W1KUocJQ",
    Icon: Youtube,
    label: "YouTube",
    color: "#FF0000",
  },
  {
    href: "https://www.pinterest.com/couponluxury/",
    Icon: LinkIcon,
    label: "Pinterest",
    color: "#E60023",
  },
];

const quickLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const categoryLinks = [
  { label: "Appliances", href: "/categories/appliances" },
  { label: "Books", href: "/categories/books" },
  { label: "Travel", href: "/categories/travel" },
  { label: "Beauty", href: "/categories/beauty" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[2.5px] text-gold">
      {children}
    </h4>
  );
}

export default function Footer() {
  return (
    <motion.footer
      className="relative overflow-hidden bg-navy px-4 pt-14 pb-8 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent, #C49A3C 30%, #0092c0 70%, transparent)",
        }}
      />
      <div className="pointer-events-none absolute -top-[100px] -right-[100px] size-[400px] rounded-full border-[80px] border-[rgba(0,146,192,0.04)]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-start gap-3">
            <FooterHeading>Contact</FooterHeading>
            <address className="not-italic text-sm leading-[1.7] text-white/60">
              81a, National House, Alkapuri,
              <br />
              Vadodara, Gujarat – 390005
            </address>
            <a
              href="mailto:contact@couponluxury.com"
              className="text-sm text-white/70 transition-colors hover:text-gold"
            >
              contact@couponluxury.com
            </a>
          </div>

          <div className="flex flex-col items-start gap-3">
            <FooterHeading>Quick Links</FooterHeading>
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/70 transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3">
            <FooterHeading>Categories</FooterHeading>
            <div className="flex flex-wrap gap-2">
              {categoryLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <FooterHeading>Follow Us</FooterHeading>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit our ${s.label} page`}
                >
                  <motion.span
                    whileHover={{
                      scale: 1.15,
                      backgroundColor: s.color,
                      color: "#fff",
                    }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80"
                  >
                    <s.Icon className="size-4" />
                  </motion.span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="mb-6 border-white/10" />

        <div>
          <p className="text-sm font-medium text-white/60">
            © {new Date().getFullYear()} All rights reserved by{" "}
            <span className="font-semibold text-white/80">Coupon Luxury</span>.
          </p>
          <p className="mt-2 max-w-[520px] text-xs leading-[1.7] text-white/40">
            If you make a purchase after clicking on the links on this site,
            couponluxury.com may earn an affiliate commission from the site you
            visit.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
