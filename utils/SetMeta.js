import Head from "next/head";
import React from "react";

function SetMeta({ title, description, keywords, image, url }) {
  title = title
    ? title
    : "Couponluxury: Deals, coupon codes, Discounts & offers";
  description = description
    ? description
    : `Avail the most luxurious deals and promo codes to get the best discount offers while shopping from brands. Exclusive coupon codes available on CouponLuxury`;
  keywords = keywords
    ? keywords
    : `coupons, coupon codes, promo codes, discount codes, deals, online shopping, offers, vouchers, cashbacks`;
  image = image
    ? image
    : "https://ik.imagekit.io/couponluxury/zyro-image__3__2Dw77Pooe.png";
  url = url ? url : "https://www.couponluxury.com/";

  return (
    <Head>
      {/* TITLE */}
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      {/* DESCRIPTION */}
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />

      {/* KEYWORDS */}
      <meta name="keywords" content={keywords} />

      {/* IMAGES */}
      <meta property="og:image" content={image} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image" content={image} />
      <meta
        name="twitter:image:alt"
        content="CouponLuxury.com Coupon Codes and Discounts"
      />
      <meta itemProp="image" content={image} />

      {/* URL */}
      <meta name="url" content={url.toLowerCase()} />
      <meta property="og:url" content={url.toLowerCase()} />
      <meta name="twitter:url" content={url.toLowerCase()} />
      <link rel="canonical" href={url.toLowerCase()} />
    </Head>
  );
}

export default SetMeta;
