/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.inovasi.top' },
      { protocol: 'https', hostname: '**.inovasiadiwarna.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
  transpilePackages: ['geist'],
}

module.exports = nextConfig
