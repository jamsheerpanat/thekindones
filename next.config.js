/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/tko',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bleep-bucket.imgix.net"
      }
    ]
  }
};

module.exports = nextConfig;
