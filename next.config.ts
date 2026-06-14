import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Anciennes URLs SiteW → nouvelles URLs
      {
        source: "/A-propos",
        destination: "/fr/about",
        permanent: true,
      },
      {
        source: "/City-Tours",
        destination: "/fr/tours",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
