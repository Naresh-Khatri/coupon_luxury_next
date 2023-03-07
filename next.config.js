const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["ik.imagekit.io"],
  },
  env: {
    domain: "https://apiv2.couponluxury.com",
  },
};

module.exports = nextConfig;
