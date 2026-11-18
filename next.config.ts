import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disables noisy eslint/ts build blocking during production bundle optimization
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
