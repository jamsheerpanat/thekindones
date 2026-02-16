/** @type {import('next').NextConfig} */
const nextConfig = {

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
