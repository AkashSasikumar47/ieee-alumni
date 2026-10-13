import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ieee/ui", "@ieee/supabase"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uiaiouvmjptfpeqqeomw.supabase.co",
        pathname: "/storage/v1/object/public/ieee-alumni-photos/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
