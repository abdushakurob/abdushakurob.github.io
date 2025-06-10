import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const contentType = 'image/png'

export async function GET(request: NextRequest) {
  try {
    // Font loading
    const fontData = await fetch(
      new URL('/public/fonts/Satoshi-Variable.woff2', import.meta.url)
    ).then((res) => res.arrayBuffer())
    
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Abdushakur'
    const type = searchParams.get('type') || 'page'

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'blog':
          return '#3B82F6' // Blue
        case 'project':
          return '#10B981' // Green
        default:
          return '#6366F1' // Indigo
      }
    }

    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'blog':
          return 'Blog Post'
        case 'project':
          return 'Project'
        default:
          return 'Page'
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Satoshi, system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            {/* Type badge */}
            <div
              style={{
                background: getTypeColor(type),
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {getTypeLabel(type)}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 40 ? '48px' : '64px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: '1.2',
                margin: '0 0 24px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>

            {/* Author */}
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: '500',
              }}
            >
              by Abdushakur
            </div>
          </div>

          {/* Website URL */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: '20px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '500',
            }}
          >
            abdushakur.me
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error('Error generating OG image:', e)
    return new Response('Failed to generate image', {
      status: 500,
    })
  }
}
