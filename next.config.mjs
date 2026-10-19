/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Disable font optimization for better consistency
  optimizeFonts: false,
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@coinbase\/cdp-sdk|@base-org\/account|@x402/,
      })
    );
    return config;
  },
}

export default nextConfig;
