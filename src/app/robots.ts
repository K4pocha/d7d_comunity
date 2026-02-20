import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Oculta el panel de admin a Google
    },
    sitemap: 'https://d7d.cl/sitemap.xml',
  }
}