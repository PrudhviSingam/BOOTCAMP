import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile photos
      },
      {
        protocol: "https",
        hostname: "i.etsystatic.com", // Etsy product images
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com", // Amazon product images
      },
      {
        protocol: "https",
        hostname: "pinkflowerdesigns.co.uk", // Tote bag product image
      },
      {
        protocol: "https",
        hostname: "img.evetech.co.za", // Wireless mouse product image
      },
      {
        protocol: "https",
        hostname: "i.rtings.com", // Printer product image
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net", // Marshall speaker product image
      },
    ],
  },
};

export default nextConfig;
