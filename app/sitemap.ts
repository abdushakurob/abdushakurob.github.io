import { MetadataRoute } from 'next'
import connectDB from '@/lib/dbConfig'
import Project from '@/models/Projects'
import Writing from '@/models/Writings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abdushakur.me'
  const currentDate = new Date()
  
  // Helper function to generate ISO date strings with timezone
  const formatDate = (date: Date): string => {
    return date.toISOString()
  }
  
  // Static pages with improved timestamps
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: formatDate(currentDate),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: formatDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)), // 1 week ago
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: formatDate(currentDate),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writings`,
      lastModified: formatDate(currentDate),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/build`,
      lastModified: formatDate(new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: formatDate(currentDate),
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ]

  try {
    await connectDB()

    // Get published projects
    const projects = await Project.find({ status: 'published' })
      .select('slug updatedAt priority tags')
      .lean()

    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: formatDate(new Date(project.updatedAt)),
      changeFrequency: project.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 'weekly' : 'monthly',
      priority: project.priority ? parseFloat(project.priority) : 0.7,
    }))

    // Get published writings
    const writings = await Writing.find({ status: 'published' })
      .select('slug updatedAt featured publishedAt')
      .sort({ publishedAt: -1 })
      .lean()

    const writingPages: MetadataRoute.Sitemap = writings.map((writing, index) => ({
      url: `${baseUrl}/writings/${writing.slug}`,
      lastModified: formatDate(new Date(writing.updatedAt)),
      // More recent writings get higher changeFrequency
      changeFrequency: index < 5 ? 'weekly' : 'monthly',
      // Featured or recent writings get higher priority
      priority: writing.featured ? 0.9 : (index < 10 ? 0.8 : 0.7),
    }))

    return [...staticPages, ...projectPages, ...writingPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
