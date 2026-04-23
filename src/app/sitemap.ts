import type { MetadataRoute } from 'next'

const BASE = 'https://saladovillageframer.com'

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',                     priority: 1.0, changeFrequency: 'weekly' },
  { path: '/services',            priority: 0.9, changeFrequency: 'monthly' },
  { path: '/gallery',             priority: 0.8, changeFrequency: 'weekly' },
  { path: '/visit',               priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact',             priority: 0.7, changeFrequency: 'yearly' },
  { path: '/area/austin',         priority: 0.6, changeFrequency: 'monthly' },
  { path: '/area/round-rock',     priority: 0.6, changeFrequency: 'monthly' },
  { path: '/area/georgetown',     priority: 0.6, changeFrequency: 'monthly' },
  { path: '/area/temple',         priority: 0.6, changeFrequency: 'monthly' },
  { path: '/area/killeen',        priority: 0.6, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
