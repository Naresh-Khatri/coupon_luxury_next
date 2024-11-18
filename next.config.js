const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
  env: {
    domain: "https://apiv2.couponluxury.com",
  },
};

module.exports = nextConfig;
