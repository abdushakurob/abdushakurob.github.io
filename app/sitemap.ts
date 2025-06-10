import { MetadataRoute } from 'next'
import connectDB from '@/lib/dbConfig'
import Project from '@/models/Projects'
import Writing from '@/models/Writings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abdushakur.me'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/build`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    await connectDB()

    // Get published projects
    const projects = await Project.find({ status: 'published' })
      .select('slug updatedAt')
      .lean()

    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    // Get published writings
    const writings = await Writing.find({ status: 'published' })
      .select('slug updatedAt')
      .lean()

    const writingPages: MetadataRoute.Sitemap = writings.map((writing) => ({
      url: `${baseUrl}/writings/${writing.slug}`,
      lastModified: new Date(writing.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    return [...staticPages, ...projectPages, ...writingPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
