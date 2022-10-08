/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["ik.imagekit.io"],
  },
  env: {
    // domain: 'http://localhost:4000',
    domain: "https://apiv2.couponluxury.com",
  },
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
// module.exports = withBundleAnalyzer({
//   reactStrictMode: true,
// });
