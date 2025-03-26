import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const isAdminSubdomain = host.startsWith('admin.')
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  
  // If it's the admin subdomain, rewrite to /admin path
  if (isAdminSubdomain) {
    const url = request.nextUrl.clone()
    url.pathname = `/admin${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Handle authentication for admin routes
  if (isAdminPath || isAdminSubdomain) {
    const token = request.cookies.get('token')?.value

    // Don't protect the login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on all paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 