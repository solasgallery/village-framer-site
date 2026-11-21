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
      // Undated events page removed 2026-11-21; /trade is the one trade entry point
      r("/trade/events", "/trade"),
      // Old static trade files (live today, 200) — rebuilt as Next pages
      r("/trade/index.html", "/trade"),
      r("/trade/apply.html", "/trade/apply"),
      r("/trade/faq.html", "/trade/faq"),
      r("/trade/events.html", "/trade"),
    ];
  },
}

module.exports = nextConfig
