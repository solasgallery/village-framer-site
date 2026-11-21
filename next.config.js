/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    const r = (source, destination) => ({ source, destination, statusCode: 301 });
    return [
      r("/design", "/start-framing"),
      r("/studio", "/start-framing"),
      // 16 thin town pages consolidated into one service-area page
      r("/area", "/service-area"),
      r("/area/:city", "/service-area"),
      r("/journal", "/guides"),
      r("/journal/framing-oversized-art", "/services/oversized-framing"),
      r("/journal/choosing-a-frame-and-mat", "/guides/float-mount-vs-mat"),
      r("/journal/:slug", "/guides"),
    ];
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
