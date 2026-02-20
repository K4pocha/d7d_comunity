import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://d7d.cl', //  inicio
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1, // Prioridad máxima
    },
    {
      url: 'https://d7d.cl/noticias',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://d7d.cl/equipos',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://d7d.cl/torneos',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}