import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NL23HH5');`,
          }}
        />
        {/* THESE ARE ONLY THE DEFAULT HEAD TAGS.  */}
        <meta name="verify-admitad" content="38dc9f2a03" />
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
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
        {/* <link */}
        {/*   rel="preconnect" */}
        {/*   href="https://fonts.gstatic.com" */}
        {/*   crossOrigin="true" */}
        {/* /> */}
        {/* <link */}
        {/*   href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" */}
        {/*   rel="stylesheet" */}
        {/* /> */}
        <link rel="icon" href="/favicon.ico" />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2253863056028852"
          crossorigin="anonymous"
        ></script>
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NL23HH5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
