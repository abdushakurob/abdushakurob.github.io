import { NextResponse } from 'next/server'
import connectDB from '@/lib/dbConfig'
import Writing from '@/models/Writings'

export async function GET() {
  try {
    await connectDB()
    
    const writings = await Writing.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const baseUrl = 'https://abdushakur.me'
    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Abdushakur's Blog</title>
  <description>Articles, tutorials, and thoughts on web development, design, and technology by Abdushakur</description>
  <link>${baseUrl}/writings</link>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  <language>en-US</language>
  <managingEditor>hello@abdushakur.me (Abdushakur)</managingEditor>
  <webMaster>hello@abdushakur.me (Abdushakur)</webMaster>
  <copyright>Copyright ${new Date().getFullYear()} Abdushakur</copyright>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <generator>Next.js</generator>
  ${writings
    .map(
      (writing) => `
  <item>
    <title><![CDATA[${writing.title}]]></title>
    <description><![CDATA[${writing.excerpt || writing.content?.substring(0, 200) || writing.title}]]></description>
    <link>${baseUrl}/writings/${writing.slug}</link>
    <guid isPermaLink="true">${baseUrl}/writings/${writing.slug}</guid>
    <pubDate>${new Date(writing.publishedAt || writing.createdAt).toUTCString()}</pubDate>
    <author>hello@abdushakur.me (Abdushakur)</author>
    ${writing.category ? `<category>${writing.category}</category>` : ''}
    ${writing.tags?.map(tag => `<category>${tag}</category>`).join('') || ''}
  </item>`
    )
    .join('')}
</channel>
</rss>`

    return new NextResponse(feedXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}
