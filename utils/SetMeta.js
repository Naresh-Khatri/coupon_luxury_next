import Head from "next/head";
import React from "react";

function SetMeta({ title, description, keywords, image, url }) {
  return (
    <Head>
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {keywords && (
        <>
          <meta name="keywords" content={keywords} />
        </>
      )}
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta name="twitter:image" content={image} />
        </>
      )}
      {url && (
        <>
          <meta name="url" content={url.toLowerCase()} />
          <meta property="og:url" content={url.toLowerCase()} />
          <meta name="twitter:url" content={url.toLowerCase()} />
          <link rel="canonical" href={url.toLowerCase()} />
        </>
      )}
      {!url && <link rel="canonical" href="https://www.couponluxury.com" />}
    </Head>
  );
}

export default SetMeta;
