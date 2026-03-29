/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Disable font optimization for better consistency
  optimizeFonts: false,
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Ignore TypeScript and ESLint errors to speed up builds (run these separately)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
