import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* THESE ARE ONLY THE DEFAULT HEAD TAGS.  */}
        <meta name="theme-color" content="#0072a0" />
        <meta
          name="author"
          content="Coupons Luxury, Affiliates, Offers, Deals"
        />

        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="CouponLuxury.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CouponLuxury" />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="https://ik.imagekit.io/couponluxury/tr:w-128/logo_13BHLbKp9"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="https://ik.imagekit.io/couponluxury/tr:w-96/logo_13BHLbKp9"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://ik.imagekit.io/couponluxury/tr:w-32/logo_13BHLbKp9"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://ik.imagekit.io/couponluxury/tr:w-16/logo_13BHLbKp9"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
