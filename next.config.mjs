/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable font optimization for better consistency
  optimizeFonts: false,
  webpack: (config) => {
    config.resolve ??= {}
    config.resolve.alias ??= {}

    Object.assign(config.resolve.alias, {
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    })

    return config
  },
}

export default nextConfig;
