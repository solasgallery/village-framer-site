/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // The old /studio visualizer is retired; /design replaces it.
    return [{ source: '/studio', destination: '/design', permanent: true }]
  },
  async rewrites() {
    return [
      { source: '/trade', destination: '/trade/index.html' },
      { source: '/trade/apply', destination: '/trade/apply.html' },
      { source: '/trade/faq', destination: '/trade/faq.html' },
      { source: '/trade/events', destination: '/trade/events.html' },
    ]
  },
}

module.exports = nextConfig
