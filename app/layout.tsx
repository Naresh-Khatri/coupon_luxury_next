import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/lib/trpc/Provider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.couponluxury.com"),
  title: {
    default: "Couponluxury: Deals, coupon codes, Discounts & offers",
    template: "%s | CouponLuxury",
  },
  description:
    "Avail the most luxurious deals and promo codes to get the best discount offers while shopping from brands. Exclusive coupon codes available on CouponLuxury",
  keywords:
    "coupons, coupon codes, promo codes, discount codes, deals, online shopping, offers, vouchers, cashbacks",
  authors: [{ name: "Coupons Luxury, Affiliates, Offers, Deals" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    siteName: "CouponLuxury.com",
    url: "https://www.couponluxury.com/",
    images: ["https://ik.imagekit.io/couponluxury/zyro-image__3__2Dw77Pooe.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CouponLuxury",
    images: ["https://ik.imagekit.io/couponluxury/zyro-image__3__2Dw77Pooe.png"],
  },
  other: {
    "verify-admitad": "38dc9f2a03",
  },
  icons: {
    icon: [
      {
        url: "https://ik.imagekit.io/couponluxury/tr:w-128/logo_13BHLbKp9",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "https://ik.imagekit.io/couponluxury/tr:w-96/logo_13BHLbKp9",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "https://ik.imagekit.io/couponluxury/tr:w-32/logo_13BHLbKp9",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://ik.imagekit.io/couponluxury/tr:w-16/logo_13BHLbKp9",
        sizes: "16x16",
        type: "image/png",
      },
      { url: "/favicon.ico" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0072a0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NL23HH5');`}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2253863056028852"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NL23HH5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <NuqsAdapter>
          <TRPCProvider>{children}</TRPCProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
